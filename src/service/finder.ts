import { EntityManager } from '@mikro-orm/postgresql'

export type FinderOptions = {
  skip: number;
  limit: number;
  keyword: number;
}

// export async function findEntity (options: FinderOptions) {
//   const knex = options.em.getKnex();

// }