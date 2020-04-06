<template>
  <div class="markdown-editor">
    <header class="header editor-header">
      <div class="left-box"></div>
      <!-- 文章标题 -->
      <input placeholder="输入文章标签" spellcheck="false" maxlength="80" class="title-input title-input" v-model="title"/>
      <!-- 右边图片 -->
      <div class="right-box">
        <div class="main-image-selector with-padding">
          <!-- 上传图片 -->
          <div class="toggle-btn">
            <input type="file" class="file toggle-btn" @change="handleFileChange" />
          </div>
        </div>
        <span class="upload-pic">上传封面图片</span>
      </div>
    </header>
    <div class="main">
      <!-- @save : 按下 ctrl + s 时触发 -->
      <!-- @change : 当值发生改变时 触发 -->
      <mavon-editor ref="editor" v-model="doc" @save="saveDoc"></mavon-editor>
    </div>
  </div>
</template>

<script>
// 图片文件 切片大小
const SIZE = 5 * 1024; // 5kb
// 文本 切片大小
const html_size = 100; // 每个切片有 50个字符串
// 函数调用次数
const function_calls = 1;
import { mavonEditor } from "mavon-editor";
import "mavon-editor/dist/css/index.css";
export default {
  name: "markdown",
  components: {
    mavonEditor
  },
  data() {
    return {
      doc: "", // 输入的markdown text
      html: "", // 输入的 markdown html
      photo_file: null, // 封面图片
      data: [], // 图片 blob 数组
      html_data: [], // 文本 切片 数组
      html_text_md5: "", // 文本内容的 md5 摘要
      title : ''
    };
  },
  methods: {
    // 保存时的回调函数
     saveDoc(markdown, html, function_calls) {
      // 先编码 , 再把 html 发送到后端
      const html_new = this.encodeHtml(html);

      // html 内容为 空 , 或者不变 , 则不发送
      if (html_new.length === 0) return;
      // 把 photo_file 和 html 同时发送给后端

      // mark_data
      if (this.photo_file) {
        // 存在封面图

        // 发送 html 字符串
        // 字符串切片后
        this.html_data = this.createTextChunks(html_size, html_new);
        //并发发送给后端
         this.uploadTextChunks(this.html_data);
        // 发送合并文本请求
         this.mergerTextRequest();

        // 发送图片
        if (!this.photo_file) return;
         const fileChunkList =  this.createFileChunks(this.photo_file);
        this.data = fileChunkList.map(({ file }, index) => ({
          chunk: file,
          hash: this.photo_file.name + "-" + index // 文件名 + 数组下标
        }));
         this.uploadChunks();
      } else {
        // 发送字符串
        // console.log(html);
        // 字符串切片后 , 并发 发送给后端
        this.html_data = this.createTextChunks(html_size, html_new);
        // console.log(this.html_data);
         this.uploadTextChunks(this.html_data);
        // 发送合并文本请求
         this.mergerTextRequest()
      }

      // 递归调用
      //通过 md5 查看, 文本与 图片是否传输完毕  , 没有的
      if (function_calls) {
        function_calls--;
        this.saveDoc(markdown, html, function_calls);
      }
    },
    // 为了防止 存储型 XSS 攻击 , 设计编码函数
    // HTML 编码
    encodeHtml(str) {
      return str
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    },

    // HTML解码
    decodeHtml(str) {
      return str
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">");
    },

    // 封面图片 change 回调函数
    handleFileChange(e) {
      const [file] = e.target.files;
      if (!file) return;
      this.photo_file = file;
    },
    // 生成文件切片
    async createFileChunks(file, size = SIZE) {
      const fileChunkList = [];
      let cur = 0;
      while (cur < file.size) {
        fileChunkList.push({
          file: file.slice(cur, cur + size)
        });
        cur += size;
      }
      return fileChunkList;
    },
    // 上传切片
    async uploadChunks() {
      const requestList = this.data
        .map(({ chunk, hash }) => {
          const formData = new FormData();
          formData.append("chunk", chunk);
          formData.append("hash", hash);
          formData.append("filename", this.photo_file.name);
          return { formData };
        })
        .map(async ({ formData }) => {
          this.request({
            url: "/markdown_image",
            data: formData
          });
        });
      await Promise.all(requestList);
      // 合并请求
      await this.mergerRequest();
    },
    // 合并请求
    async mergerRequest() {
      const data = {
        filename: this.photo_file.name,
        size: SIZE
      };
      await this.$ajax.request({
        url: "/merge_image", //合并接口
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: data,
        method: "POST"
      });
    },
    // 请求方式
    request({ url, method = "POST", data, headers = {}, requestList }) {
      return new Promise(resolve => {
        const xhr = new XMLHttpRequest();
        url = "http://localhost:3000" + url;
        xhr.open(method, url);
        Object.keys(headers).forEach(key =>
          xhr.setRequestHeader(key, headers[key])
        );
        xhr.send(data);
        xhr.onload = e => {
          resolve({
            data: e.target.response
          });
        };
      });
    },
    // 生成文本切片
    createTextChunks(html_size, html) {
      const html_data = [];
      let cur = 0;
      while (cur < html.length) {
        html_data.push({
          chunk: html.slice(cur, cur + html_size)
        });
        cur += html_size;
      }
      return html_data;
    },
    // 并发发送 文本切片
    async uploadTextChunks(html_data) {
      let requestTextList = html_data.map((text, index) => {
        let data = {
          text: text.chunk,
          hash: index
        };
        // 并发发送
        return this.$ajax
          .request({
            url: "/markdown",
            method: "POST",
            data: data,
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          })
          .then(res => {
            res = JSON.parse(res);
            
          });
      });
      await Promise.all(requestTextList);
    },
    // 文本合并请求
    async mergerTextRequest() {
      let data = {
        // 发送 文本切片数组长度
        length: this.html_data.length,
        // 文章 title
        title : this.title
      };
      await this.$ajax
        .request({
          url: "/merge_markdown",
          method: "POST",
          data: data,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          IswithCredentials: true
        })
        .then(res => {
          res = JSON.parse(res);
          if (res.code === 7) {
            // 文本存储完毕
            
            let content_data = res.return_data
            // console.log(content_data);
            // 把返回的数据 传递给 main.vue , 子组件与子组件通信 , vuex
            this.$store.commit('get_content_data',content_data)
            // 路由跳转
            this.$router.push('recommended');
          }
        });
    }
  }
};
</script>

