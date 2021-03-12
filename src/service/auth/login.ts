import { EntityManager } from '@mikro-orm/core'
import { User } from '../../entity/User'
import { Role } from '../../entity/Role'
import { AuthToken } from '../../entity/AuthToken'
import rand_str from '../rand_str'
import { add } from 'date-fns'
import bcrypt from 'bcrypt'

export default async function ({ em, payload } : { em: EntityManager, payload: any }) {
    const user = await em.findOne(User, { role: Role.ADMIN, username: payload.username })
    if (!user) {
        throw new Error('USER_NOT_FOUND')
    }
    const is_valid = await bcrypt.compare(payload.password, user.password_hash as string)
    if (!is_valid) {
        throw new Error('PASSWORD_NOT_MATCH')
    }
    const token = rand_str(20)
    const expired = add(new Date(), { days: 2 })
    let auth_token = new AuthToken()
    auth_token.token = token
    auth_token.expired = expired
    auth_token.user = user
    em.persist(auth_token)
    await em.flush()
    return { user, token }
}
