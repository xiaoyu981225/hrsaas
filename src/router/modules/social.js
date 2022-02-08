// 导出员工的路由规则
import Layout from '@/layout'
export default {
  path: '/social',
  name: 'social',
  component: Layout,
  children: [{
    path: '',
    component: () => import('@/views/social'),
    meta: {
      title: '社保',
      icon: 'table'
    }
  }]
}
