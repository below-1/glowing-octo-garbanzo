import { FastifyInstance } from 'fastify'
import check_auth from '../../service/auth/check_auth'
import category_handler from './category'
import product_handler from './product'
import supplier_handler from './supplier'
import customer_handler from './customer'
import purchase_handler from './purchase'
import sale_handler from './sale'
import item_handler from './item'
import ar_handler from './ar'
import ap_handler from './ap'
import opex_handler from './opex'
import optype_handler from './optype'
import report_handler from './report'
import admin_handler from './admin'
import employer_handler from './employer'
import items_handler from './items'
import tool_handler from './tool'

export default async (fastify: FastifyInstance) => {

    fastify.addHook('preHandler', async (request, reply) => {
        const auth = request.headers.authorization as string
        if (!auth) {
            reply.status(400).send({ message: 'no token in headers' })
            return
        }
        try {
            const token = auth.split(' ')[1]
            const user = await check_auth({ em: request.em, token })
            request.user = user
        } catch (err) {
            console.log(err)
            reply.status(400).send({ message: err.message })
        }
    })

    fastify.route({
        url: '/',
        method: 'GET',
        handler: async (request, reply) => {
            reply.send('Okay')
        }
    })

    fastify.register(category_handler, { prefix: '/category' })
    fastify.register(product_handler, { prefix: '/product' })
    fastify.register(supplier_handler, { prefix: '/supplier' })
    fastify.register(customer_handler, { prefix: '/customer' })
    fastify.register(purchase_handler, { prefix: '/purchase' })
    fastify.register(sale_handler, { prefix: '/sale' })
    fastify.register(item_handler, { prefix: '/item' })
    fastify.register(ar_handler, { prefix: '/ar' })
    fastify.register(ap_handler, { prefix: '/ap' })
    fastify.register(opex_handler, { prefix: '/opex' })
    fastify.register(optype_handler, { prefix: '/optype' })
    fastify.register(report_handler, { prefix: '/report' })
    fastify.register(admin_handler, { prefix: '/admin' })
    fastify.register(employer_handler, { prefix: '/employer' })
    fastify.register(items_handler, { prefix: '/items' })
    fastify.register(tool_handler, { prefix: '/tool' })

}