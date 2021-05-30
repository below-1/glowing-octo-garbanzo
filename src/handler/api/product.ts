import { FastifyInstance } from 'fastify'
import * as fastify from 'fastify';
import * as serv from '../../service/product'
import { ID } from './commons'
import { Product } from '../../entity/Product'
import { Category } from '../../entity/Category'

interface FindOptions {
  page: number;
  keyword: string;
  per_page: number;
  only_available: boolean;
}

interface ProductUpdateInput {
  title: string;
  content?: string;
  summary: string;
  selected_categories: number[];
}

interface ProductUpdateDefective {
  defective: number;
}

export default async (fastify: FastifyInstance) => {

  fastify.post<{Body: serv.ProductData}>('/', {
    handler: async (request, reply) => {
      const payload = request.body;
      try {
        const result = await serv.create({ em: request.em, payload })
        console.log(result)
        reply.send(result)
      } catch (err) {
        console.log(err)
        reply.status(500).send({
          message: err.message
        })
      }
    }
  })

  fastify.put<{ Body: ProductUpdateInput, Params: ID }>('/:id', {
    handler: async (request, reply) => {
      const em = request.em
      const id = request.params.id
      const payload = request.body

      let product = await em.findOne(Product, id, { populate: ['categories'] })
      if (!product) {
        reply.status(404).send({ message: 'PRODUCT_NOT_FOUND' })
        return
      }
      product.title = payload.title
      product.content = payload.content
      product.updated_at = new Date()
      product.summary = payload.summary

      const cats = payload.selected_categories.map(id => em.getReference(Category, id))
      product.categories.removeAll()
      product.categories.add(...cats)
      em.persist(product)
      await em.flush()
      reply.send(product)
    }
  })

  fastify.delete<{ Params: ID }>('/:id', {
    handler: async (request, reply) => {
      const id = request.params.id
      try {
        const result = await serv.remove({
          em: request.em,
          id
        })
        reply.send(result)
      } catch (err) {
        console.log(err)
        reply.status(500).send({
          message: err.message
        })
      }
    }
  })

  fastify.get<{ Querystring: FindOptions }>('/', {
    handler: async (request, reply) => {
      try {
        const result = await serv.find({
          em: request.em,
          ...request.query
        })
        reply.send(result)
      } catch (err) {
        console.log(err)
        reply.status(500).send({
          message: err.message
        })
      }
    }
  })

  fastify.get<{ Params: ID }>('/:id', {
    handler: async (request, reply) => {
      const em = request.em
      const { id } = request.params;
      const query = request.query as any;
      const stock = query.stock ? query.stock : false;
      try {
        const result = await serv.findOne({ em, id, stock  })
        reply.send(result)
      } catch (err) {
        console.log(err)
        reply.status(500).send({
          message: err.message
        })
      }
    }
  })

}