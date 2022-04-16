import request from '@/utils/request'

export function sensorList(query) {
  return request({
    url: '/vue-element-admin/sensor/list',
    method: 'get',
    params: query
  })
}

export function sensorGroupList(query) {
  return request({
    url: '/vue-element-admin/sensor/grouplist',
    method: 'get',
    params: query
  })
}
