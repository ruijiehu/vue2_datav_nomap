import axios from 'axios'
let resdata = ''
// 跳转到登录页面
function goLogin (region) {
    // 退出登录时获取region
    if (region) {
      resdata = region
    }
    // eslint-disable-next-line
    let path = window.location.origin+window.location.pathname
    // eslint-disable-next-line
    let h = new Buffer(path)
    const h64 = h.toString('base64')
    window.location.href = '/apollo/login?service=' + h64 + '&page=4&region=' + resdata
  }
  
  // 获取登录的token
  function getLogin (resdt) {
    resdata = resdt.data.region
    axios.get('/apollo/token')
      .then(res => {
        if (res.data.data.isLogin) {
          const token = res.data.data.token
          checkToken(token)
        } else {
          goLogin()
        }
      })
  }
  
  // 检查token是否合法
  function checkToken (token) {
    axios.post('/society/olap/sso/checktoken?token=' + token)
      .then(res => {
        if (res.data.status === 200 && res.data.success) {
          axios.get('/society/olap/userinfo')
            .then(response => {
              if (!response.data || !response.data.data.userId) {
                goLogin()
              } else {
                window.vm.$bus.emit('getUserInfo')
              }
            })
            .catch((error) => {
              console.log(error)
            })
        }
      })
      .catch((error) => {
        console.log(error)
        goLogin()
      })
  }
export {getLogin}