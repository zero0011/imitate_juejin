<template>
    <div>
        <HomeTag/>
        <Main/>
    </div>
</template>

<script>
import Main from "@/components/main/main.vue";
import home_tag from "@/components/Header/home_tag.vue";
export default {
    name : 'ios',
    components: {
    HomeTag: home_tag,
    Main
  }
}
</script>

<style>

</style>