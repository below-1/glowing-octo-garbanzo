import { Entity, Enum, Property, PrimaryKey } from '@mikro-orm/core'
import { Role } from './Role'

@Entity()
export class User {
    @PrimaryKey()
    id: number;

    @Property({ nullable: true })
    username?: string;

    @Property({ hidden: true, nullable: true })
    password_hash?: string;

    @Property({ nullable: true })
    first_name?: string;

    @Property({ nullable: true })
    last_name?: string;

    @Property({ nullable: true })
    mobile?: string;

    @Property({ nullable: true })
    email?: string;

    @Property({ nullable: true })
    registered_at?: Date = new Date();

    @Property({ nullable: true })
    last_login?: Date;

    @Property({ nullable: true })
    address?: string;

    @Enum(() => Role)
    role: Role;

    public fill (d: Partial<User>) {
        this.username = d.username
        this.first_name = d.first_name
        this.last_name = d.last_name
        this.role = d.role!
        this.address = d.address
        this.email = d.email
        this.mobile = d.mobile
    }
}