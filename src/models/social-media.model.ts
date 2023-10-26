import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    idInjection: false,
    mysql: {schema: 'tente_app', table: 'social_media'},
  },
})
export class SocialMedia extends Entity {
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
    length: 150,
    generated: 0,
    mysql: {
      columnName: 'instagram',
      dataType: 'varchar',
      dataLength: 150,
      dataPrecision: null,
      dataScale: null,
      nullable: 'Y',
      generated: 0,
    },
  })
  instagram?: string;

  @property({
    type: 'string',
    length: 15,
    generated: 0,
    mysql: {
      columnName: 'whatsapp',
      dataType: 'varchar',
      dataLength: 15,
      dataPrecision: null,
      dataScale: null,
      nullable: 'Y',
      generated: 0,
    },
  })
  whatsapp?: string;

  @property({
    type: 'string',
    length: 150,
    generated: 0,
    mysql: {
      columnName: 'facebook',
      dataType: 'varchar',
      dataLength: 150,
      dataPrecision: null,
      dataScale: null,
      nullable: 'Y',
      generated: 0,
    },
  })
  facebook?: string;

  @property({
    type: 'string',
    length: 150,
    generated: 0,
    mysql: {
      columnName: 'tiktok',
      dataType: 'varchar',
      dataLength: 150,
      dataPrecision: null,
      dataScale: null,
      nullable: 'Y',
      generated: 0,
    },
  })
  tiktok?: string;

  @property({
    type: 'number',
    required: true,
    precision: 10,
    scale: 0,
    generated: 0,
    mysql: {
      columnName: 'store_id',
      dataType: 'int',
      dataLength: null,
      dataPrecision: 10,
      dataScale: 0,
      nullable: 'N',
      generated: 0,
    },
  })
  storeId: number;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<SocialMedia>) {
    super(data);
  }
}

export interface SocialMediaRelations {
  // describe navigational properties here
}

export type SocialMediaWithRelations = SocialMedia & SocialMediaRelations;
