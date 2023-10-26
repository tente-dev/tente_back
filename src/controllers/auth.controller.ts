import {TokenService} from '@loopback/authentication';
import {
  Credentials,
  User as JwtUser,
  MyUserService,
  TokenServiceBindings,
  UserServiceBindings,
} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  HttpErrors,
  Response,
  RestBindings,
  SchemaObject,
  get,
  getModelSchemaRef,
  param,
  post,
  requestBody,
  response,
} from '@loopback/rest';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {compare, genSalt, hash} from 'bcryptjs';
import {LoginTicket, OAuth2Client} from 'google-auth-library';
import {User} from '../models';
import {UserRepository} from '../repositories';
import {sendActivationEmail, sendForgotPasswordEmail} from '../utils/email';
import {
  generateActivationLink,
  generateForgotPasswordLink,
} from '../utils/link-generator';

const CredentialsSchema: SchemaObject = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
    },
  },
};

const GoogleAuthSchema: SchemaObject = {
  type: 'object',
  required: ['idToken', 'email'],
  properties: {
    idToken: {
      type: 'string',
    },
  },
};

export const GoogleCredentialsRequestBody = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': {schema: GoogleAuthSchema},
  },
};

export const CredentialsRequestBody = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': {schema: CredentialsSchema},
  },
};

const SendEmailSchema: SchemaObject = {
  type: 'object',
  required: ['email'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
  },
};

export const SendEmailSchemaRequestBody = {
  description: 'The input resend email service',
  required: true,
  content: {
    'application/json': {schema: SendEmailSchema},
  },
};

const ResetPasswordSchema: SchemaObject = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
    },
  },
};

export const ResetPasswordSchemaRequestBody = {
  description: 'The input for reset password',
  required: true,
  content: {
    'application/json': {schema: ResetPasswordSchema},
  },
};

export interface GoogleCredentials {
  idToken: string;
}

