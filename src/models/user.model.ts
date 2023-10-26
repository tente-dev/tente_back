import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {idInjection: false, mysql: {schema: 'tente_app', table: 'user'}},
})
export class User extends Entity {
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
      columnName: 'email',
      dataType: 'varchar',
      dataLength: 50,
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
    length: 200,
    generated: 0,
    hidden: true,
    mysql: {
      columnName: 'password',
      dataType: 'varchar',
      dataLength: 200,
      dataPrecision: null,
      dataScale: null,
      nullable: 'N',
      generated: 0,
    },
  })
  password: string;

  @property({
    type: 'number',
    required: false,
    precision: 3,
    scale: 0,
    generated: 0,
    mysql: {
      columnName: 'verified',
      dataType: 'tinyint',
      dataLength: null,
      dataPrecision: 3,
      dataScale: 0,
      nullable: 'N',
      generated: 0,
    },
  })
  verified: number;

  @property({
    type: 'string',
    required: true,
    length: 50,
    generated: 0,
    mysql: {
      columnName: 'firstname',
      dataType: 'varchar',
      dataLength: 50,
      dataPrecision: null,
      dataScale: null,
      nullable: 'N',
      generated: 0,
    },
  })
  firstname: string;

  @property({
    type: 'string',
    length: 50,
    generated: 0,
    mysql: {
      columnName: 'lastname',
      dataType: 'varchar',
      dataLength: 50,
      dataPrecision: null,
      dataScale: null,
      nullable: 'Y',
      generated: 0,
    },
  })
  lastname?: string;

  @property({
    type: 'string',
    length: 100,
    generated: 0,
    hidden: true,
    mysql: {
      columnName: 'verify_token',
      dataType: 'varchar',
      dataLength: 100,
      dataPrecision: null,
      dataScale: null,
      nullable: 'Y',
      generated: 0,
    },
  })
  verifyToken?: string;

  @property({
    type: 'number',
    required: true,
    precision: 10,
    scale: 0,
    generated: 0,
    mysql: {
      columnName: 'user_type_id',
      dataType: 'int',
      dataLength: null,
      dataPrecision: 10,
      dataScale: 0,
      nullable: 'N',
      generated: 0,
    },
  })
  userTypeId: number;

  @property({
    type: 'string',
    length: 100,
    generated: 0,
    hidden: true,
    mysql: {
      columnName: 'reset_token',
      dataType: 'varchar',
      dataLength: 100,
      dataPrecision: null,
      dataScale: null,
      nullable: 'Y',
      generated: 0,
    },
  })
  resetToken?: string;

  @property({
    type: 'string',
    length: 15,
    generated: 0,
    mysql: {
      columnName: 'social_auth',
      dataType: 'varchar',
      dataLength: 15,
      dataPrecision: null,
      dataScale: null,
      nullable: 'Y',
      generated: 0,
    },
  })
  socialAuth?: string;

  @property({
    type: 'number',
    required: false,
    precision: 3,
    scale: 0,
    generated: 0,
    mysql: {
      columnName: 'admin',
      dataType: 'tinyint',
      dataLength: null,
      dataPrecision: 3,
      dataScale: 0,
      nullable: 'Y',
      generated: 0,
    },
  })
  admin?: number;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
