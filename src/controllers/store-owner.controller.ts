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
  Owner,
} from '../models';
import {StoreRepository} from '../repositories';

export class StoreOwnerController {
  constructor(
    @repository(StoreRepository)
    public storeRepository: StoreRepository,
  ) { }

  @get('/stores/{id}/owner', {
    responses: {
      '200': {
        description: 'Owner belonging to Store',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Owner),
          },
        },
      },
    },
  })
  async getOwner(
    @param.path.number('id') id: typeof Store.prototype.id,
  ): Promise<Owner> {
    return this.storeRepository.owner(id);
  }
}
