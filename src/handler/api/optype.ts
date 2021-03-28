import { FastifyInstance } from 'fastify'
import { OperatingExpense as Opex } from '../../entity/OperatingExpense'

interface OpData {
  name: string;
}

interface FindOptions {
  page?: number;
  per_page?: number;
  keyword?: string;
}

export default async (fastify: FastifyInstance) => {

  fastify.get<{ Querystring: FindOptions }>('/', async (request, reply) => {
    const em = request.em
    const knex = em.getKnex()
    const options = request.query
    let query = knex('operating_expense as op')
      .leftJoin('transaction as t', 't.opex_id', 'op.id')
    let total_page: number
    let offset: number | undefined
    let result: any = {}
    if (options.keyword) {
      query = query.andWhere('name', 'ilike', `${options.keyword}%`)
    }
    if (options.per_page) {
      let count_query = query.clone()
      const [ cres ] = await count_query.count('*')
      const count = parseInt(cres.count as string)
      result.total_items = count
      result.total_page = Math.ceil(count / options.per_page)
      offset = options.per_page * options.page!
    }
    if (offset !== undefined) {
      query = query.limit(options.per_page!)
        .offset(offset)
    }
    console.log(
          query.select([
        'op.id',
        'op.name',
        'op.created_at',
        knex.raw('count(t.id) as total_trans')
      ])
      .groupBy('op.id').toSQL()
    )
    result.items = await query.select([
        'op.id',
        'op.name',
        'op.created_at',
        knex.raw('count(t.id) as total_trans')
      ])
      .groupBy('op.id')
    console.log('here')
    console.log(result)

    reply.send(result)
  })

  fastify.post<{ Body: OpData }>('/', async (request, reply) => {
    const em = request.em
    const payload = request.body
    let opex = new Opex()
    opex.name = payload.name
    em.persist(opex)
    try {
      await em.flush()
      reply.send(opex)
    } catch (err) {
      console.log(err)
      reply.send({
        error: err.message
      })
    }
  })

}