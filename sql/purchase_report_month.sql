select 
  o.id,
  to_char(o.created_at, 'YYYY-MM-DD') as created_at,
  t.code,  
  u.first_name as "supplier",
  u.address,
  t.nominal as "nominal",
  json_agg(
    json_build_object(
      'product', p.title,
      'price', it.price,
      'sale_price', it.sale_price,
      'unit', it.quantity,
      'available', it.available,
      'defective', it.defective,
      'sold', it.sold,
      'quantity', it.available + it.defective + it.sold,
      'unit', p.unit
    ) 
  ) as "items"
  from "order" o
  join "user" u on o.user_id  = u.id
  join "transaction" t on o.transaction_id  = t.id 
  join item it on it.order_id = o.id
  join product p on it.product_id = p.id
  where o."type" = 1 and o.created_at >= ? and o.created_at <= ?
  group by o.id, u.id, t.id
  order by o.created_at 
