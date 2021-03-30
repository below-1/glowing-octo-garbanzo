select count(*) as total
  from "transaction" t 
  where t.created_at >= ? and t.created_at <= ?
