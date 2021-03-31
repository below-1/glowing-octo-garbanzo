select 
  o.id,
  to_char(o.created_at, 'YYYY-MM-DD') as created_at,
  t.code,  
  u.first_name as "customer",
  u.address,
  t.nominal as "nominal",
  count(oi.id) as total_items,
  json_agg(
    json_build_object(
      'product', p.title,
      'price', oi.price,
      'unit', oi.quantity || ' ' || p.unit 
    ) 
  ) as "items"
  from "order" o
  join "user" u on o.user_id  = u.id
  join "transaction" t on o.transaction_id  = t.id
  left join order_item oi on o.id = oi.order_id 
  left join product p on oi.product_id = p.id
  where o.created_at >= ? and o.created_at <= ?
  group by o.id, u.id, t.id
  order by o.created_at 
