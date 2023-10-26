import {authenticate} from '@loopback/authentication';
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
  requestBody,
  response,
} from '@loopback/rest';
import {UserType} from '../models';
import {UserTypeRepository} from '../repositories';

@authenticate('jwt')
export class UserTypesController {
  constructor(
    @repository(UserTypeRepository)
    public userTypeRepository: UserTypeRepository,
  ) {}

  @post('/user-types')
  @response(200, {
    description: 'UserType model instance',
    content: {'application/json': {schema: getModelSchemaRef(UserType)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserType, {
            title: 'NewUserType',
            exclude: ['id'],
          }),
        },
      },
    })
    userType: Omit<UserType, 'id'>,
  ): Promise<UserType> {
    return this.userTypeRepository.create(userType);
  }

  @get('/user-types/count')
  @response(200, {
    description: 'UserType model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(UserType) where?: Where<UserType>): Promise<Count> {
    return this.userTypeRepository.count(where);
  }

  @get('/user-types')
  @response(200, {
    description: 'Array of UserType model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(UserType, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(UserType) filter?: Filter<UserType>,
  ): Promise<UserType[]> {
    return this.userTypeRepository.find(filter);
  }

  @patch('/user-types')
  @response(200, {
    description: 'UserType PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserType, {partial: true}),
        },
      },
    })
    userType: UserType,
    @param.where(UserType) where?: Where<UserType>,
  ): Promise<Count> {
    return this.userTypeRepository.updateAll(userType, where);
  }

  @get('/user-types/{id}')
  @response(200, {
    description: 'UserType model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(UserType, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(UserType, {exclude: 'where'})
    filter?: FilterExcludingWhere<UserType>,
  ): Promise<UserType> {
    return this.userTypeRepository.findById(id, filter);
  }

  @patch('/user-types/{id}')
  @response(204, {
    description: 'UserType PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserType, {partial: true}),
        },
      },
    })
    userType: UserType,
  ): Promise<void> {
    await this.userTypeRepository.updateById(id, userType);
  }

  @put('/user-types/{id}')
  @response(204, {
    description: 'UserType PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() userType: UserType,
  ): Promise<void> {
    await this.userTypeRepository.replaceById(id, userType);
  }

  @del('/user-types/{id}')
  @response(204, {
    description: 'UserType DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.userTypeRepository.deleteById(id);
  }
}
