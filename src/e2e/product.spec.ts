import { FastifyInstance } from 'fastify'
import request from 'supertest'
import { setup } from './setup'

const FAKE_CATEGORIES = [
  { id: 1, title: 'A', meta_title: 'foobar' },
  { id: 2, title: 'B', meta_title: 'foobar' },
  { id: 3, title: 'C', meta_title: 'foobar' }
]


describe("Product API", () => {

  var token: string;
  var app: FastifyInstance;
  const product_id = 123;

  beforeAll(async () => {
    const setup_result = await setup()
    token = setup_result.token;
    app = setup_result.app;
    // await app.ready()
    // app.blipp();
    // Add Categories
    await Promise.all( FAKE_CATEGORIES.map(cat => cat.id)
      .map(async (id) => {
        return request(app.server)
          .delete(`/api/v1/category/${id}`)
          .set('authorization', token)
      }) )
    const responses = await Promise.all( FAKE_CATEGORIES.map(async (payload) => {
      return request(app.server)
        .post('/api/v1/category')
        .set('authorization', token)
        .send(payload)  
    }) )
    // console.log(responses)
  })

  afterAll(async () => {
    console.log('cleaning now')
    await request(app.server)
      .delete(`/api/v1/product/${product_id}`)
      .send()
    await Promise.all( FAKE_CATEGORIES.map(cat => cat.id)
      .map(async (id) => {
        return request(app.server)
          .delete(`/api/v1/category/${id}`)
      }) )
    await app.close();
  })

  test("POST with provided ID", async () => {
    const response = await request(app.server)
      .post('/api/v1/product')
      .set('authorization', token)
      .send({
        id: product_id,
        title: 'Foobar',
        meta_title: 'sofodsd',
        categories_id: [1, 2]
      })
    expect(response.body.id).toBe(product_id)
  })

})