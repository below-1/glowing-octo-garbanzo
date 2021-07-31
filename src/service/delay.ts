import { EntityManager } from '@mikro-orm/postgresql'
import { Knex } from '@mikro-orm/knex';
import { count, listing2, listingAll, ListingParams, ListingResult } from './listing';

type Type  = 'RECEIVABLE' | 'PAYABLE';
type ExtraFilter = {
  keyword: string;
  type: Type;
  completeOnly: boolean;
}
type DelayFilter = ListingParams & ExtraFilter;

const baseListingQuery = (knex: Knex) => knex('delay as d')
  .join('user as empl', 'empl.id', 'd.admin_id')
  .join('order as o', 'd.order_id', 'o.id')
  .join('user as u', 'u.id', 'o.user_id')
  .leftJoin('transaction as t', 't.delay_id', 'd.id')

export const findPaging = async (em: EntityManager, filter: DelayFilter) => {
  const knex = em.getKnex();
  let query = baseListingQuery(knex);
  query = query
    .andWhere('d.type', '=', filter.type)
    .where('u.first_name', 'ilike', `${filter.keyword}%`);
  if (filter.completeOnly) {
    query = query.andWhere('d.complete', '=', '0');
  }
  const { total_data } = await count(query);

  const columns = [
    'd.id',
    'd.complete',
    'd.due_date',
    'd.total',
    'd.type',
    'empl.id as empl_id',
    'empl.first_name as empl_name',
    'u.id as user_id',
    'u.first_name as user_name',
    knex.raw('sum(t.nominal) as paid'),
    'o.id as order_id',
    'o.grand_total as order_grand_total',
    'o.created_at as order_created_at'
  ];

  query = query
    .select(columns)
    .groupBy(['d.id', 'u.id', 'o.id', 'empl.id'])
    .orderBy('d.created_at', 'DESC');
  console.log(query.toSQL());
  const result = await listing2(query, filter, total_data);
  return result;
}
