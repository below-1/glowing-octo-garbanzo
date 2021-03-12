import { FastifyInstance } from 'fastify'
import request from 'supertest'
import { setup } from './setup'


describe("testing category API", () => {

  var token: string;
  var app: FastifyInstance;
  const id = 230

  beforeAll(async () => {
    const setup_result = await setup()
    token = setup_result.token;
    app = setup_result.app;
    await request(app.server)
      .delete(`/api/v1/category/${id}`)
      .set('authorization', token)
    console.log(`delete ${id}`)
  })

  afterAll(async () => {
    console.log('running clean up')
    await request(app.server)
      .delete(`/api/v1/category/${id}`)
      .set('authorization', token)
    await app.close();
  })

  test("testing creation with provided ID", async () => {
    const response = await request(app.server)
      .post('/api/v1/category')
      .set('authorization', token)
      .send({
        id,
        title: 'Foobar',
        meta_title: 'sofodsd'
      })
    expect(response.body.id).toBe(id)
  })

})