// 导出员工的路由规则
import Layout from '@/layout'
export default {
  path: '/permission',
  name: 'permission',
  component: Layout,
  children: [{
    path: '',
    component: () => import('@/views/permission'),
    meta: {
      title: '权限管理'
    }
  }]
}