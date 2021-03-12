import { EntityManager } from '@mikro-orm/core'
import { User } from '../../entity/User'
import { Role } from '../../entity/Role'
import bcrypt from 'bcrypt'

export default async function ({ em, payload } : { em: EntityManager, payload: any }) {
    const password_hash = await bcrypt.hash(payload.password, 2)
    let user = new User()
    user.username = payload.username
    user.password_hash = password_hash
    user.first_name = payload.first_name
    user.last_name = payload.last_name
    user.mobile = payload.mobile
    user.email = payload.email
    user.registered_at = new Date()
    user.role = (payload.role as Role)
    em.persist(user)
    await em.flush()
    return user
}