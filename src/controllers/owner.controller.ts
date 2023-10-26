import {TokenService} from '@loopback/authentication';
import {TokenServiceBindings} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  Request,
  requestBody,
  Response,
  response,
  RestBindings,
} from '@loopback/rest';
import {FILE_UPLOAD_SERVICE} from '../keys/file';
import {File, Owner} from '../models';
import {FileRepository, OwnerRepository} from '../repositories';
import {FileUploadHandler} from '../types/file';
import {createFile, errorHandler} from '../utils/file';
import {getUserInfo} from '../utils/user';
import {FileController} from './file.controller';

// @authenticate('jwt')
export class OwnerController {
  constructor(
    @repository(OwnerRepository)
    public ownerRepository: OwnerRepository,
    @repository(FileRepository)
    public fileRepository: FileRepository,
    @inject(FILE_UPLOAD_SERVICE) private fileUploader: FileUploadHandler,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
  ) {}

  @post('/owners')
  @response(200, {
    description: 'Owner model instance',
    content: {'application/json': {schema: getModelSchemaRef(Owner)}},
  })
  async create(
    @requestBody.file()
    request: Request,
    @inject(RestBindings.Http.RESPONSE) res: Response,
  ): Promise<Owner> {
    let owner = {} as Owner;
    let file = {} as globalThis.Express.Multer.File;
    let createdFile = {} as File;
    const user = await getUserInfo(request, this.jwtService);

    const filePromise = new Promise<object>((resolve, reject) => {
      this.fileUploader(request, res, (err: unknown) => {
        const requestParams = FileController.getFilesAndFields(request);
        file = requestParams.files[0] as globalThis.Express.Multer.File;
        owner = requestParams.fields;
        return errorHandler(err, resolve, reject, request);
      });
    });

    const result = (await filePromise) as {
      files: globalThis.Express.Multer.File[];
    };

    if (file) {
      createdFile = await createFile(
        request,
        result.files[0],
        user.id,
        this.fileRepository,
      );
    }

    const createdOwner = await this.ownerRepository.create({
      ...owner,
      identificationPhotoId: createdFile?.id,
    });

    return this.ownerRepository.findById(createdOwner.id);
  }

  @get('/owners/count')
  @response(200, {
    description: 'Owner model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Owner) where?: Where<Owner>): Promise<Count> {
    return this.ownerRepository.count(where);
  }

  @get('/owners')
  @response(200, {
    description: 'Array of Owner model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Owner, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Owner) filter?: Filter<Owner>): Promise<Owner[]> {
    return this.ownerRepository.find(filter);
  }

  @patch('/owners')
  @response(200, {
    description: 'Owner PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Owner, {partial: true}),
        },
      },
    })
    owner: Owner,
    @param.where(Owner) where?: Where<Owner>,
  ): Promise<Count> {
    return this.ownerRepository.updateAll(owner, where);
  }

  @get('/owners/{id}')
  @response(200, {
    description: 'Owner model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Owner, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Owner, {exclude: 'where'})
    filter?: FilterExcludingWhere<Owner>,
  ): Promise<Owner> {
    return this.ownerRepository.findById(id, filter);
  }

  @patch('/owners/{id}')
  @response(204, {
    description: 'Owner PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Owner, {partial: true}),
        },
      },
    })
    owner: Owner,
  ): Promise<void> {
    await this.ownerRepository.updateById(id, owner);
  }

  @put('/owners/{id}')
  @response(204, {
    description: 'Owner PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() owner: Owner,
  ): Promise<void> {
    await this.ownerRepository.replaceById(id, owner);
  }

  @del('/owners/{id}')
  @response(204, {
    description: 'Owner DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.ownerRepository.deleteById(id);
  }
}