<style>
.header {
  display: flex;
  align-items: center;
  position: fixed;
  top: 0%;
  left: 0;
  right: 0;
  bottom: 0%;
  padding: 0 1rem;
  height: 5rem;
  background-color: #fff;
  border-bottom: 1px solid #ddd;
  z-index: 100;
}
.title-input {
  margin: 0;
  padding: 0;
  font-size: 1.6rem;
  font-weight: 600;
  color: #000;
  border: none;
  outline: none;
}
.left-box {
  display: none;
}
.right-box {
  justify-content: flex-end;
}
.main-image-selector {
  position: absolute;
  right: 10rem;
  top: 1rem;
}
.with-padding {
  padding-left: 1.2rem;
  padding-right: 1.2rem;
}
.toggle-btn {
  width: 2.334rem;
  height: 2.334rem;
  background-position: 50%;
  background-repeat: no-repeat;
  background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjI4cHgiIGhlaWdodD0iMjhweCIgdmlld0JveD0iMCAwIDI4IDI4IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPCEtLSBHZW5lcmF0b3I6IHNrZXRjaHRvb2wgMy44LjMgKDI5ODAyKSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT42OTlFRDExRS03RjE2LTQwQTUtODlERC1DOUFERTMwQ0NCNEM8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIHNrZXRjaHRvb2wuPC9kZXNjPgogICAgPGRlZnM+PC9kZWZzPgogICAgPGcgaWQ9IjAuMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9Ik1hcmtkb3du77yN57yW6L6RMyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTEyNDcuMDAwMDAwLCAtMTguMDAwMDAwKSIgZmlsbD0iI0JGQzZDRSI+CiAgICAgICAgICAgIDxnIGlkPSJoZWRlcl9pbWciIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEyNDcuMDAwMDAwLCAxOC4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik01LDcgTDI0LDcgTDI0LDIxIEw1LDIxIEw1LDcgWiBNNiw4IEwyMyw4IEwyMywxNSBMNiwxNSBMNiw4IFogTTksMTEgQzkuNTUyMjg0NzUsMTEgMTAsMTAuNTUyMjg0NyAxMCwxMCBDMTAsOS40NDc3MTUyNSA5LjU1MjI4NDc1LDkgOSw5IEM4LjQ0NzcxNTI1LDkgOCw5LjQ0NzcxNTI1IDgsMTAgQzgsMTAuNTUyMjg0NyA4LjQ0NzcxNTI1LDExIDksMTEgWiBNMjIsMTQgTDEwLDE0IEwxNC4yNTcwOTkxLDEwLjgwNzgxMDEgTDE1Ljc3ODAyNiwxMS44MzM4NzEyIEwxOS4yMzQ2NzgyLDguOTgzNzAxNjIgTDIyLDExLjAxNTA5NTIgTDIyLDE0IFoiPjwvcGF0aD4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+);
  cursor: pointer;
}
.panel {
  position: absolute;
  margin-top: 1rem;
  padding: 2rem;
  top: 100%;
  left: 50%;
  font-size: 1rem;
  white-space: nowrap;
  color: #909090;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 2px;
  box-shadow: 0 1px 2px #f1f1f1;
  transform: translate(-50%);
  cursor: default;
  z-index: 1000;
}
.panel ::before {
  content: "";
  position: absolute;
  margin-left: -0.5rem;
  top: -0.6rem;
  left: 50%;
  width: 1rem;
  height: 1rem;
  background-color: #fff;
  border: 1px solid #ddd;
  border-right: none;
  border-bottom: none;
  transform: rotate(45deg);
}
.file {
  opacity: 0;
  cursor: pointer;
}
.upload-pic {
  position: absolute;
  right: 5rem;
  top: 1.5rem;
}
</style>