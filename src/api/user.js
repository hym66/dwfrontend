import request from '@/utils/request'

export function login(data) {

  return request({
    url: '/api/user/login',
    method: 'post',
    data
  })
}

export function forget(data){
  return request({
      url:'/api/user/forget',
      method:'post',
      data
  })
}
export function reset(data){
  return request({
    url:'/api/user/forget',
    method:'put',
    data
  })
}

export function register(data) {
  return request({
    url: '/api/user/register',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/api/user',
    method: 'put',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/api/user',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/api/user/logout',
    method: 'get'
  })
}
