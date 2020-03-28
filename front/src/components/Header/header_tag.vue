<template>
  <ul class="header_tag_ul">
    <li class="header_tag_li">
      <router-link to="/recommended" class="active">推荐</router-link>
    </li>
    <li v-for="item in items" :key="item" class="header_tag_li active">
      <router-link :to="item.router">{{item.name}}</router-link>
    </li>
  </ul>
</template>

<script>
export default {
  name: "header_tag",
  data() {
    return {
      items: [
        {
          name: "关注",
          router: "following"
        },
        {
          name : '后端',
          router : 'backend'
        },
        {
            name : '前端',
            router : 'frontend'
        },
        {
            name : 'Android',
            router : 'android'
        },
        {   
            name : 'IOS',
            router : 'ios'
        },
        {
            name : '人工智能',
            router : 'ai'
        },
        {
            name : '开发工具',
            router : 'freebie'
        },
        {
            name : '代码人生',
            router : 'career'
        },
        {
            name : '阅读',
            router : 'article'
        },
        {
            name : '标签管理',
            router : ''
        }
      ]
    };
  },
  methods : {

  }
};
</script>

<style>
.header_tag_ul {
  list-style: none;
  /* flex布局 */
  display: flex;
  flex-direction: row;
  width: 100%;
  max-width: 960px;
  height: 100%;
  margin: auto;
  display: flex;
  align-items: center;
  line-height: 1;
}
.header_tag_li {
  list-style: none;
  height: 100%;
  align-items: center;
  display: flex;
  flex-shrink: 0;
  font-size: 0.85rem;
  color: #71777c;
  padding: 0 1rem;
  position: relative;
  cursor: pointer;
  text-decoration: none;
}
.header_tag_li :hover {
  color: #007fff;
}
.header_tag_li a {
    text-decoration: none;
    cursor: pointer;
    color: #71777c;
}
.header_tag_li:last-child {
    list-style: none;
    height: 100%;
    align-items: center;
    display: flex;
    flex-shrink: 0;
    font-size: 0.85rem;
    color: #71777c;
    padding: 0 1rem;
    position: relative;
    cursor: pointer;
    text-decoration: none;
    margin-left: 13rem;
}
/* 跟随点击事件 */
.active {
  color: #007fff !important;
}
</style>