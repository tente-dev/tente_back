import {Entity, belongsTo, model, property} from '@loopback/repository';
import {File} from './file.model';

@model({
  settings: {idInjection: false, mysql: {schema: 'tente_app', table: 'owner'}},
})
export class Owner extends Entity {
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
    type: 'string',
    required: true,
    length: 100,
    generated: 0,
    mysql: {
      columnName: 'full_name',
      dataType: 'varchar',
      dataLength: 100,
      dataPrecision: null,
      dataScale: null,
      nullable: 'N',
      generated: 0,
    },
  })
  fullName: string;

  @property({
    type: 'string',
    required: true,
    length: 100,
    generated: 0,
    mysql: {
      columnName: 'email',
      dataType: 'varchar',
      dataLength: 100,
      dataPrecision: null,
      dataScale: null,
      nullable: 'N',
      generated: 0,
    },
  })
  email: string;

  @property({
    type: 'string',
    required: true,
    length: 10,
    generated: 0,
    mysql: {
      columnName: 'identification',
      dataType: 'varchar',
      dataLength: 10,
      dataPrecision: null,
      dataScale: null,
      nullable: 'N',
      generated: 0,
    },
  })
  identification: string;

  @property({
    type: 'number',
    required: true,
    precision: 10,
    scale: 0,
    generated: 0,
    mysql: {
      columnName: 'identification_photo_id',
      dataType: 'int',
      dataLength: null,
      dataPrecision: 10,
      dataScale: 0,
      nullable: 'N',
      generated: 0,
    },
  })
  identificationPhotoId: number;

  @property({
    type: 'number',
    precision: 3,
    scale: 0,
    generated: 0,
    mysql: {
      columnName: 'verified',
      dataType: 'tinyint',
      dataLength: null,
      dataPrecision: 3,
      dataScale: 0,
      nullable: 'Y',
      generated: 0,
    },
  })
  verified?: number;

  @belongsTo(() => File, {name: 'photo'})
  // eslint-disable-next-line @typescript-eslint/naming-convention
  identification_photo_id: number;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Owner>) {
    super(data);
  }
}

export interface OwnerRelations {
  // describe navigational properties here
}

export type OwnerWithRelations = Owner & OwnerRelations;
