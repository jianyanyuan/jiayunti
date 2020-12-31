<!--
 * @Author: zfd
 * @Date: 2020-10-16 16:35:29
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-31 11:26:08
 * @Description:
-->
<script>
export default {
  created() {
    // + path, query
    this.$router.replace({ path: '/' })
  },
  render: function(h) {
    return h() // avoid warning message
  }
}
</script>
