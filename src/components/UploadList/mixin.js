/*
 * @Author: zfd
 * @Date: 2020-12-10 14:17:29
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-10 14:17:29
 * @Description: 
 */
import Pdf from 'vue-pdf'
import html2canvas from 'html2canvas'
import printJS from 'print-js'
export default {
  components: {
    Pdf
  },
  data() {
    return {
      // 修改后重新保存
      pdfVisible: false,
      pdfURL: '', // Pdf路径
      pdfPages: undefined, // pdf内容
      imgVisible: false,
      detailImgUrl: '',
    }
  },
  methods:{
    // 展示文件
    detailFile(file) {
      if (/\bpdf/i.test(file.name)) {
        // 展示pdf
        this.pdfURL = Pdf.createLoadingTask('/teat.pdf')
        this.pdfURL.promise.then(pdf => {
          this.pdfPages = pdf.numPages
          this.pdfVisible = true
        }).catch(() => {
          this.$message.error('pdf预览失败')
        })
      } else {
        this.detailImgUrl = file.url
        this.imgVisible = true
      }
    },
    // 打印pdf
    printPDF(refName) {
      html2canvas(this.$refs[refName], {
        backgroundColor: null,
        useCORS: true,
        windowHeight: document.body.scrollHeight
      }).then((canvas) => {
        const url = canvas.toDataURL()
        printJS({
          printable: url,
          type: 'image',
          documentTitle: this.printName
        })
        // console.log(url)
      })
    }
  }
}