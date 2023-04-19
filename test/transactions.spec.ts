import { test, beforeAll, afterAll, describe, expect } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'

describe('Transactions routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('User can create a new transaction', async () => {
    await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 100,
        type: 'credit',
      })
      .expect(201)
  })

  test('User can list all transactions', async () => {
    const createTransactionsResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 100,
        type: 'credit',
      })

    const cookies = createTransactionsResponse.get('Set-cookie')

    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    expect(listTransactionsResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: 'New transaction',
        amount: 100,
      }),
    ])
  })
})
