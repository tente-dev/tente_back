import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MaindbDataSource} from '../datasources';
import {User, UserRelations} from '../models';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {
  constructor(
    @inject('datasources.maindb') dataSource: MaindbDataSource,
  ) {
    super(User, dataSource);
  }
}
