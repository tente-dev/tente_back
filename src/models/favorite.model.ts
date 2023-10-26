import {Entity, belongsTo, model, property} from '@loopback/repository';
import {Branch} from './branch.model';

@model({
  settings: {
    idInjection: false,
    mysql: {schema: 'tente_app', table: 'favorite'},
    hiddenProperties: ['branch_id'],
  },
})
export class Favorite extends Entity {
  @property({
    type: 'number',
    precision: 10,
    scale: 0,
    generated: 1,
    id: 1,
    mysql: {
      columnName: 'id',
      dataType: 'int',
      dataLength: null,
      dataPrecision: 10,
      dataScale: 0,
      nullable: 'N',
      generated: 1,
    },
  })
  id?: number;

  @property({
    type: 'number',
    required: true,
    precision: 10,
    scale: 0,
    generated: 0,
    mysql: {
      columnName: 'branch_id',
      dataType: 'int',
      dataLength: null,
      dataPrecision: 10,
      dataScale: 0,
      nullable: 'N',
      generated: 0,
    },
  })
  branchId: number;

  @property({
    type: 'number',
    required: true,
    precision: 10,
    scale: 0,
    generated: 0,
    mysql: {
      columnName: 'user_id',
      dataType: 'int',
      dataLength: null,
      dataPrecision: 10,
      dataScale: 0,
      nullable: 'N',
      generated: 0,
    },
  })
  userId: number;

  @belongsTo(() => Branch, {name: 'branch'})
  // eslint-disable-next-line @typescript-eslint/naming-convention
  branch_id: number;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Favorite>) {
    super(data);
  }
}

export interface FavoriteRelations {
  // describe navigational properties here
}

export type FavoriteWithRelations = Favorite & FavoriteRelations;
