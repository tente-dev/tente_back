import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  repository,
} from '@loopback/repository';
import {MaindbDataSource} from '../datasources';
import {Branch, BranchRelations, Store, File} from '../models';
import {StoreRepository} from './store.repository';
import {FileRepository} from './file.repository';

export class BranchRepository extends DefaultCrudRepository<
  Branch,
  typeof Branch.prototype.id,
  BranchRelations
> {
  public readonly store: BelongsToAccessor<Store, typeof Branch.prototype.id>;

  public readonly catalogue: BelongsToAccessor<File, typeof Branch.prototype.id>;

  constructor(
    @inject('datasources.maindb') dataSource: MaindbDataSource,
    @repository.getter('StoreRepository')
    protected storeRepositoryGetter: Getter<StoreRepository>, @repository.getter('FileRepository') protected fileRepositoryGetter: Getter<FileRepository>,
  ) {
    super(Branch, dataSource);
    this.catalogue = this.createBelongsToAccessorFor('catalogue', fileRepositoryGetter,);
    this.registerInclusionResolver('catalogue', this.catalogue.inclusionResolver);
    this.store = this.createBelongsToAccessorFor(
      'store',
      storeRepositoryGetter,
    );
    this.registerInclusionResolver('store', this.store.inclusionResolver);
  }
}
