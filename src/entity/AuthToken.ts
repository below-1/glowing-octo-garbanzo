import { Entity, ManyToOne, Property, PrimaryKey } from '@mikro-orm/core'
import { User } from './User'

@Entity()
export class AuthToken {
    @PrimaryKey()
    id: number;
 
    @ManyToOne(() => User)
    user: User;

    @Property()
    expired: Date;

    @Property()
    token: string;
}