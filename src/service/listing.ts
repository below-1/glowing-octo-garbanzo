import { Knex } from '@mikro-orm/knex';

export interface ListingParams {
  page: number;
  per_page: number;
}

export interface ListingResult {
  page: number;
  per_page: number;
  items: any[];
  total_page: number;
  total_data: number;
}

interface Listing {
  count: () => ({ total_data: number });
  listing: () => ListingResult;
}

type Total = () => Promise<number> | number;

export async function count(baseQuery: Knex.QueryBuilder) {
  const countQuery = baseQuery.clone().count();
  console.log(countQuery.toSQL());
  const count: any[] = await countQuery;
  const total_data = parseInt(count[0]['count']);
  return { total_data };
}

export async function listing(baseQuery: Knex.QueryBuilder, params: ListingParams) {
  const { per_page, page } = params;
  const { total_data } = await count(baseQuery);
  const total_page = Math.ceil(total_data / per_page);
  const offset = page * per_page;
  const items = await baseQuery.limit(per_page).offset(offset);
  return {
    page,
    per_page,
    items,
    total_page,
    total_data,
  };
}

export async function listing2(baseQuery: Knex.QueryBuilder, params: ListingParams, total_data: number) {
  const { per_page, page } = params;
  const total_page = Math.ceil(total_data / per_page);
  const offset = page * per_page;
  const items = await baseQuery.limit(per_page).offset(offset);
  return {
    page,
    per_page,
    items,
    total_page,
    total_data,
  };
}

export async function listingAll(baseQuery: Knex.QueryBuilder) {
  const { total_data } = await count(baseQuery);
  const per_page = total_data;
  const page = 0;
  return listing(baseQuery, { per_page, page });
}

export function wrappedListing(baseQuery: Knex.QueryBuilder) {
  return (params: ListingParams) => {
    return listing(baseQuery, params);
  }
}
