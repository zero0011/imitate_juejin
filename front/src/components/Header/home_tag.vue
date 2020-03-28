<template>
   <!-- 头部标签 -->
    <div id="header_tag">
      <div class="header_tag_left"></div>
      <div class="header_tag_middle">
        <!-- 标签 -->
        <HeaderTag/>
      </div>
      <div class="header_tag_right"></div>
    </div>
</template>

<script>
import HeaderTag from  "@/components/Header/header_tag.vue"
export default {
    name : 'home',
    components: {
      // Headericon,
      HeaderTag //注册组件
  },
}
</script>

<style>
#header_tag{
    z-index: 100;
    height: 2.833rem;
    -webkit-box-shadow: 0 1px 2px 0 rgba(0,0,0,.05);
    box-shadow: 1px 1px 2px 0 rgba(0,0,0,0.15);
    background-color: #fff;
}
.header_tag_middle {
    z-index: 100;
    height: 2.833rem;
}
</style>