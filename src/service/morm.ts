import { MikroORM } from '@mikro-orm/core'
import { PostgreSqlDriver, EntityManager } from '@mikro-orm/postgresql';
import mikroOrmConfig from '../mikro-orm.config'

export default () => MikroORM.init<PostgreSqlDriver>(mikroOrmConfig as any)
