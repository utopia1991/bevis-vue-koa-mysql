import axios from 'axios'
import baseUrl from './base'

const downloadList = {
  // 获取用户列表
  getDownloadList: params => {
    return axios.get(`${baseUrl}/user/downloadFileList`, {
      params: params
    })
  }
}

export default downloadList
