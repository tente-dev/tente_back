import {Entity, belongsTo, model, property} from '@loopback/repository';
import {File} from './file.model';
import {Store} from './store.model';

@model({
  settings: {
    idInjection: false,
    mysql: {schema: 'tente_app', table: 'branch'},
    hiddenProperties: ['store_id', 'products_catalogue_id'],
  },
})
export class Branch extends Entity {
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
    length: 150,
    generated: 0,
    mysql: {
      columnName: 'name',
      dataType: 'varchar',
      dataLength: 150,
      dataPrecision: null,
      dataScale: null,
      nullable: 'N',
      generated: 0,
    },
  })
  name: string;

  @property({
    type: 'number',
    precision: 3,
    scale: 0,
    generated: 0,
    mysql: {
      columnName: 'bank_transfer_as_payment_method',
      dataType: 'tinyint',
      dataLength: null,
      dataPrecision: 3,
      dataScale: 0,
      nullable: 'Y',
      generated: 0,
    },
  })
  bankTransferAsPaymentMethod?: number;

  @property({
    type: 'number',
    precision: 3,
    scale: 0,
    generated: 0,
    mysql: {
      columnName: 'debit_card_as_payment_method',
      dataType: 'tinyint',
      dataLength: null,
      dataPrecision: 3,
      dataScale: 0,
      nullable: 'Y',
      generated: 0,
    },
  })
  debitCardAsPaymentMethod?: number;

  @property({
    type: 'number',
    precision: 3,
    scale: 0,
    generated: 0,
    mysql: {
      columnName: 'credit_card_as_payment_method',
      dataType: 'tinyint',
      dataLength: null,
      dataPrecision: 3,
      dataScale: 0,
      nullable: 'Y',
      generated: 0,
    },
  })
  creditCardAsPaymentMethod?: number;

  @property({
    type: 'number',
    precision: 3,
    scale: 0,
    generated: 0,
    mysql: {
      columnName: 'home_delivery',
      dataType: 'tinyint',
      dataLength: null,
      dataPrecision: 3,
      dataScale: 0,
      nullable: 'Y',
      generated: 0,
    },
  })
  homeDelivery?: number;

  @property({
    type: 'number',
    precision: 10,
    scale: 0,
    generated: 0,
    mysql: {
      columnName: 'lat',
      dataType: 'decimal',
      dataLength: null,
      dataPrecision: 10,
      dataScale: 0,
      nullable: 'Y',
      generated: 0,
    },
  })
  lat?: number;

  @property({
    type: 'number',
    precision: 10,
    scale: 0,
    generated: 0,
    mysql: {
      columnName: 'long',
      dataType: 'int',
      dataLength: null,
      dataPrecision: 10,
      dataScale: 0,
      nullable: 'Y',
      generated: 0,
    },
  })
  long?: number;

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

  @property({
    type: 'number',
    precision: 10,
    scale: 0,
    generated: 0,
    mysql: {
      columnName: 'products_catalogue_id',
      dataType: 'int',
      dataLength: null,
      dataPrecision: 10,
      dataScale: 0,
      nullable: 'Y',
      generated: 0,
    },
  })
  productsCatalogueId?: number;

  @belongsTo(() => Store, {name: 'store', keyFrom: 'Branch.storeId'})
  // eslint-disable-next-line @typescript-eslint/naming-convention
  store_id: number;

  @belongsTo(() => File, {
    name: 'catalogue',
  })
  // eslint-disable-next-line @typescript-eslint/naming-convention
  products_catalogue_id: number;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Branch>) {
    super(data);
  }
}

export interface BranchRelations {
  // describe navigational properties here
}

export type BranchWithRelations = Branch & BranchRelations;
