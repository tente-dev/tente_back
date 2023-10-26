import {authenticate, TokenService} from '@loopback/authentication';
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
import {File, Store} from '../models';
import {FileRepository, StoreRepository} from '../repositories';
import {FileUploadHandler} from '../types/file';
import {createFile, errorHandler} from '../utils/file';
import {getUserInfo} from '../utils/user';
import {FileController} from './file.controller';

@authenticate('jwt')
export class StoreController {
  constructor(
    @repository(StoreRepository)
    public storeRepository: StoreRepository,
    @repository(FileRepository)
    public fileRepository: FileRepository,
    @inject(FILE_UPLOAD_SERVICE) private fileUploader: FileUploadHandler,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
  ) {}

  @post('/stores')
  @response(200, {
    description: 'Store model instance',
    content: {'application/json': {schema: getModelSchemaRef(Store)}},
  })
  async create(
    @requestBody.file()
    request: Request,
    @inject(RestBindings.Http.RESPONSE) res: Response,
  ): Promise<Store> {
    let store = {} as Store;
    let file = {} as globalThis.Express.Multer.File;
    let createdFile = {} as File;
    const user = await getUserInfo(request, this.jwtService);

    const filePromise = new Promise<object>((resolve, reject) => {
      this.fileUploader(request, res, (err: unknown) => {
        const requestParams = FileController.getFilesAndFields(request);
        file = requestParams.files[0] as globalThis.Express.Multer.File;
        store = requestParams.fields;
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

    return this.storeRepository.create({
      ...store,
      createdBy: user.id,
      logoId: createdFile?.id,
    });
  }

  @get('/stores/count')
  @response(200, {
    description: 'Store model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Store) where?: Where<Store>): Promise<Count> {
    return this.storeRepository.count(where);
  }

  @authenticate.skip()
  @get('/stores')
  @response(200, {
    description: 'Array of Store model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Store, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Store) filter?: Filter<Store>): Promise<Store[]> {
    return this.storeRepository.find(filter);
  }

  @patch('/stores')
  @response(200, {
    description: 'Store PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Store, {partial: true}),
        },
      },
    })
    store: Store,
    @param.where(Store) where?: Where<Store>,
  ): Promise<Count> {
    return this.storeRepository.updateAll(store, where);
  }

  @get('/stores/{id}')
  @response(200, {
    description: 'Store model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Store, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Store, {exclude: 'where'})
    filter?: FilterExcludingWhere<Store>,
  ): Promise<Store> {
    return this.storeRepository.findById(id, filter);
  }

  @patch('/stores/{id}')
  @response(204, {
    description: 'Store PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Store, {partial: true}),
        },
      },
    })
    store: Store,
  ): Promise<void> {
    await this.storeRepository.updateById(id, store);
  }

  @put('/stores/{id}')
  @response(204, {
    description: 'Store PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() store: Store,
  ): Promise<void> {
    await this.storeRepository.replaceById(id, store);
  }

  @del('/stores/{id}')
  @response(204, {
    description: 'Store DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.storeRepository.deleteById(id);
  }
}
