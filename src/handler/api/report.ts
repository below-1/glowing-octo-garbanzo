import { FastifyInstance } from 'fastify'
import { Worker } from 'worker_threads';
import { join } from 'path'
import { monthlySummary } from '../../service/monthly_summary'

interface ReportOption {
  year: number;
  month: number;
}

export default async (fastify: FastifyInstance) => {

  fastify.get<{ Querystring: ReportOption }>('/sale_monthly', {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          year: { type: 'integer' },
          month: { type: 'integer' }
        }
      }
    },
    handler: async (request, reply) => {
      const opts = request.query
      const filename = join(__dirname, '..', '..', 'service', 'report_monthly.js')
      const worker_input = {
        ...opts,
        entity: 'sale',
        sql: 'sale_report_month.sql'
      }
      const worker = new Worker(filename, { workerData: worker_input })
      worker.on('message', result => {
        console.log(result)
        reply.send({ path: `/report/${result}` })
      })
      worker.on('error', error => {
        reply.status(500).send({ error })
      })
      worker.on('exit', code => {
        let scode = 200
        let message = 'exited'
        if (code != 0) {
          scode = 500
          message = 'something went wrong'
        }
        reply.status(scode).send({ message })
      })
    }
  })

  fastify.get<{ Querystring: ReportOption }>('/purchase_monthly', {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          year: { type: 'integer' },
          month: { type: 'integer' }
        }
      }
    },
    handler: async (request, reply) => {
      const opts = request.query
      const worker_input = {
        ...opts,
        sql: 'purchase_report_month.sql',
        entity: 'purchase'
      }
      const filename = join(__dirname, '..', '..', 'service', 'report_monthly.js')
      const worker = new Worker(filename, { workerData: worker_input })
      worker.on('message', result => {
        reply.send({ path: `/report/${result}` })
      })
      worker.on('error', err => {
        reply.status(500).send({ err })
      })
      worker.on('exit', code => {
        let scode = 200
        let message = 'exited'
        if (code != 0) {
          scode = 500
          message = 'something went wrong'
        }
        reply.status(scode).send({ message })
      })
    }
  })

  fastify.get<{ 
    Querystring: ReportOption,
    Params: { tp: 'sale' | 'purchase' }
  }>('/:type/monthly_summary', {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          year: { type: 'integer' },
          month: { type: 'integer' }
        }
      }
    },
    handler: async (request, reply) => {
      const opts = request.query
      const em = request.em;
      const res = await monthlySummary({
        ...opts,
        tp: request.params.tp
      }, em);
      console.log(res);
      return res;
    }
  })

}