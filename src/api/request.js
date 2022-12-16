import request from '@/utils/request'

export function mysqlSimpleRequest() {
  return request({
    url: '/mysql/getGreaterMovie',
    method: 'get',
    params:{
      minScore: 4.5
    }
  })
}

export function sparkSimpleRequest() {
  return request({
    url: '/spark/getGreaterMovie',
    method: 'get',
    params:{
      minScore: 4.5
    }
  })
}

export function neo4jSimpleRequest() {
  return request({
    url: '/neo4j/getGreaterMovie',
    method: 'get',
    params:{
      minScore: 4.5
    }
  })
}

