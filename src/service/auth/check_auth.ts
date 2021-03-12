import { EntityManager } from '@mikro-orm/postgresql'
import { User } from '../../entity/User'
import { AuthToken } from '../../entity/AuthToken'

export default async function ({ em, token } : { em: EntityManager, token: string }) {
  const auth_token = await em.findOne(
    AuthToken, 
    {
      $and: [
        { token },
        { expired: { $gt: new Date() } }
      ]
    },
    ['user'])
  if (!auth_token) {
    throw new Error('NOT_LOGGED_IN');
  }
  return auth_token.user;
}