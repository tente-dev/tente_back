import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Store,
  File,
} from '../models';
import {StoreRepository} from '../repositories';

export class StoreFileController {
  constructor(
    @repository(StoreRepository)
    public storeRepository: StoreRepository,
  ) { }

  @get('/stores/{id}/file', {
    responses: {
      '200': {
        description: 'File belonging to Store',
        content: {
          'application/json': {
            schema: getModelSchemaRef(File),
          },
        },
      },
    },
  })
  async getFile(
    @param.path.number('id') id: typeof Store.prototype.id,
  ): Promise<File> {
    return this.storeRepository.logo(id);
  }
}
