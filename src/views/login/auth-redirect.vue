<!--
 * @Author: zfd
 * @Date: 2020-10-16 10:27:10
 * @LastEditors: zfd
 * @LastEditTime: 2020-10-16 14:34:39
 * @Description:
-->
<script>
export default {
  name: 'AuthRedirect',
  created() {
    const hash = window.location.search.slice(1)
    if (window.localStorage) {
      window.localStorage.setItem('x-admin-oauth-code', hash)
      window.close()
    }
  },
  render: function(h) {
    return h() // avoid warning message
  }
}
</script>
