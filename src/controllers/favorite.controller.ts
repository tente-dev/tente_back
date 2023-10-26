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
import {Favorite} from '../models';
import {FavoriteRepository} from '../repositories';

/**
 * Controller for handling operations related to Favorites.
 */
export class FavoriteController {
  constructor(
    @repository(FavoriteRepository)
    private readonly favoriteRepository: FavoriteRepository,
  ) { }

  /**
   * Create a new Favorite.
   */
  @post('/favorites')
  @response(200, {
    description: 'Favorite model instance',
    content: {'application/json': {schema: getModelSchemaRef(Favorite)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Favorite, {
            title: 'NewFavorite',
            exclude: ['id'],
          }),
        },
      },
    })
    favorite: Omit<Favorite, 'id'>,
  ): Promise<Favorite> {
    return this.favoriteRepository.create(favorite);
  }

  /**
   * Count Favorites based on a given where filter.
   */
  @get('/favorites/count')
  @response(200, {
    description: 'Favorite model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Favorite) where?: Where<Favorite>): Promise<Count> {
    return this.favoriteRepository.count(where);
  }

  /**
   * Retrieve a list of Favorites.
   */
  @get('/favorites')
  @response(200, {
    description: 'Array of Favorite model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Favorite, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Favorite) filter?: Filter<Favorite>,
  ): Promise<Favorite[]> {
    return this.favoriteRepository.find(filter);
  }

  /**
   * Update all Favorites based on a given where filter.
   */
  @patch('/favorites')
  @response(200, {
    description: 'Favorite PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Favorite, {partial: true}),
        },
      },
    })
    favorite: Favorite,
    @param.where(Favorite) where?: Where<Favorite>,
  ): Promise<Count> {
    return this.favoriteRepository.updateAll(favorite, where);
  }

  /**
   * Retrieve a Favorite by its ID.
   */
  @get('/favorites/{id}')
  @response(200, {
    description: 'Favorite model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Favorite, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Favorite, {exclude: 'where'})
    filter?: FilterExcludingWhere<Favorite>,
  ): Promise<Favorite> {
    return this.favoriteRepository.findById(id, filter);
  }

  /**
   * Update a Favorite by its ID.
   */
  @patch('/favorites/{id}')
  @response(204, {
    description: 'Favorite PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Favorite, {partial: true}),
        },
      },
    })
    favorite: Favorite,
  ): Promise<void> {
    await this.favoriteRepository.updateById(id, favorite);
  }

  /**
   * Replace a Favorite by its ID.
   */
  @put('/favorites/{id}')
  @response(204, {
    description: 'Favorite PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() favorite: Favorite,
  ): Promise<void> {
    await this.favoriteRepository.replaceById(id, favorite);
  }

  /**
   * Delete a Favorite by its ID.
   */
  @del('/favorites/{id}')
  @response(204, {
    description: 'Favorite DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.favoriteRepository.deleteById(id);
  }
}
