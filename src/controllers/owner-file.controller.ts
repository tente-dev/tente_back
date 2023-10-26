import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Owner,
  File,
} from '../models';
import {OwnerRepository} from '../repositories';

export class OwnerFileController {
  constructor(
    @repository(OwnerRepository)
    public ownerRepository: OwnerRepository,
  ) { }

  @get('/owners/{id}/file', {
    responses: {
      '200': {
        description: 'File belonging to Owner',
        content: {
          'application/json': {
            schema: getModelSchemaRef(File),
          },
        },
      },
    },
  })
  async getFile(
    @param.path.number('id') id: typeof Owner.prototype.id,
  ): Promise<File> {
    return this.ownerRepository.photo(id);
  }
}
