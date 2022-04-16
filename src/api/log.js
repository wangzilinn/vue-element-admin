import request from '@/utils/request'

export function fetchLog(query) {
  return request({
    url: '/vue-element-admin/log/list',
    method: 'get',
    params: query
  })
}
