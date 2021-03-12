import axios from 'axios'
import cp from 'child_process'
import { promisify } from 'util'
import { create_app } from '../app'
import { Chance } from 'chance'

const exec = promisify(cp.exec)
const range = (n: number) => Array.from({ length: n }, (x, i) => i)
const api = axios.create({
  baseURL: 'http://localhost:5000'
})

function run_sync (cmd: string) {
  try {
    cp.execSync(cmd)
  } catch (err) {
    console.log(err)
    throw err
  }
}

async function prepare_db () {
  run_sync('dropdb --host=127.0.0.1 --port=5432 -e -U postgres cend')
  run_sync('createdb --host=127.0.0.1 --port=5432 -e -U postgres -O postgres cend')
  run_sync('psql --host=127.0.0.1 --port=5432 -U postgres -d cend -a -f database.sql')
}

export async function setup () {
  // await prepare_db()
  const app = await create_app()
  const address = await app.listen(5000)
  const username = 'adminzero'
  const login_response = await api.post('/auth/login', {
    username,
    password: username
  })

  const token: string = login_response.data.token

  return { token, app }
}