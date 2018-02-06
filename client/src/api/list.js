import axios from 'axios'
import baseUrl from './base'

const userList = {
  // 获取用户列表
  getUsers: params => {
    return axios({
      method: 'get',
      url: `${baseUrl}/users`,
      params: params
    }).then(res => {
      return res
    }).catch(err => {
      console.log('请求失败: ', err)
      return err
    })
  },
  // 获取用户单个用户
  getUser: params => {
    return axios({
      method: 'get',
      url: `${baseUrl}/user/${params}`
    }).then(res => {
      return res
    }).catch(err => {
      console.log('请求失败: ', err)
      return err
    })
  },
  // 删除单个用户
  removeUser: params => {
    return axios.delete(`${baseUrl}/user/${params}`).then(res => {
      return res
    }).catch(err => {
      console.log('请求失败: ', err)
      return err
    })
  },
  // 修改单个用户
  editUser: params => {
    return axios.put(`${baseUrl}/user/${params.id}`, params).then(res => {
      return res
    }).catch(err => {
      console.log('请求失败: ', err)
      return err
    })
  },
  // 添加单个用户
  addUser: params => {
    return axios.post(`${baseUrl}/user`, params).then(res => {
      return res
    }).catch(err => {
      console.log('请求失败: ', err)
      return err
    })
  },
  // 批量删除用户
  batchRemoveUser: params => {
    return axios.post(`${baseUrl}/user/batch`, params).then(res => {
      return res
    }).catch(err => {
      console.log('请求失败: ', err)
      return err
    })
  }
}

export default userList
