import { Entity, Enum, ManyToOne, Property, PrimaryKey } from '@mikro-orm/core'

@Entity()
export class OperatingExpense {
  @PrimaryKey()
  id: number;

  @Property()
  name: string;

  @Property()
  created_at: Date = new Date();

  @Property({ nullable: true })
  updated_at?: Date;
}