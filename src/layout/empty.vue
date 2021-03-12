<template>
  <div>
    <transition name="fade-transform" mode="out-in">
      <router-view :key="key" />
    </transition>
  </div>
</template>

<script>

export default {
  name: 'Empty',
  computed: {
    key() {
      return this.$route.path
    }
  },
  methods: {

  }
}
</script>
