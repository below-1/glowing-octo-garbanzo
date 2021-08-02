import { randomBytes } from 'crypto'
import { Entity, Enum, Unique, Property, PrimaryKey, ManyToOne, OneToOne, BeforeCreate } from '@mikro-orm/core'
import { Order } from './Order'
import { OperatingExpense as Opex } from './OperatingExpense'
import { Delay } from './Delay'
import { AccountsReceivable } from './AccountsReceivable'
import { User } from './User'
import { Tool } from './Tool'
import Chance from 'chance'

export enum Type {
    CREDIT = 'CREDIT',
    DEBIT = 'DEBIT'
}

export enum Status {
    NEW = 'NEW',
    CANCELLED = 'CANCELLED',
    FAILED = 'FAILED',
    PENDING = 'PENDING',
    DECLINED = 'DECLINED',
    REJECTED = 'REJECTED',
    SUCCESS = 'SUCCESS'
}

export enum Mode {
    OFFLINE = 'OFFLINE',
    CASH = 'CASH',
    ON_DELIVERY = 'ON_DELIVERY',
    CHEQUE_DRAFT = 'CHEQUE_DRAFT',
    WIRED = 'WIRED',
    ONLINE = 'ONLINE'
}

@Entity()
export class Transaction {
    @PrimaryKey()
    id: number;

    @ManyToOne()
    user!: User;

    @ManyToOne({ entity: () => Delay, onDelete: 'cascade', nullable: true })
    delay: Delay;

    @OneToOne({ onDelete: 'cascade', nullable: true })
    order: Order;

    @OneToOne({ onDelete: 'cascade', nullable: true })
    tool: Tool;

    @ManyToOne({ onDelete: 'cascade', nullable: true })
    opex: Opex;

    @Property({ columnType: 'numeric(17, 4)' })
    nominal: string;

    @Property()
    code: string = randomBytes(20).toString('hex');

    @Enum(() => Type)
    type!: Type;

    @Enum(() => Mode)
    mode!: Mode;

    @Enum(() => Status)
    status!: Status;

    @Property()
    created_at: Date = new Date();

    @Property({ nullable: true })
    updated_at?: Date;

    @Property({ nullable: true, columnType: 'text' })
    content?: string;

    @BeforeCreate()
    generate_code () {
        if (!this.user) {
            throw new Error('USER_INVALID')
        }
        if (!this.created_at) {
            throw new Error('DATE_INVALID')
        }
        const admin_code = `${this.user.id}`.padStart(2, '0')
        const date = this.created_at
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const year_code = `${year}`
        const month_code = `${month}`.padStart(2, '0')
        const type_code = this.type == 'DEBIT' ? '02' : '01'
        const chance = new Chance()
        const un = chance.string({ length: 4, alpha: true, numeric: true, casing: 'upper' })
        this.code = `${admin_code}-${type_code}-${year_code}${month_code}-${un}`
    }
}