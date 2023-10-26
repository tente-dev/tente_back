import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {SocialMedia, Store} from '../models';
import {StoreRepository} from '../repositories';

export class StoreSocialMediaController {
  constructor(
    @repository(StoreRepository) protected storeRepository: StoreRepository,
  ) {}

  @get('/stores/{id}/social-media', {
    responses: {
      '200': {
        description: 'Store has one SocialMedia',
        content: {
          'application/json': {
            schema: getModelSchemaRef(SocialMedia),
          },
        },
      },
    },
  })
  async get(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<SocialMedia>,
  ): Promise<SocialMedia> {
    return this.storeRepository.socialMedia(id).get(filter);
  }

  @post('/stores/{id}/social-media', {
    responses: {
      '200': {
        description: 'Store model instance',
        content: {'application/json': {schema: getModelSchemaRef(SocialMedia)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Store.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SocialMedia, {
            title: 'NewSocialMediaInStore',
            exclude: ['id'],
            optional: ['storeId'],
          }),
        },
      },
    })
    socialMedia: Omit<SocialMedia, 'id'>,
  ): Promise<SocialMedia> {
    return this.storeRepository.socialMedia(id).create(socialMedia);
  }

  @patch('/stores/{id}/social-media', {
    responses: {
      '200': {
        description: 'Store.SocialMedia PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SocialMedia, {partial: true}),
        },
      },
    })
    socialMedia: Partial<SocialMedia>,
    @param.query.object('where', getWhereSchemaFor(SocialMedia))
    where?: Where<SocialMedia>,
  ): Promise<Count> {
    return this.storeRepository.socialMedia(id).patch(socialMedia, where);
  }

  @del('/stores/{id}/social-media', {
    responses: {
      '200': {
        description: 'Store.SocialMedia DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(SocialMedia))
    where?: Where<SocialMedia>,
  ): Promise<Count> {
    return this.storeRepository.socialMedia(id).delete(where);
  }
}
