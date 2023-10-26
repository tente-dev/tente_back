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
import {SocialMedia} from '../models';
import {SocialMediaRepository} from '../repositories';

@authenticate('jwt')
export class SocialMediaController {
  constructor(
    @repository(SocialMediaRepository)
    public socialMediaRepository: SocialMediaRepository,
  ) {}

  @post('/social-media')
  @response(200, {
    description: 'SocialMedia model instance',
    content: {'application/json': {schema: getModelSchemaRef(SocialMedia)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SocialMedia, {
            title: 'NewSocialMedia',
            exclude: ['id'],
          }),
        },
      },
    })
    socialMedia: Omit<SocialMedia, 'id'>,
  ): Promise<SocialMedia> {
    return this.socialMediaRepository.create(socialMedia);
  }

  @get('/social-media/count')
  @response(200, {
    description: 'SocialMedia model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(SocialMedia) where?: Where<SocialMedia>,
  ): Promise<Count> {
    return this.socialMediaRepository.count(where);
  }

  @get('/social-media')
  @response(200, {
    description: 'Array of SocialMedia model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(SocialMedia, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(SocialMedia) filter?: Filter<SocialMedia>,
  ): Promise<SocialMedia[]> {
    return this.socialMediaRepository.find(filter);
  }

  @patch('/social-media')
  @response(200, {
    description: 'SocialMedia PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SocialMedia, {partial: true}),
        },
      },
    })
    socialMedia: SocialMedia,
    @param.where(SocialMedia) where?: Where<SocialMedia>,
  ): Promise<Count> {
    return this.socialMediaRepository.updateAll(socialMedia, where);
  }

  @get('/social-media/{id}')
  @response(200, {
    description: 'SocialMedia model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(SocialMedia, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(SocialMedia, {exclude: 'where'})
    filter?: FilterExcludingWhere<SocialMedia>,
  ): Promise<SocialMedia> {
    return this.socialMediaRepository.findById(id, filter);
  }

  @patch('/social-media/{id}')
  @response(204, {
    description: 'SocialMedia PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SocialMedia, {partial: true}),
        },
      },
    })
    socialMedia: SocialMedia,
  ): Promise<void> {
    await this.socialMediaRepository.updateById(id, socialMedia);
  }

  @put('/social-media/{id}')
  @response(204, {
    description: 'SocialMedia PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() socialMedia: SocialMedia,
  ): Promise<void> {
    await this.socialMediaRepository.replaceById(id, socialMedia);
  }

  @del('/social-media/{id}')
  @response(204, {
    description: 'SocialMedia DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.socialMediaRepository.deleteById(id);
  }
}
