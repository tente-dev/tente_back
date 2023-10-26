import {
  repository,
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  param,
} from '@loopback/rest';
import {
  Branch,
  Favorite,
} from '../models';
import {FavoriteRepository} from '../repositories';

/**
 * Controller for handling operations related to the Branch associated with a Favorite.
 */
export class FavoriteBranchController {
  constructor(
    @repository(FavoriteRepository)
    private readonly favoriteRepository: FavoriteRepository,
  ) { }

  /**
   * Fetch the Branch associated with a particular Favorite by its ID.
   * @param id - ID of the Favorite
   * @returns The associated Branch of the specified Favorite
   */
  @get('/favorites/{id}/branch', {
    responses: {
      '200': {
        description: 'Branch belonging to Favorite',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Branch),
          },
        },
      },
    },
  })
  async getBranch(
    @param.path.number('id') id: typeof Favorite.prototype.id,
  ): Promise<Branch> {
    return this.favoriteRepository.branch(id);
  }
}
