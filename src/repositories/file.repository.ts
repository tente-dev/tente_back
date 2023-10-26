import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MaindbDataSource} from '../datasources';
import {File, FileRelations} from '../models';

export class FileRepository extends DefaultCrudRepository<
  File,
  typeof File.prototype.id,
  FileRelations
> {
  constructor(
    @inject('datasources.maindb') dataSource: MaindbDataSource,
  ) {
    super(File, dataSource);
  }
}
