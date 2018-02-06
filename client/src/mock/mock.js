import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import baseUrl from '@/api/base'
import mockData from './menu'

export default {
  /**
   * mock bootstrap
   */
  bootstrap () {
    let mock = new MockAdapter(axios)

    // mock success request
    mock.onGet('/success').reply(200, {
      msg: 'success'
    })

    // mock error request
    mock.onGet('/error').reply(500, {
      msg: 'failure'
    })

    // 模拟权限
    mock.onGet(`${baseUrl}/meta`).reply(() => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, mockData])
        }, 2000)
      })
    })
  }
}
