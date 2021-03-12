import { EntityManager } from '@mikro-orm/postgresql'

export interface DeleteInput {
  em: EntityManager;
  id: number;
}