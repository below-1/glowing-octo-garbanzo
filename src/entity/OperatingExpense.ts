import { Entity, Enum, ManyToOne, Property, PrimaryKey } from '@mikro-orm/core'
import { Mode, Status } from './Transaction'
import { User } from './User'

export enum Type {
    A = 'A',
    B = 'B'
}

@Entity()
export class OperatingExpense {
  @PrimaryKey()
  id: number;

  @ManyToOne()
  user!: User;

  @Property({ columnType: 'numeric(17, 4)' })
  nominal: string;

  @Enum(() => Type)
  type!: Type;

  @Enum(() => Mode)
  mode!: Mode;

  @Property()
  created_at: Date = new Date();

  @Property({ nullable: true })
  updated_at?: Date;

  @Enum(() => Status)
  status!: Status;
}