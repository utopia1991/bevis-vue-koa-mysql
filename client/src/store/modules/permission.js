import { getMeta } from '@/api/index'

const permission = {
  // 数据
  state: {
    routers: [],
    auths: [],
    username: ''
  },
  // 定义方法名
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.routers = routers
    },
    SET_AUTHS: (state, auths) => {
      state.auths = auths
    },
    SET_USERNAME: (state, username) => {
      state.username = username
    }
  },
  // 执行方法
  actions: {
    GenerateRouters ({ commit }) {
      return new Promise((resolve, reject) => {
        getMeta().then(res => {
          const data = res.data
          commit('SET_ROUTERS', data.value.menu)
          commit('SET_AUTHS', data.value.authUrl)
          commit('SET_USERNAME', data.value.displayName || 'Admin')
          resolve(res)
        }).catch((err) => {
          reject(err)
        })
      })
    }
  },
  // 取值
  getters: {
    permission_routers: state => state.routers,
    auth_routers: state => state.auths,
    user_name: state => state.username
  }
}

export default permission
