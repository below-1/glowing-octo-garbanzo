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

export interface ListResult<T> {
  items: T[];
  total_page: number;
  total_data: number;
  page: number;
  per_page: number;
}

export interface PagingFilter {
  page: number;
  perPage: number;
  keyword?: string;
  type: 'paging';
}

export interface AllFilter {
  type: 'all';
}

export type BaseFilter = AllFilter | PagingFilter;
