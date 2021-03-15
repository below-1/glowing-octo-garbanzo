import { Entity, Enum, ManyToOne, Property, PrimaryKey } from '@mikro-orm/core'
import { AccountsReceivable } from './AccountsReceivable'
import { User } from './User'

@Entity()
export class ARPayment {
  @PrimaryKey()
  id: number;

  @ManyToOne(() => AccountsReceivable, { onDelete: 'cascade' })
  ar: AccountsReceivable;

  @ManyToOne({ onDelete: 'set null', hidden: true })
  admin: User;

  @Property({ columnType: 'numeric(17, 4)' })
  nominal: string;

  @Property()
  created_at: Date = new Date();

  @Property({ nullable: true })
  updated_at: Date;

  @Property({ nullable: true })
  content?: string;
}