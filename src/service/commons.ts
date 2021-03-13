import { EntityManager } from '@mikro-orm/postgresql'

export interface DeleteInput {
  em: EntityManager;
  id: number;
}

export interface DateBetween {
  before: Date;
  after: Date;
}

export type DateFilter = DateBetween;
