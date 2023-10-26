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
import {File} from '../models';
import {FileRepository} from '../repositories';
import {FileUploadHandler} from '../types/file';
import {createFile, errorHandler} from '../utils/file';
import {getUserInfo} from '../utils/user';

@authenticate('jwt')
export class FileController {
  constructor(
    @repository(FileRepository)
    public fileRepository: FileRepository,
    @inject(FILE_UPLOAD_SERVICE) private handler: FileUploadHandler,
    @inject(FILE_UPLOAD_SERVICE) private fileUploader: FileUploadHandler,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
  ) {}

  @post('/files')
  @response(200, {
    description: 'File model instance',
  })
  async create(
    @requestBody.file()
    request: Request,
    @inject(RestBindings.Http.RESPONSE) res: Response,
  ): Promise<File> {
    let fileRequest = {} as globalThis.Express.Multer.File;
    let newFile = {} as File;
    const user = await getUserInfo(request, this.jwtService);

    const filePromise = new Promise<object>((resolve, reject) => {
      this.fileUploader(request, res, (err: unknown) => {
        const requestParams = FileController.getFilesAndFields(request);
        fileRequest = requestParams.files[0] as globalThis.Express.Multer.File;
        return errorHandler(err, resolve, reject, request);
      });
    });

    const result = (await filePromise) as {
      files: globalThis.Express.Multer.File[];
    };

    if (fileRequest) {
      newFile = await createFile(
        request,
        result.files[0],
        user.id,
        this.fileRepository,
      );
    }

    return newFile;
  }

  @get('/files/count')
  @response(200, {
    description: 'File model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(File) where?: Where<File>): Promise<Count> {
    return this.fileRepository.count(where);
  }

  @get('/files')
  @response(200, {
    description: 'Array of File model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(File, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(File) filter?: Filter<File>): Promise<File[]> {
    return this.fileRepository.find(filter);
  }

  @patch('/files')
  @response(200, {
    description: 'File PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(File, {partial: true}),
        },
      },
    })
    file: File,
    @param.where(File) where?: Where<File>,
  ): Promise<Count> {
    return this.fileRepository.updateAll(file, where);
  }

  @get('/files/{id}')
  @response(200, {
    description: 'File model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(File, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(File, {exclude: 'where'}) filter?: FilterExcludingWhere<File>,
  ): Promise<File> {
    return this.fileRepository.findById(id, filter);
  }

  @patch('/files/{id}')
  @response(204, {
    description: 'File PATCH success',
  })
  async updateById(
    @requestBody.file()
    request: Request,
    @inject(RestBindings.Http.RESPONSE) res: Response,
    @param.path.number('id') id: number,
  ): Promise<void> {
    let fileRequest = {} as globalThis.Express.Multer.File;
    let newFile = {} as File;
    const user = await getUserInfo(request, this.jwtService);

    const filePromise = new Promise<object>((resolve, reject) => {
      this.fileUploader(request, res, (err: unknown) => {
        const requestParams = FileController.getFilesAndFields(request);
        fileRequest = requestParams.files[0] as globalThis.Express.Multer.File;
        return errorHandler(err, resolve, reject, request);
      });
    });

    const result = (await filePromise) as {
      files: globalThis.Express.Multer.File[];
    };

    if (fileRequest) {
      newFile = await createFile(
        request,
        result.files[0],
        user.id,
        this.fileRepository,
      );
    }

    const createdFile = await this.fileRepository.findById(id);

    if (createdFile) {
      createdFile.path = newFile.path;
    }

    await this.fileRepository.updateById(id, createdFile);
  }

  @put('/files/{id}')
  @response(204, {
    description: 'File PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() file: File,
  ): Promise<void> {
    await this.fileRepository.replaceById(id, file);
  }

  @del('/files/{id}')
  @response(204, {
    description: 'File DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.fileRepository.deleteById(id);
  }

  @post('/files/upload', {
    responses: {
      200: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
        description: 'Files and fields',
      },
    },
  })
  public async upload(
    @requestBody({
      description: 'multipart/form-data value.',
      required: true,
      content: {
        'multipart/form-data': {
          // Skip body parsing
          'x-parser': 'stream',
          schema: {type: 'object'},
        },
      },
    })
    request: Request,
    @inject(RestBindings.Http.RESPONSE) res: Response,
  ): Promise<object> {
    console.log(`${request.protocol}://${request.get('host')}`);
    return new Promise<object>((resolve, reject) => {
      this.handler(request, res, (err: unknown) => {
        const params = FileController.getFilesAndFields(request);
        console.log('params', params);
        return errorHandler(err, resolve, reject, request);
      });
    });
  }

  public static getFilesAndFields(request: Request) {
    const uploadedFiles = request.files;
    const mapper = (f: globalThis.Express.Multer.File) => ({
      fieldname: f.fieldname,
      originalname: f.originalname,
      encoding: f.encoding,
      mimetype: f.mimetype,
      size: f.size,
    });
    let files: object[] = [];
    if (Array.isArray(uploadedFiles)) {
      files = uploadedFiles.map(mapper);
    } else {
      for (const filename in uploadedFiles) {
        files.push(...uploadedFiles[filename].map(mapper));
      }
    }
    return {files, fields: request.body};
  }
}
