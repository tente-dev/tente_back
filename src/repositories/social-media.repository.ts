import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MaindbDataSource} from '../datasources';
import {SocialMedia, SocialMediaRelations} from '../models';

export class SocialMediaRepository extends DefaultCrudRepository<
  SocialMedia,
  typeof SocialMedia.prototype.id,
  SocialMediaRelations
> {
  constructor(
    @inject('datasources.maindb') dataSource: MaindbDataSource,
  ) {
    super(SocialMedia, dataSource);
  }
}
