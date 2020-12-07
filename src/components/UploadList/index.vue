<!--
 * @Author: zfd
 * @Date: 2020-12-07 10:57:23
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-07 13:48:18
 * @Description: 
-->
<template>
  <transition-group
    tag="ul"
    :class="[
      'el-upload-list',
      'el-upload-list--' + listType,
      { 'is-disabled': disabled }
    ]"
    name="el-list"
  >
    <li
      v-for="file in files"
      :class="['el-upload-list__item', 'is-' + file.status, focusing ? 'focusing' : '']"
      :key="file.uid"
      tabindex="0"
      @keydown.delete="!disabled && $emit('remove', file)"
      @focus="focusing = true"
      @blur="focusing = false"
      @click="focusing = false"
    >
      <slot :file="file">
        <img
          class="el-upload-list__item-thumbnail"
          v-if="file.status !== 'uploading' && ['picture-card', 'picture'].indexOf(listType) > -1"
          :src="handleURL(file)" alt="" 
        >
        
        <a class="el-upload-list__item-name" @click="handleClick(file)">
          <i class="el-icon-document"></i>{{file.name}}
        </a>
        <label class="el-upload-list__item-status-label">
          <i :class="{
            'el-icon-upload-success': true,
            'el-icon-circle-check': listType === 'text',
            'el-icon-check': ['picture-card', 'picture'].indexOf(listType) > -1
          }"></i>
        </label>
        <i class="el-icon-close" v-if="!disabled" @click="$emit('remove', file)"></i>
        <i class="el-icon-close-tip" v-if="!disabled">{{ t('el.upload.deleteTip') }}</i> <!--因为close按钮只在li:focus的时候 display, li blur后就不存在了，所以键盘导航时永远无法 focus到 close按钮上-->
        <span class="el-upload-list__item-actions" v-if="listType === 'picture-card'">
          <span
            class="el-upload-list__item-preview"
            v-if="handlePreview && listType === 'picture-card'"
            @click="handlePreview(file)"
          >
            <i class="el-icon-zoom-in"></i>
          </span>
          <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="$emit('remove', file)"
          >
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </slot>
    </li>
  </transition-group>
</template>
<script>

  export default {

    name: 'UploadList',


    data() {
      return {
        focusing: false,
        pdfURL: require('@/assets/images/pdf.jpg'),
        errorURL:require('@/assets/images/error.jpg'),
        loadingURL: require('@/assets/images/loading.gif')
      };
    },

    props: {
      files: {
        type: Array,
        default() {
          return [];
        }
      },
      disabled: {
        type: Boolean,
        default: false
      },
      handlePreview: Function,
      listType: String
    },
    methods: {
      handleClick(file) {
        this.handlePreview && this.handlePreview(file);
      },
      handleURL(file) {
        return /\bpdf/i.test(file.name) ? this.pdfURL:file.url
      }
      // handleError($event,file) {
      //   console.log($event)
      //   file.url = this.errorURL
      // },
      // handleLoading(file) {
      //   file.url = this.loadingURL
      // }
    }
  };
</script>
