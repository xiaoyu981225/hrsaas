import request from '@/utils/request'

// 获取组织架构的数据
export function getDepartments() {
  return request({
    url: '/company/department'
  })
}
// 删除组织架构的部门
export function delDepartments(id) {
  return request({
    method: 'delete', // 接口满足restful接口规范 同样的地址 不同的方法 执行不同的业务
    url: `/company/department/${id}`
  })
}
// 新建组织架构的部门
export function addDepartments(data) {
  return request({
    method: 'post',
    url: '/company/department',
    data
  })
}
