import { EntityManager } from '@mikro-orm/postgresql'
import { Knex } from '@mikro-orm/knex';

export interface DeleteInput {
  em: EntityManager;
  id: number;
}

export interface DateBetween {
  before: Date;
  after: Date;
}

export type DateFilter = DateBetween;

export interface ListResult<T> {
  items: T[];
  totalPage: number;
  totalData: number;
  page: number;
  perPage: number;
}

export interface BaseFilter {
  page: number;
  perPage: number;
  keyword?: string;
};