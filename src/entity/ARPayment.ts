import { Entity, Enum, ManyToOne, Property, PrimaryKey } from '@mikro-orm/core'
import { AccountsReceivable } from './AccountsReceivable'

@Entity()
export class ARPayment {
  @PrimaryKey()
  id: number;

  @ManyToOne()
  ar: AccountsReceivable;

  @Property({ columnType: 'numeric(17, 4)' })
  nominal: string;

  @Property()
  created_at: Date = new Date();

  @Property()
  updated_at: Date;

  @Property({ nullable: true })
  content?: string;
}