import {
  repository,
} from '@loopback/repository';
import {
  HttpErrors,
  get,
  getModelSchemaRef,
  param
} from '@loopback/rest';
import {
  Branch,
  File,
} from '../models';
import {BranchRepository} from '../repositories';


export class BranchFileController {
  constructor(
    @repository(BranchRepository)
    private readonly branchRepository: BranchRepository,
  ) { }

  /**
   * Endpoint to get the file associated with a specific branch.
   * @param id - ID of the branch
   * @returns The file associated with the branch
   */
  @get('/branches/{id}/file', {
    responses: {
      '200': {
        description: 'File belonging to Branch',
        content: {
          'application/json': {
            schema: getModelSchemaRef(File),
          },
        },
      },
    },
  })
  async getFile(
    @param.path.number('id') id: typeof Branch.prototype.id,
  ): Promise<File> {

    const branch = await this.branchRepository.findById(id);
    if (!branch) {
      throw new HttpErrors.NotFound(`Branch with id ${id} not found.`);
    }

    return this.branchRepository.catalogue(id);
  }
}
