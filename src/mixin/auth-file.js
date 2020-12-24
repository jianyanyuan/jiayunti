/*
 * @Author: zfd
 * @Date: 2020-12-23 09:57:08
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-23 10:20:36
 * @Description: 
 */
export default {
  created() {
    Object.defineProperty(Image.prototype, 'authsrc', {
      writable: true,
      enumerable: true,
      configurable: true
    })
  },
  mounted() {
    let imgs = document.getElementsByTagName('img');
    imgs.forEach((img) => {
      let authsrc = img.getAttribute('authsrc');
      // blob开头的为本地文件
      if (authsrc && !/^blob/.test(authsrc)) {
        let request = new XMLHttpRequest();
        request.responseType = 'blob';
        request.open('get', authsrc, true);
        request.setRequestHeader('Authorization', this.$store.state.user.token);
        request.onreadystatechange = e => {
          if (request.readyState == XMLHttpRequest.DONE && request.status == 200) {
            img.src = URL.createObjectURL(request.response);
            img.onload = () => {
              URL.revokeObjectURL(img.src);
            }
          }
        };
        request.send(null);
      }

    })

  },
}