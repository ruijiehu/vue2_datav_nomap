import axios from 'axios'
import qs from 'qs'
import {
  getLogin
} from '@/common/util'
axios.defaults.withCredentials = true
const baseURL =  `http://${window.document.location.host}`
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8' // 配置请求头
// POST传参序列化(添加请求拦截器)
axios.interceptors.request.use((config) => {
  if (config.method === 'post' && config.needsQs !== 2) {
    config.data = qs.stringify(config.data)
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

// 返回状态判断（添加响应拦截器）
axios.interceptors.response.use((res) => {
  if (res.data) {
    switch (res.data.status) {
      case 401:
        getLogin()
        break
      case 404:
      case 400:
      case 500:
        break
      default:
    }
  }
  return res
}, (error) => {
  return Promise.reject(error)
})

function post (url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, params).then(response => {
      resolve(response.data)
    }, err => {
      reject(err)
    }).catch((error) => {
      reject(error)
    })
  })
}

// json参数上传
function postJson (url, params) {
  return new Promise((resolve, reject) => {
    axios({
      url: url,
      method: 'post',
      baseURL: baseURL,
      data: params,
      withCredentials: true,
      headers: {
        'Content-type': 'application/json;charset=UTF-8'
      },
      needsQs: 2
    }).then(response => {
      resolve(response.data)
    }, err => {
      reject(err)
    }).catch((error) => {
      reject(error)
    })
  })
}

function get (url, params) {
  function getParams (obj) {
    const ary = []
    for (const p in obj) {
      // eslint-disable-next-line no-prototype-builtins
      if (obj.hasOwnProperty(p) && (obj[p] || obj[p] === 0)) {
        ary.push(p + '=' + (obj[p]))
      }
    }
    return ary.join('&')
  }
  const paramFilter = filterParam(params)
  let urlFilter
  if (paramFilter && Object.keys(paramFilter).length !== 0) {
    if (url.indexOf('?') === -1) {
      urlFilter = url + '?' + getParams(paramFilter)
    } else {
      urlFilter = url + '&' + getParams(paramFilter)
    }
  } else {
    urlFilter = url
  }
  return new Promise((resolve, reject) => {
    axios.get(urlFilter).then(response => {
      resolve(response.data)
    }, err => {
      reject(err)
    }).catch(error => {
      reject(error)
    })
  })
}
// del参数上传
// eslint-disable-next-line
function delJson(url, params) {
  return new Promise((resolve, reject) => {
    axios({
      url: url,
      method: 'delete',
      baseURL: baseURL,
      data: params,
      withCredentials: true,
      headers: {
        'Content-type': 'application/json;charset=UTF-8'
      },
      needsQs: 2
    }).then(response => {
      resolve(response.data)
    }, err => {
      reject(err)
    }).catch((error) => {
      reject(error)
    })
  })
}
// 过滤参数
function filterParam (params) {
  if (params) {
    const paramsCopy = JSON.parse(JSON.stringify(params))
    for (var i in paramsCopy) {
      if (!paramsCopy[i] && paramsCopy[i] !== 0) {
        delete paramsCopy[i]
      }
    }
    return paramsCopy
  } else {
    return Object.create(null)
  }
}

// 删除方法
function del (url, params) {
  return new Promise((resolve, reject) => {
    axios.delete(url, {
      data: filterParam(params)
    }).then(response => {
      resolve(response.data)
    },
    err => {
      reject(err)
    })
      .catch((error) => {
        reject(error)
      })
  })
}

// 新增方法
function put (url, params) {
  return new Promise((resolve, reject) => {
    axios.put(url, params).then(response => {
      resolve(response.data)
    }, err => {
      reject(err)
    }).catch((error) => {
      reject(error)
    })
  })
}

// 导出
function exportFile (url, method, params) {
  return new Promise((resolve, reject) => {
    axios({
      url: url,
      method: method,
      baseURL: baseURL,
      data: filterParam(params),
      params: filterParam(params),
      responseType: 'arraybuffer'
    }).then(response => {
      resolve(response)
    }, err => {
      reject(err)
    }).catch((error) => {
      reject(error)
    })
  })
}
// 上传附件
function uploadFile (url, formData) {
  return axios.post(url, formData)
}
// 请求通用方法
function request (methods, url, params = {}) {
  const targetMethods = [
    'get', 'post', 'postJson', 'put', 'delJson', 'getDetail'
  ]
  if (targetMethods.includes(methods)) {
    if (methods === 'delJson' || methods === 'getDetail') {
      url += `/${params}`
    }
    // eslint-disable-next-line no-eval
    const fn = eval(methods)
    return fn(url, params)
  } else {
    throw new Error('方法名不存在')
  }
}
export {post,postJson,get,uploadFile,request,del,put,delJson,exportFile}