export class AuthController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: MyUserService,
    @inject(SecurityBindings.USER, {optional: true})
    public user: UserProfile,
    @inject(RestBindings.Http.RESPONSE) protected httpResponse: Response,
  ) { }
  private async _findUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({where: {email}});
    if (!user) throw new HttpErrors.NotFound(`No user found with email: ${email}`);
    return user;
  }



  @post('/auth/register')
  @response(200, {
    description: 'User model instance',
    content: {'application/json': {schema: getModelSchemaRef(User)}},
  })
  async registerUser(@requestBody({
    content: {
      'application/json': {
        schema: getModelSchemaRef(User, {
          title: 'NewUser',
          exclude: ['id', 'userTypeId'],
        }),
      },
    },
  }) user: Omit<User, 'id'>): Promise<User> {

    // Check if the user already exists
    if (await this.userRepository.findOne({where: {email: user.email}})) {
      throw new HttpErrors.Conflict(`Account already exists with email: ${user.email}`);
    }

    // Hash password and set user type
    user.password = await this._hashPassword(user.password);
    user.userTypeId = 1;

    // Create user in the repository
    const createdUser = await this.userRepository.create(user);

    // Generate and save the verify token
    const verifyToken = await this._generateVerifyToken(createdUser);
    await this.userRepository.updateById(createdUser.id, {verifyToken});

    // Send activation email to the user
    const link = generateActivationLink(createdUser.id as number, verifyToken);
    await sendActivationEmail(createdUser.firstname, createdUser.email, link);

    return createdUser;
  }

  private async _hashPassword(password: string): Promise<string> {
    const salt = await genSalt(12);
    return await hash(password, salt);
  }

  private async _generateVerifyToken(user: User): Promise<string> {
    return await hash(user.id + user.email + Date.now(), await genSalt(10));
  }

  @post('/auth/login')
  @response(200, {
    description: 'User model instance',
    content: {'application/json': {schema: getModelSchemaRef(User)}},
  })
  async login(
    @requestBody(CredentialsRequestBody) credentials: Credentials,
  ): Promise<{token: string}> {
    const user = await this.userRepository.findOne({
      where: {email: credentials.email, socialAuth: null},
    });
    if (!user) throw HttpErrors.NotFound('Usuario o contraseña incorrectas.');
    if (!user.verified)
      throw HttpErrors.PreconditionRequired(
        'Verifica tu correo para continuar.',
      );
    const match = await compare(credentials.password, user.password);
    if (!match)
      throw HttpErrors.Unauthorized('Usuario o contraseña incorrectas.');
    const userProfile = this.userService.convertToUserProfile(
      user as unknown as JwtUser,
    );
    const token = await this.jwtService.generateToken(userProfile);
    return {token};
  }

  @post('/auth/social/google')
  @response(200, {
    description: 'Google auth',
    content: {'application/json': {schema: getModelSchemaRef(User)}},
  })
  async googleAuth(
    @requestBody(GoogleCredentialsRequestBody) credentials: GoogleCredentials,
  ): Promise<{token: string}> {
    const {idToken} = credentials;
    const oAuth2Client = new OAuth2Client();
    let result: LoginTicket | undefined = undefined;
    try {
      result = await oAuth2Client.verifyIdToken({
        idToken,
      });
    } catch (error) {
      console.log(error);
      throw HttpErrors.Unauthorized('Usuario o contraseña incorrectas.');
    }
    const email = result.getPayload()?.email ?? '';
    const user = await this.userRepository.findOne({
      where: {email: email, socialAuth: null},
    });
    if (user) {
      throw HttpErrors.Conflict('Ya existe un usuario con este correo.');
    }
    let socialUser = await this.userRepository.findOne({
      where: {email: email, socialAuth: 'google'},
    });
    if (!socialUser) {
      socialUser = await this.userRepository.create({
        email,
        password: await hash(
          result.getUserId() ?? new Date().getTime().toString(),
          await genSalt(12),
        ),
        socialAuth: 'google',
        firstname: result.getPayload()?.given_name,
        lastname: result.getPayload()?.family_name,
        verified: 1,
        userTypeId: 1,
      });
    }
    const userProfile = this.userService.convertToUserProfile(
      socialUser as unknown as JwtUser,
    );
    const token = await this.jwtService.generateToken(userProfile);
    return {token};
  }

  @post('/auth/resend-activation-email')
  @response(200, {
    description: 'Email sent',
  })
  async resendActivationEmail(
    @requestBody(SendEmailSchemaRequestBody) body: {email: string},
  ): Promise<void> {
    const existingUser = await this.userRepository.findOne({
      where: {email: body.email},
    });
    if (!existingUser) {
      throw new HttpErrors.NotFound(
        `No existe una cuenta con el correo ${body.email}.`,
      );
    }
    const link = generateActivationLink(
      existingUser.id as number,
      existingUser.verifyToken as string,
    );
    await sendActivationEmail(existingUser.firstname, existingUser.email, link);
    return;
  }

  @get('/auth/verify-email/{params}')
  @response(200)
  async verifyEmail(
    @param.path.string('params') params: string,
  ): Promise<object> {
    const decodedParams = Buffer.from(params, 'base64').toString('ascii');
    const queryParams = new URLSearchParams(decodedParams.replace('?', ''));
    const paramObject = Object.fromEntries(queryParams.entries());
    if (!paramObject.id || !paramObject.token) {
      throw new HttpErrors.BadRequest('Parametros no válidos.');
    }
    const existingUser = await this.userRepository.findById(
      Number(paramObject.id),
    );
    if (!existingUser) {
      throw new HttpErrors.BadRequest('El usuario no existe.');
    }
    await this.userRepository.updateById(existingUser.id, {verified: 1});
    return {message: 'Correo verificado!'};
  }

  @post('/auth/forgot-password')
  @response(200, {
    description: 'Email sent',
  })
  async forgotPassword(
    @requestBody(SendEmailSchemaRequestBody) body: {email: string},
  ): Promise<void> {
    const existingUser = await this.userRepository.findOne({
      where: {email: body.email, socialAuth: null},
    });
    if (!existingUser) {
      return;
    }
    const resetToken = await hash(
      existingUser.email + Date.now() + existingUser.id,
      await genSalt(),
    );
    const link = generateForgotPasswordLink(
      resetToken as string,
      existingUser.email as string,
    );
    await this.userRepository.updateById(existingUser.id, {
      resetToken,
    });
    await sendForgotPasswordEmail(existingUser.email, link);
    return;
  }

  @post('/auth/reset-password')
  @response(200, {
    description: 'Reset password',
  })
  async resetPassword(
    @requestBody(ResetPasswordSchemaRequestBody)
    body: {
      email: string;
      password: string;
      resetToken: string;
    },
  ): Promise<void> {
    const existingUser = await this.userRepository.findOne({
      where: {email: body.email, socialAuth: null, resetToken: body.resetToken},
    });
    if (!existingUser) {
      throw new HttpErrors.NotFound('Usuario no encontrado.');
    }
    const password = await hash(body.password, await genSalt(12));
    existingUser.password = password;
    await this.userRepository.update(existingUser);
    return;
  }
}
