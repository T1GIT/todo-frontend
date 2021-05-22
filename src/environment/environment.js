const { BASE_URL, NODE_ENV = '' } = process.env

const API_URL = new URL('http://localhost:8000/api/v0.1/')

export { BASE_URL, NODE_ENV, API_URL }
