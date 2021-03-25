set names 'utf8';
set session_replication_role = 'replica';

create table "operating_expense" ("id" serial primary key, "name" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) null);

create table "product" ("id" serial primary key, "title" varchar(255) not null, "summary" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) null, "content" varchar(255) null);

create table "category" ("id" serial primary key, "title" varchar(255) not null, "meta_title" varchar(255) null, "content" varchar(255) null);

create table "product_categories" ("product_id" int4 not null, "category_id" int4 not null);
alter table "product_categories" add constraint "product_categories_pkey" primary key ("product_id", "category_id");

create table "user" ("id" serial primary key, "username" varchar(255) null, "password_hash" varchar(255) null, "first_name" varchar(255) null, "last_name" varchar(255) null, "mobile" varchar(255) null, "email" varchar(255) null, "registered_at" timestamptz(0) null, "last_login" timestamptz(0) null, "address" varchar(255) null, "role" text check ("role" in ('ADMIN', 'SUPPLIER', 'CUSTOMER')) not null);

create table "auth_token" ("id" serial primary key, "user_id" int4 not null, "expired" timestamptz(0) not null, "token" varchar(255) not null);

create table "transaction" ("id" serial primary key, "user_id" int4 not null, "delay_id" int4 null, "order_id" int4 null, "opex_id" int4 null, "nominal" numeric(17, 4) not null, "code" varchar(255) not null, "type" text check ("type" in ('CREDIT', 'DEBIT')) not null, "mode" text check ("mode" in ('OFFLINE', 'CASH', 'ON_DELIVERY', 'CHEQUE_DRAFT', 'WIRED', 'ONLINE')) not null, "status" text check ("status" in ('NEW', 'CANCELLED', 'FAILED', 'PENDING', 'DECLINED', 'REJECTED', 'SUCCESS')) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) null, "content" text null);
alter table "transaction" add constraint "transaction_order_id_unique" unique ("order_id");

create table "order" ("id" serial primary key, "user_id" int4 not null, "delay_id" int4 null, "transaction_id" int4 null, "type" smallint not null, "status" text check ("status" in ('CHECKOUT', 'DELIVERED', 'PAID', 'FAILED', 'RETURNED', 'COMPLETE', 'AR')) not null, "item_discount" numeric(17, 4) not null, "tax" numeric(17, 4) not null, "shipping" numeric(17, 4) not null, "sub_total" numeric(17, 4) not null, "total" numeric(17, 4) not null, "grand_total" numeric(17, 4) not null, "promo" varchar(255) null, "discount" numeric(17, 4) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) null, "content" varchar(255) null);
alter table "order" add constraint "order_delay_id_unique" unique ("delay_id");
alter table "order" add constraint "order_transaction_id_unique" unique ("transaction_id");

create table "item" ("id" serial primary key, "created_by_id" int4 not null, "supplier_id" int4 not null, "order_id" int4 not null, "product_id" int4 not null, "sku" varchar(255) null, "discount" numeric(17, 4) not null, "sale_price" numeric(17, 4) not null, "price" numeric(17, 4) not null, "quantity" integer not null, "sold" integer not null, "available" integer not null, "defective" integer not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) null, "content" varchar(255) null);

create table "order_item" ("id" serial primary key, "product_id" int4 not null, "item_id" int4 not null, "order_id" int4 not null, "sku" varchar(255) null, "price" numeric(17, 4) not null, "discount" numeric(17, 4) not null, "quantity" integer not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) null, "content" varchar(255) null);

create table "delay" ("id" serial primary key, "type" text check ("type" in ('RECEIVABLE', 'PAYABLE')) not null, "order_id" int4 not null, "admin_id" int4 not null, "created_at" timestamptz(0) not null, "complete" bool not null, "due_date" timestamptz(0) not null, "total" numeric(17, 4) not null);
alter table "delay" add constraint "delay_order_id_unique" unique ("order_id");

alter table "product_categories" add constraint "product_categories_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade on delete cascade;
alter table "product_categories" add constraint "product_categories_category_id_foreign" foreign key ("category_id") references "category" ("id") on update cascade on delete cascade;

alter table "auth_token" add constraint "auth_token_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;

alter table "transaction" add constraint "transaction_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;
alter table "transaction" add constraint "transaction_delay_id_foreign" foreign key ("delay_id") references "delay" ("id") on update cascade on delete cascade;
alter table "transaction" add constraint "transaction_order_id_foreign" foreign key ("order_id") references "order" ("id") on update cascade on delete cascade;
alter table "transaction" add constraint "transaction_opex_id_foreign" foreign key ("opex_id") references "operating_expense" ("id") on update cascade on delete cascade;

alter table "order" add constraint "order_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;
alter table "order" add constraint "order_delay_id_foreign" foreign key ("delay_id") references "delay" ("id") on update cascade on delete set null;
alter table "order" add constraint "order_transaction_id_foreign" foreign key ("transaction_id") references "transaction" ("id") on update cascade on delete set null;

alter table "item" add constraint "item_created_by_id_foreign" foreign key ("created_by_id") references "user" ("id") on update cascade;
alter table "item" add constraint "item_supplier_id_foreign" foreign key ("supplier_id") references "user" ("id") on update cascade on delete cascade;
alter table "item" add constraint "item_order_id_foreign" foreign key ("order_id") references "order" ("id") on update cascade on delete cascade;
alter table "item" add constraint "item_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade;

alter table "order_item" add constraint "order_item_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade on delete cascade;
alter table "order_item" add constraint "order_item_item_id_foreign" foreign key ("item_id") references "item" ("id") on update cascade on delete cascade;
alter table "order_item" add constraint "order_item_order_id_foreign" foreign key ("order_id") references "order" ("id") on update cascade on delete cascade;

alter table "delay" add constraint "delay_order_id_foreign" foreign key ("order_id") references "order" ("id") on update cascade on delete cascade;
alter table "delay" add constraint "delay_admin_id_foreign" foreign key ("admin_id") references "user" ("id") on update cascade on delete set null;

set session_replication_role = 'origin';

