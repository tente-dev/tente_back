import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import {MaindbDataSource} from '../datasources';
import {Branch, Favorite, FavoriteRelations} from '../models';
import {BranchRepository} from './branch.repository';

export class FavoriteRepository extends DefaultCrudRepository<
  Favorite,
  typeof Favorite.prototype.id,
  FavoriteRelations
> {

  public readonly branch: BelongsToAccessor<Branch, typeof Favorite.prototype.id>;

  constructor(
    @inject('datasources.maindb') dataSource: MaindbDataSource, @repository.getter('BranchRepository') protected branchRepositoryGetter: Getter<BranchRepository>,
  ) {
    super(Favorite, dataSource);
    this.branch = this.createBelongsToAccessorFor('branch', branchRepositoryGetter,);
    this.registerInclusionResolver('branch', this.branch.inclusionResolver);
  }
}
