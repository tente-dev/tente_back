import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory, BelongsToAccessor, HasOneRepositoryFactory} from '@loopback/repository';
import {MaindbDataSource} from '../datasources';
import {Store, StoreRelations, Branch, File, SocialMedia, Owner} from '../models';
import {BranchRepository} from './branch.repository';
import {FileRepository} from './file.repository';
import {SocialMediaRepository} from './social-media.repository';
import {OwnerRepository} from './owner.repository';

export class StoreRepository extends DefaultCrudRepository<
  Store,
  typeof Store.prototype.id,
  StoreRelations
> {

  public readonly branches: HasManyRepositoryFactory<Branch, typeof Store.prototype.id>;

  public readonly logo: BelongsToAccessor<File, typeof Store.prototype.id>;

  public readonly socialMedia: HasOneRepositoryFactory<SocialMedia, typeof Store.prototype.id>;

  public readonly owner: BelongsToAccessor<Owner, typeof Store.prototype.id>;

  constructor(
    @inject('datasources.maindb') dataSource: MaindbDataSource, @repository.getter('BranchRepository') protected branchRepositoryGetter: Getter<BranchRepository>, @repository.getter('FileRepository') protected fileRepositoryGetter: Getter<FileRepository>, @repository.getter('SocialMediaRepository') protected socialMediaRepositoryGetter: Getter<SocialMediaRepository>, @repository.getter('OwnerRepository') protected ownerRepositoryGetter: Getter<OwnerRepository>,
  ) {
    super(Store, dataSource);
    this.owner = this.createBelongsToAccessorFor('owner', ownerRepositoryGetter,);
    this.registerInclusionResolver('owner', this.owner.inclusionResolver);
    this.socialMedia = this.createHasOneRepositoryFactoryFor('socialMedia', socialMediaRepositoryGetter);
    this.registerInclusionResolver('socialMedia', this.socialMedia.inclusionResolver);
    this.logo = this.createBelongsToAccessorFor('logo', fileRepositoryGetter,);
    this.registerInclusionResolver('logo', this.logo.inclusionResolver);
    this.branches = this.createHasManyRepositoryFactoryFor('branches', branchRepositoryGetter,);
    this.registerInclusionResolver('branches', this.branches.inclusionResolver);
  }
}
