select day, coalesce(sub.nominal, 0) as total
	from (
		select 		date_trunc('day', o.created_at) as day,
							sum(t.nominal) as nominal
		from 			"order" o
		join 			"transaction" t on o.transaction_id = t.id
		where 		o.created_at >= '#t0'
			and			o.created_at <= '#t1'
			and			t.status 			=	'SUCCESS'
			and			o."type" 			=	#type
		group by	1
	) as sub
	right join 	generate_series(
                '#t0'::timestamp, 
                '#t1'::timestamp, 
                '1 day') as day using (day)
	order by		1;