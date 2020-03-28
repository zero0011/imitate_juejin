<template>
  <!-- 内容 -->
  <main id="timeline-container">
    <div class="timeline-content">
      <div class="timeline-entry-list">
        <div class="entry-list-container">
          <!-- 内容标签 -->
          <header class="list-header">
            <nav class="list-nav">
              <ul class="nav-list left">
                <li v-for="(item ) in items" :key="item.id" :class="item.class">
                  <router-link :to="item.url">{{item.name}}</router-link>
                </li>
              </ul>
              <div class="dorp-down-area"></div>
            </nav>
          </header>
          <!-- 主要内容 -->
          <ul class="entry-list">
            <li v-for="(content , index) in contents" class="item-title" :key="index">
              <div class="entry-box">
                <div class="entry">
                  <a :href="content.href" class="entry-link" target="_blank">
                    <div class="content-box">
                      <!-- 左边内容 -->
                      <div class="info-box">
                        <div class="info-row meta-row">
                          <!-- 标题 -->
                          <ul class="meta-list">
                            <li class="item post">{{content.post}}</li>
                            <li class="item username clickable">
                              <div class="user-popover-box">
                                <a href>{{content.author}}</a>
                              </div>
                            </li>
                            <li class="item">{{content.time}}</li>
                            <li class="item tag">
                              <a href="/tag" class="tag">前端</a>
                            </li>
                          </ul>
                        </div>
                        <div class="info-rwo title-row">
                          <a href="/post" class="title">{{content.title}}</a>
                        </div>
                        <div class="info-row action-row">
                          <ul class="action-list" >
                            <li v-for="tag in content.tags" :key="tag.id" :class="tag.class" class="item">
                              <a class="title-box" href="/">
                                <img :src="tag.src" />
                                <span class="count">{{tag.count}}</span>
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <aside class="index-aside aside"></aside>
    </div>
  </main>
</template>

<script>
export default {
  name: "main",
  data() {
    return {
      items: [
        {
          id : 1,
          class: "nav-item active_nav",
          url: "/recommended?sort=popular",
          name: "热门"
        },
        {
          id : 2,
          class: "nav-item",
          url: "/recommended?sort=newest",
          name: "最新"
        },
        {
          id : 3,
          class: "nav-item",
          url: "/recommended?sort=three_days_hottest",
          name: "热榜"
        }
      ],
      // 主要内容
      contents: [
        {
          href: "",
          post: "专栏",
          author: "掘金酱",
          time: "12小时前",
          title: "写给作者的",
          tags: [
            {
              id : 1,
              class: "like",
              src: "https://b-gold-cdn.xitu.io/v3/static/img/zan.e9d7698.svg",
              count: 18
            },
            {
              id : 2,
              class: "comment",
              src:
                "https://b-gold-cdn.xitu.io/v3/static/img/comment.4d5744f.svg",
              count: 1
            },
            {
              id : 3,
              class: "share",
              src: "https://b-gold-cdn.xitu.io/v3/static/img/share.1d55e69.svg",
              count: ""
            }
          ]
        }
      ],
    };
  }
};
</script>

<style>
#timeline-container {
  margin: 0 auto;
  width: 100%;
  max-width: 950px;
  margin-top: 1.1rem;
  background-color: #fff;
}
.timeline-content {
  position: relative;
  margin-top: 0.33rem;
}
.timeline-entry-list {
  margin-right: 21.667rem;
  border-radius: 2px;
  width: 700px;
}
.aside {
  position: absolute;
  top: 0;
  right: 0;
}
.entry-list-container {
  background-color: #fff;
}
.list-header {
  padding: 0.7rem 0.5rem;
  border-bottom: 1px solid hsla(0, 0%, 59.2%, 0.1);
}
.list-nav {
  display: flex;
  justify-content: flex-start;
}
.nav-list {
  display: flex;
  align-items: center;
  line-height: 1;
}
.nav-item {
  font-size: 0.9rem;
  padding: 0 0.8rem;
  border-right: 1px solid hsla(0, 0%, 59.2%, 0.2);
  position: relative;
  cursor: pointer;
  list-style: none;
}
.nav-list :last-child {
  border-right: none;
}
.nav-item a {
  color: #909090;
}
.nav-item a:hover {
  color: #007fff;
}
.nav-item > a::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.active_nav a {
  color: #007fff;
}
.entry-list {
  width: 100%;
  background-color: #fff;
}
.entry-list .item-title:not(:last-child) {
  border-bottom: 1px solid rgba(178, 186, 194, 0.15);
}
.item-title {
  list-style: none;
}
.item-title a {
  color: inherit;
  text-decoration: none;
  cursor: pointer;
  color: inherit;
}
.content-box {
  display: flex;
  align-items: center;
  padding: 1.2rem 1.8rem;
}
.info-box {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
}
.info-box .meta-row {
  font-size: 0.8rem;
  color: #b2bac2;
}
.info-box .title-row {
  margin: 0.5rem 0 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.thumb {
  flex: 0 0 auto;
  width: 5rem;
  height: 5rem;
  margin-left: 2rem;
  background-color: #fff;
  border-radius: 2px;
  background-position: 50%;
  background-size: cover;
  background-repeat: no-repeat;
}
.lazy {
  position: relative;
  transition: opacity 2s;
}
.lazy::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: inherit;
  border-radius: inherit;
}
.loaded::before {
  opacity: 0;
  pointer-events: none;
}
.meta-list {
  display: flex;
  align-items: baseline;
  white-space: nowrap;
  list-style: none;
}
.meta-list .post {
  font-weight: 500;
  color: #b71ed7;
}
.meta-list .username {
  display: flex;
  align-items: baseline;
}
.meta-list .username .user-popover-box {
  display: inline;
}
.meta-list .username .user-popover-box a {
  color: #909090;
}
.meta-list .item:not(:last-child)::after {
  content: "·";
  color: rgb(178, 186, 194);
  margin: 0px 0.4em;
}
.title-row {
  margin: 0.5rem 0 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.title:visited {
  color: #909090;
}
.title {
  font-size: 1.1rem;
  color: #909090;
  font-weight: 600;
  line-height: 1.2;
  color: #2e3135;
}
.action-list {
  display: inline-flex;
  white-space: nowrap;
  list-style: none;
}
.action-list > .item {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 0 0.6rem;
  height: 1.4rem;
  font-size: 0.8rem;
  line-height: 1;
  white-space: nowrap;
  color: #b2bac2;
  border-radius: 1px;
  border: 1px solid #edeeef;
  width: 2rem;
}
.action-list > .item .title-box {
  display: flex;
  align-items: center;
  padding: 0 0.8rem;
  height: 100%;
}
.action-list > .item .title-box img {
  width: 1.2rem;
  height: 1.2rem;
}
.action-list > .item .count {
  color: #b2bac2;
  margin-left: 0.2em;
  font-weight: 700;
}
</style>