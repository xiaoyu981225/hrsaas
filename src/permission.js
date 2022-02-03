// 权限拦截在路由跳转 导航守卫
import router from '@/router'
import store from '@/store'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
// 不需要导出，代码执行即可
// 前置守卫
// next() 放过
// next(false) 跳转终止
// next(地址) 跳转到某个地址
const whiteList = ['/login', '/404']
router.beforeEach(async(to, from, next) => {
  nprogress.start()
  if (store.getters.token) {
    // 如果有token
    if (to.path === '/login') {
      next('/') // 跳转到主页
    } else {
      if (!store.getters.userId) {
        await store.dispatch('user/getUserInfo')
      }
      next()
    }
  } else {
    // 如果没有token
    if (whiteList.indexOf(to.path) > -1) {
      // 表示要去的地址在白名单
      next()
    } else {
      next('./login')
    }
  }
  nprogress.done()
})
// 后置守卫
router.afterEach(() => {
  nprogress.done()
})
