import axios from 'axios'
import cp from 'child_process'
import { promisify } from 'util'
import { create_app } from '../app'
import { Chance } from 'chance'

const exec = promisify(cp.exec)
const range = (n: number) => Array.from({ length: n }, (x, i) => i)

function run_sync (cmd: string) {
  try {
    process.stdout.write(cp.execSync(cmd))
  } catch (err) {
    console.log(err)
  }
}

async function prepare_db () {
  run_sync('dropdb --host=127.0.0.1 --port=5432 -e -U postgres cend')
  run_sync('createdb --host=127.0.0.1 --port=5432 -e -U postgres -O postgres cend')
  run_sync('psql --host=127.0.0.1 --port=5432 -U postgres -d cend -a -f database.sql')
}

// function generate_data ()

//   chance = new Chance();

//   public products (n: number) {
//     range(n).map(i => ({

//     }))
//   }
// }

const api = axios.create({
  baseURL: 'http://localhost:5000'
})

async function main() {
  await prepare_db()
  console.log('done preparing db')
  const app = await create_app()
  const address = await app.listen(5000)

  const username = 'adminzero'

  const register_result = await api.post('/auth/register', {
    username,
    password: username,
    first_name: 'jordan',
    last_name: 'meta'
  })
  console.log('register result')
  console.log(register_result.data)

  const login_response = await api.post('/auth/login', {
    username,
    password: username
  })

  const token = login_response.data.token
  console.log('login token')
  console.log(token)

  const chance = new Chance(1)

  const N_CAT = 10
  const N_PRODUCT = 100
  const N_SUPPLIER = 5
  const N_CUSTOMER = 20
  const N_PURCHASE = 20
  const N_SALE = 20
  const cat_responses_proms = range(N_CAT)
    .map(i => ({
       title: chance.name()
    }))
    .map(async (payload) => {
      return api.post('/api/v1/category', payload, {
        headers: {
          authorization: `Bearer ${token}`
        }
      })
    })
  const cat_responses = await Promise.all(cat_responses_proms)
  const categories = cat_responses.map(cr => cr.data)
  const categories_ids = categories.map(c => c.id)
  // console.log(categories)

  const product_responses_proms = range(N_PRODUCT)
    .map(i => ({
      title: chance.name(),
      summary: chance.sentence({ words: 5 }),
      categories_id: chance.pickset(categories_ids, 3)
    }))
    .map(payload => api({
      method: 'post',
      url: '/api/v1/product',
      data: payload,
      headers: {
        authorization: `Bearer ${token}`
      }
    }))

  const product_responses = await Promise.all(product_responses_proms)
  const products = product_responses.map(resp => resp.data)
  const products_ids = products.map(p => p.id)
  // console.log(products_ids)

  const supplier_responses_proms = range(N_SUPPLIER)
    .map(i => ({
      first_name: chance.company(),
      address: chance.address(),
      email: chance.email(),
      mobile: chance.phone({ country: 'id' })
    }))
    .map(data => api({
      method: 'post',
      url: '/api/v1/supplier',
      data,
      headers: {
        authorization: `Bearer ${token}`
      }
    }))
  const supplier_responses = await Promise.all(supplier_responses_proms)
  const suppliers = supplier_responses.map(resp => resp.data)
  const suppliers_ids = suppliers.map(supplier => supplier.id)

  const customer_responses_proms = range(N_CUSTOMER)
    .map(i => ({
      first_name: chance.name(),
      last_name: chance.word(),
      address: chance.address(),
      email: chance.email(),
      mobile: chance.phone({ country: 'id' })
    }))
    .map(data => api({
      method: 'post',
      url: '/api/v1/customer',
      data,
      headers: {
        authorization: `Bearer ${token}`
      }
    }))
  const customer_responses = await Promise.all(customer_responses_proms)
  const customers = customer_responses.map(resp => resp.data)
  const customers_ids = customers.map(customer => customer.id)

  const purchase_responses_proms = range(N_PURCHASE)
    .map(i => {
      const N_ITEMS = chance.natural({ min: 5, max: 10 })
      const product_ids = chance.pickset(products_ids, N_ITEMS)
      let items = product_ids
        .map(pid => {
          let price = chance.natural({ min: 24, max: 100 }) * 1000
          let quantity = chance.natural({ min: 1, max: 4 }) * 10
          let item_data = {
            product_id: pid,
            discount: 0,
            price,
            sale_price: price + (chance.natural({ min: 1, max: 5 }) * 1000),
            quantity,
            available: quantity,
            defective: 0
          }
          return item_data
        })
      let purchase_data = {
        supplier_id: chance.pickone(suppliers_ids),
        // tax: chance.pickone([0, 0.1, 0.05]),
        tax: 0,
        created_at: (chance.date({ year: 2020 }) as Date).toISOString(),
        content: chance.sentence({ words: 12 }),
        discount: 0,
        status: 'COMPLETE',
        trans_status: 'SUCCESS',
        trans_mode: 'ONLINE',
        items
      }
      return api({
        method: 'post',
        url: '/api/v1/purchase',
        data: purchase_data,
        headers: {
          authorization: `Bearer ${token}`
        }
      })
    })
  try {
    const purchase_responses = await Promise.all(purchase_responses_proms)
    const purchases = purchase_responses.map(resp => resp.data)
    console.log(purchases)
  } catch (err) {
    if (err.response) {
      console.log(err.response.data)
    }
  }

  const items_response = await api({
    method: 'get',
    url: '/api/v1/item/all',
    headers: {
      authorization: `Bearer ${token}`
    }
  })
  // console.log('items_response')
  // console.log(items_response)
  const ALL_ITEMS: any[] = items_response.data

  const sale_responses_proms = ALL_ITEMS
    .map((stock_item: any) => {
      const quantity = chance.natural({ min: 2, max: 5 })
      const trans_nominal = quantity * (stock_item.sale_price - (stock_item.sale_price * stock_item.discount))
      const items = [
        {
          product_id: stock_item.product,
          item_id: stock_item.id,
          quantity
        }
      ]
      let payload = {
        customer_id: chance.pickone(customers_ids),
        tax: 0,
        created_at: (chance.date({ year: 2020 }) as Date).toISOString(),
        content: chance.sentence({ words: 12 }),
        discount: chance.pickone([0, 5, 10]),
        status: 'COMPLETE',
        trans_status: 'SUCCESS',
        trans_mode: 'ONLINE',
        trans_nominal,
        items
      }
      return api({
        method: 'post',
        url: '/api/v1/sale',
        data: payload,
        headers: {
          authorization: `Bearer ${token}`
        }
      })
    })

  try {
    const sale_responses: any[] = await Promise.all(sale_responses_proms)
    const sales = sale_responses.map(sr => sr.data)
    console.log(sales)
  } catch (err) {
    console.log(err)
    if (err.response) {
      console.log(err.response.data)
    }
  }

  await app.close()
}

main()
