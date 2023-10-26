import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {MaindbDataSource} from '../datasources';
import {Owner, OwnerRelations, File} from '../models';
import {FileRepository} from './file.repository';

export class OwnerRepository extends DefaultCrudRepository<
  Owner,
  typeof Owner.prototype.id,
  OwnerRelations
> {

  public readonly photo: BelongsToAccessor<File, typeof Owner.prototype.id>;

  constructor(
    @inject('datasources.maindb') dataSource: MaindbDataSource, @repository.getter('FileRepository') protected fileRepositoryGetter: Getter<FileRepository>,
  ) {
    super(Owner, dataSource);
    this.photo = this.createBelongsToAccessorFor('photo', fileRepositoryGetter,);
    this.registerInclusionResolver('photo', this.photo.inclusionResolver);
  }
}
