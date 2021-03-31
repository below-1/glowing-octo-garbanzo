import { isMainThread, parentPort, workerData } from 'worker_threads';

if (isMainThread) {
  process.exit(1)
}

import morm from './morm'
import { addDays, lastDayOfMonth, set, format } from 'date-fns'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import carbone from 'carbone'
import { print } from './report'

const SQL_sale_report_month = readFileSync(
  join(process.cwd(), 'sql/sale_report_month.sql')
).toString()

function expand_items (items: any[]) {
  let result: any = []
  let index = 0
  items.forEach((item, index) => {
    let sub_result = []
    let { items: subs, ...rest } = item
    const [ first, ...resits ] = subs
    index += 1
    sub_result.push({
      index,
      ...first,
      ...rest
    })
    sub_result = [ 
      ...sub_result,
      ...resits.map((it: any) => ({
        ...it
      }))
    ]
    result = [ ...result, ...sub_result ]
  })
  return result
}

async function gen_sale_report_month (year: number, month: number) {
  const orm = await morm()
  const t0 = new Date(year, month - 1 , 1)
  const last_day = lastDayOfMonth(t0).getDate()
  const t1 = set(t0, { date: last_day })

  const t0_str = format(t0, 'yyyy-MM-dd')
  const t1_str = format(t1, 'yyyy-MM-dd')
  let items: any = await orm.em.execute(SQL_sale_report_month, [t0_str, t1_str])
  items = expand_items(items)
  const render_data = {
    items,
    month,
    year
  }

  const padded_month = `${month}`.padStart(2, '0')
  const filename = `sale_report_month_${year}_${padded_month}.xlsx`
  print({
    data: render_data,
    template: 'sale_report_month.xlsx',
    destination: filename
  })
  return filename
}

gen_sale_report_month(workerData.year, workerData.month)
  .then(result => {
    parentPort!.postMessage(result)
  })
  .catch(err => {
    console.log(err)
    parentPort!.postMessage({ status: 'ERROR', err })
  })
