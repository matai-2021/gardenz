import request from 'superagent'
import { getAuthorizationHeader } from './auth'

const baseUrl = '/api/v1'

export default function consume (endpoint, method = 'get', data = {}) {
  const payLoadMethod = method.toLowerCase() === 'get' ? 'query' : 'send'
  const headers = {
    Accept: 'application/json'
  }

  return request[method](baseUrl + endpoint)
    .set(getAuthorizationHeader())
    .set(headers)[payLoadMethod](data)
    .then((res) => res)
    .catch((err) => {
      const errMessage = err.response?.body?.error?.title
      throw new Error(errMessage || err.message)
    })
}
