import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {idInjection: false, mysql: {schema: 'residuos_zero', table: 'user_type'}}
})
export class UserType extends Entity {
  @property({
    type: 'number',
    precision: 10,
    scale: 0,
    generated: 1,
    id: 1,
    mysql: {columnName: 'id', dataType: 'int', dataLength: null, dataPrecision: 10, dataScale: 0, nullable: 'N', generated: 1},
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
    length: 50,
    generated: 0,
    mysql: {columnName: 'name', dataType: 'varchar', dataLength: 50, dataPrecision: null, dataScale: null, nullable: 'N', generated: 0},
  })
  name: string;

  @property({
    type: 'string',
    required: true,
    length: 50,
    generated: 0,
    mysql: {columnName: 'uid', dataType: 'varchar', dataLength: 50, dataPrecision: null, dataScale: null, nullable: 'N', generated: 0},
  })
  uid: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<UserType>) {
    super(data);
  }
}

export interface UserTypeRelations {
  // describe navigational properties here
}

export type UserTypeWithRelations = UserType & UserTypeRelations;
