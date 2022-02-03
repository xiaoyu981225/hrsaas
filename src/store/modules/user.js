import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'
const state = {
  token: getToken(),
  userInfo: {} // 这里定义一个空对象
}
const mutations = {
  setToken(state, token) {
    state.token = token // 将数据设置给Vuex
    setToken(token) // 将数据同步给缓存
  },
  removeToken(state) {
    state.token = null
    removeToken()
  },
  setUserInfo(state, result) {
    // 更新一个对象
    state.userInfo = result
  },
  removeUserInfo(state) {
    state.userInfo = {}
  }
}
const actions = {
  async login(context, data) {
    // 调用API接口
    const result = await login(data)
    // axios默认加了一层data
    context.commit('setToken', result)
    setTimeStamp() // 设置时间戳
  },
  async getUserInfo(context) {
    const result = await getUserInfo()
    // 获取用户的详细数据
    const baseInfo = await getUserDetailById(result.userId)
    context.commit('setUserInfo', { ...result, ...baseInfo })
    return result // 伏笔
  },
  logOut(context) {
    context.commit('removeToken')
    context.commit('removeUserInfo')
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
