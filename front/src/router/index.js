import Vue from 'vue'
import Router from 'vue-router'
import following from '@/components/Header/tags/following.vue'
import home_tag from '@/components/Header/home_tag.vue'
import recommended from '@/components/Header/tags/recommended.vue'
import backend from '@/components/Header/tags/backend.vue'
import ai from '@/components/Header/tags/ai.vue'
import android from '@/components/Header/tags/android.vue'
import article from '@/components/Header/tags/article.vue'
import career from '@/components/Header/tags/career.vue'
import freebie from '@/components/Header/tags/freebie.vue'
import frontend from '@/components/Header/tags/frontend.vue'
import ios from '@/components/Header/tags/ios.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home_tag',
      component: home_tag
    },
    {
      path: '/following',
      name: 'following',
      component: following
    },
    {
      path: '/recommended',
      name: 'recommended',
      component: recommended
    },
    {
      path : '/backend',
      name : 'backend',
      component : backend
    },
    {
      path : '/ai',
      name : 'ai',
      component : ai
    },
    {
      path : '/android',
      name : 'android',
      component : android
    },
    {
      path : '/article',
      name : 'article',
      component : article
    },
    {
      path : '/career',
      name : 'career',
      component : career
    },
    {
      path : '/freebie',
      name : 'freebie',
      component : freebie
    },
    {
      path : '/frontend',
      name : 'frontend',
      component : frontend
    },
    {
      path : '/ios',
      name : 'ios',
      component : ios
    }
  ]
})
