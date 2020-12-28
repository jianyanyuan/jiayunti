<!--
 * @Author: zfd
 * @Date: 2020-10-16 16:35:29
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-28 12:05:41
 * @Description:
-->
<script>
export default {
  created() {
    const { params, query } = this.$route
    const { path } = params
    // + path, query
    this.$router.replace({ path: '/' })
  },
  render: function(h) {
    return h() // avoid warning message
  }
}
</script>
