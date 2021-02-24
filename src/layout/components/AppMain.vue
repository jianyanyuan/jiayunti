<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <router-view :key="key" />
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    key() {
      return this.$route.path
    }
  },
  created() {
    const addressAsync = this.$store.dispatch('common/getAddress')
    const deviceAsync = this.$store.dispatch('common/getDevice')
    const designAsync = this.$store.dispatch('common/getDesign')
    const constructionAsync = this.$store.dispatch('common/getConstruction')
    const supervisionAsync = this.$store.dispatch('common/getSupervision')

    Promise.all([addressAsync, constructionAsync, deviceAsync, designAsync, supervisionAsync])
      .catch(() => {
        this.$message.error('信息获取失败')
      })
  }
}
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}
.fixed-header + .app-main {
  padding-top: 50px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
