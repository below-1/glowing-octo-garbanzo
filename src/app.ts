require('dotenv').config()

import { join } from 'path'
import { MikroORM } from '@mikro-orm/core'
import { PostgreSqlDriver, EntityManager } from '@mikro-orm/postgresql';
import { User } from './entity/User'
import mikroOrmConfig from './mikro-orm.config'
import fastify, { FastifyRequest } from 'fastify'
import cors from 'fastify-cors'
import blipp from 'fastify-blipp'
import fstatic from 'fastify-static'
// import multer from 'fastify-multer'
import auth_handler from './handler/auth'
import api_handler from './handler/api'
// import pov from 'point-of-view'
// import nunjucks from 'nunjucks'

declare module 'fastify' {
    interface FastifyRequest {
        blipp(): void;
        em: EntityManager;
        user: User;
    }
}

export async function create_app () {
    const orm = await MikroORM.init<PostgreSqlDriver>(mikroOrmConfig as any);
    const server = fastify({})

    server.addHook("onRequest", (request, reply, done) => {
        request.em = orm.em.fork();
        done();
    })
    server.register(blipp);
    server.register(cors, { origin: true })
    server.register(auth_handler, { prefix: '/auth' })
    server.register(api_handler, { prefix: '/api/v1' })

    return server;
}
