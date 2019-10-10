import {Entity, model, property} from '@loopback/repository';

@model()
export class User extends Entity {
  @property({
    type: 'number',
    id: true,
    required: true,
    generated: true,
  })
  id: number;

  @property({
    type: 'string',
    required: true,
  })
  emal: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @property({
    type: 'boolean',
    default: false,
  })
  emailVerified?: boolean;

  @property({
    type: 'string',
  })
  firstName?: string;

  @property({
    type: 'boolean',
    required: true,
    default: true,
  })
  enabled: boolean;

  @property({
    type: 'string',
  })
  status?: string;


  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
