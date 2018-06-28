import { loading, toast } from './wx'
import host from '../host'

export default function (params) {
  const {
    url,
    data = {},
    method = 'GET',
  } = params

  loading.call(data.page)

  Object.keys(data).forEach((key) => {
    if (data[key] === null || data[key] === undefined) {
      delete data[key]
    }
  })

  return new Promise((resolve) => {
    wx.request({
      url: `${host}/wp-json/wp/v2${url}`,
      data,
      method,
      success(data) {
        loading(false)

        if (data.data) {
          return resolve(data)
        }
        return toast('请求数据错误')
      }
    })
  })
}
