import Router from 'vue-router'
import Vue from 'vue'
import Home from '@/pages/home/index'

Vue.use(Router)
const router = new Router({
    mode: 'hash',
    routes:[
        {
            path:'/',
            component:Home
        }
    ]
})

export default router
