import {
  authenticate
} from '@loopback/authentication';
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
  response
} from '@loopback/rest';
import {Branch} from '../models';
import {BranchRepository} from '../repositories';

@authenticate('jwt')
export class BranchController {
  constructor(
    @repository(BranchRepository)
    private readonly branchRepository: BranchRepository,
  ) { }


  @post('/branches')
  @response(200, {
    description: 'Branch model instance',
    content: {'application/json': {schema: getModelSchemaRef(Branch)}},
  })
  async create(@requestBody() branch: Omit<Branch, 'id'>): Promise<Branch> {
    return this.branchRepository.create(branch);
  }


  @get('/branches/count')
  @response(200, {
    description: 'Branch model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Branch) where?: Where<Branch>): Promise<Count> {
    return this.branchRepository.count(where);
  }


  @authenticate.skip()
  @get('/branches')
  @response(200, {
    description: 'Array of Branch model instances',
    content: {'application/json': {schema: {type: 'array', items: getModelSchemaRef(Branch, {includeRelations: true})}}},
  })
  async find(@param.filter(Branch) filter?: Filter<Branch>): Promise<Branch[]> {
    return this.branchRepository.find({...filter, include: ['store']});
  }


  @patch('/branches')
  @response(200, {
    description: 'Branch PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(@requestBody() branch: Branch, @param.where(Branch) where?: Where<Branch>): Promise<Count> {
    return this.branchRepository.updateAll(branch, where);
  }


  @get('/branches/{id}')
  @response(200, {
    description: 'Branch model instance',
    content: {'application/json': {schema: getModelSchemaRef(Branch, {includeRelations: true})}},
  })
  async findById(@param.path.number('id') id: number, @param.filter(Branch, {exclude: 'where'}) filter?: FilterExcludingWhere<Branch>): Promise<Branch> {
    return this.branchRepository.findById(id, filter);
  }


  @patch('/branches/{id}')
  @response(204, {
    description: 'Branch PATCH success',
  })
  async updateById(@param.path.number('id') id: number, @requestBody() branch: Branch): Promise<void> {
    await this.branchRepository.updateById(id, branch);
  }


  @put('/branches/{id}')
  @response(204, {
    description: 'Branch PUT success',
  })
  async replaceById(@param.path.number('id') id: number, @requestBody() branch: Branch): Promise<void> {
    await this.branchRepository.replaceById(id, branch);
  }


  @del('/branches/{id}')
  @response(204, {
    description: 'Branch DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.branchRepository.deleteById(id);
  }
}
