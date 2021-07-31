import { Entity, Property, PrimaryKey, ManyToMany, Collection } from '@mikro-orm/core'

@Entity()
export class ToolCategory {
    @PrimaryKey()
    id: number;

    @Property()
    title: string;

    @Property({ nullable: true })
    meta_title?: string;

    @Property({ nullable: true })
    content?: string;

    // @ManyToMany(() => Product, product => product.categories, { eager: false }) 
    // products = new Collection<Product>(this);
}

