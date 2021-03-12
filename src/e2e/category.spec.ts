import { FastifyInstance } from 'fastify'
import request from 'supertest'
import { setup } from './setup'

var token: string;
var app: FastifyInstance;

beforeAll(async () => {
  try {
    const setup_result = await setup()
    token = setup_result.token;
    app = setup_result.app;
  } catch (err) {
    console.log(err)
    console.log('test fixture fail successfully')
  }
})

afterAll(async () => {
  await app.close();
})

describe("testing category API", () => {

  const id = 230

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