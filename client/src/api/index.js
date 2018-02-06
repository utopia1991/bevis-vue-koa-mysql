import axios from 'axios'
import baseUrl from './base'

// 获取菜单权限和用户信息
export const getMeta = () => {
  return axios.get(`${baseUrl}/meta`).then(res => {
    return res
  }).catch(err => {
    console.log('请求失败: ', err)
    return err
  })
}
