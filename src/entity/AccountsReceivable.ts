import { Entity, Enum, ManyToOne, Property, PrimaryKey } from '@mikro-orm/core'
import { Mode, Status } from './Transaction'
import { User } from './User'
import { Order } from './Order'

export class AccountsReceivable {
  @PrimaryKey()
  id: number;

  @ManyToOne()
  order: Order;

  @Property()
  created_at: Date = new Date();

  @Property()
  due_at: Date;

  @Property({ columnType: 'numeric(17, 4)' })
  total: string;

  @Property({ columnType: 'numeric(17, 4)' })
  total_paid: string;

  @Property({ columnType: 'numeric(17, 4)' })
  leftover: string;
}