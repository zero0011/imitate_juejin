<template>
  <div class="markdown-editor">
    <header class="header editor-header">
      <div class="left-box"></div>
      <!-- 文章标题 -->
      <input placeholder="输入文章标签" spellcheck="false" maxlength="80" class="title-input title-input" />
      <!-- 右边图片 -->
      <div class="right-box">
        <div class="main-image-selector with-padding">
          <!-- 上传图片 -->
          <div class="toggle-btn">
            <input type="file" class="file toggle-btn" @change="handleFileChange"/>
          </div>
        </div>
        <span class="upload-pic">上传封面图片</span>
      </div>
    </header>
    <div class="main">
      <!-- @save : 按下 ctrl + s 时触发 -->
      <!-- @change : 当值发生改变时 触发 -->
      <mavon-editor ref="editor" v-model="doc" @save="saveDoc" @cahnge="updateDoc"></mavon-editor>
    </div>
  </div>
</template>

<script>
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
      photo_file : null // 封面图片
    };
  },
  methods: {
    // 更新时的回调函数
    updateDoc(markdown, html) {
      console.log(markdown);
      console.log("---------------------------");
      console.log(html);
    },

    // 保存时的回调函数
    saveDoc(markdown, html) {
      // 先编码 , 再把 html 发送到后端
      html = this.encodeHtml(html);
      // 把 photo_file 和 html 同时发送给后端
      console.log(this.photo_file);

      // mark_data
      let mark_data = {
        html : html,
        photo : photo_file
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