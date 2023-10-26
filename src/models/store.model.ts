import {
  Entity,
  belongsTo,
  hasMany,
  hasOne,
  model,
  property,
} from '@loopback/repository';
import {Branch} from './branch.model';
import {File} from './file.model';
import {Owner} from './owner.model';
import {SocialMedia} from './social-media.model';

@model({
  settings: {
    idInjection: false,
    mysql: {schema: 'tente_app', table: 'store'},
    hiddenProperties: ['logo_id'],
  },
})
export class Store extends Entity {
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
    length: 50,
    generated: 0,
    mysql: {
      columnName: 'name',
      dataType: 'varchar',
      dataLength: 50,
      dataPrecision: null,
      dataScale: null,
      nullable: 'N',
      generated: 0,
    },
  })
  name: string;

  @property({
    type: 'string',
    length: 150,
    generated: 0,
    mysql: {
      columnName: 'slogan',
      dataType: 'varchar',
      dataLength: 150,
      dataPrecision: null,
      dataScale: null,
      nullable: 'Y',
      generated: 0,
    },
  })
  slogan?: string;

  @property({
    type: 'string',
    required: true,
    length: 13,
    generated: 0,
    mysql: {
      columnName: 'str',
      dataType: 'varchar',
      dataLength: 13,
      dataPrecision: null,
      dataScale: null,
      nullable: 'N',
      generated: 0,
    },
  })
  str: string;

  @property({
    type: 'string',
    length: 1000,
    generated: 0,
    mysql: {
      columnName: 'description',
      dataType: 'varchar',
      dataLength: 1000,
      dataPrecision: null,
      dataScale: null,
      nullable: 'Y',
      generated: 0,
    },
  })
  description?: string;

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

  @property({
    type: 'number',
    precision: 10,
    scale: 0,
    generated: 0,
    mysql: {
      columnName: 'created_by',
      dataType: 'int',
      dataLength: null,
      dataPrecision: 10,
      dataScale: 0,
      nullable: 'Y',
      generated: 0,
    },
  })
  createdBy?: number;

  @property({
    type: 'number',
    precision: 10,
    scale: 0,
    generated: 0,
    mysql: {
      columnName: 'logo_id',
      dataType: 'int',
      dataLength: null,
      dataPrecision: 10,
      dataScale: 0,
      nullable: 'Y',
      generated: 0,
    },
  })
  logoId?: number;

  @property({
    type: 'number',
    required: true,
    precision: 10,
    scale: 0,
    generated: 0,
    mysql: {
      columnName: 'owner_id',
      dataType: 'int',
      dataLength: null,
      dataPrecision: 10,
      dataScale: 0,
      nullable: 'N',
      generated: 0,
    },
  })
  ownerId: number;

  @property({
    type: 'string',
    required: false,
    length: 1000,
    generated: 0,
    mysql: {
      columnName: 'non_accepted_fields',
      dataType: 'varchar',
      dataLength: 1000,
      dataPrecision: null,
      dataScale: null,
      nullable: 'Y',
      generated: 0,
    },
  })
  nonAcceptedFields?: string;

  @hasMany(() => Branch, {keyTo: 'storeId'})
  branches: Branch[];

  @belongsTo(() => File, {name: 'logo'})
  // eslint-disable-next-line @typescript-eslint/naming-convention
  logo_id: number;

  @hasOne(() => SocialMedia, {keyTo: 'storeId'})
  socialMedia: SocialMedia;

  @belongsTo(() => Owner, {name: 'owner'})
  // eslint-disable-next-line @typescript-eslint/naming-convention
  owner_id: number;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Store>) {
    super(data);
  }
}

export interface StoreRelations {
  // describe navigational properties here
}

export type StoreWithRelations = Store & StoreRelations;
