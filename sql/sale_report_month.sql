select o.id, o.created_at,  
  t.id as trans_id,
  json_agg(oi) as order_items,
  to_json(t) as "transaction"
  from "order" o
  join "order_item" oi on oi.order_id  = o.id
  join "transaction" t on o.transaction_id  = t.id
  where o.created_at >= ? and o.created_at <= ?
  group by o.id, t.id
  order by o.created_at 
