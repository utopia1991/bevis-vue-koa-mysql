<style lang='scss'>
  .upload {
    margin: 0 0 20px 0;
    width: 400px;

    .el-button {
      margin-right: 10px;
    }
    .download-file {
      margin: 0;
      padding: 0;
      list-style: none;

      .download-file-list {
        list-style: none;
        margin: 10px 0;

        .download-file-title {
          display: inline-block;
          margin: 0 20px 0 0;
        }
      }
    }
  }
  .ql-editor {
    min-height: 100px;
  }
</style>

<template>
  <section class='box'>
    <el-steps :space="100">
      <el-step title="前期准备" status='success' description="已完成，花费8h"></el-step>
      <el-step title="项目实施" status='process' description="跳过"></el-step>
      <el-step title="项目验收" status='process' description="跳过"></el-step>
      <el-step title="商务谈判" status='success' description="已完成，花费8h"></el-step>
      <el-step title="正式计费" status='success' description="已完成，花费8h"></el-step>
      <el-step title="终止合作" status='wait' description="未完成，花费28h"></el-step>
    </el-steps>
    <br>
    <el-upload
      class="upload" ref="upload"
      :action="baseUrl + '/user/fileUpload'"
      :on-success="handleSuccess">
      <el-button size="small" type="primary">选择文件</el-button>
      <div slot="tip" class="el-upload__tip">只能上传文件，且不超过500kb</div>
      <ul v-model="downloadFileList" class="download-file">
        <li class="download-file-list" v-for="item in downloadFileList">
          <span class="download-file-title">
            <i class="el-icon-document"></i> {{item}}
          </span>
          <a :href="baseUrl + '/user/downloadFile?fileName=' + item">
            <el-button size="small">下载</el-button>
          </a>
        </li>
      </ul>
    </el-upload>
    <quill-editor ref='textEditor'
      v-model='content'
      :options='editorOption'>
    </quill-editor>
    <p>
      <el-button type="primary" @click="getContent">提交</el-button>
    </p>
  </section>
</template>

<script>
  import downloadList from '@/api/log'
  import baseUrl from '@/api/base'

  export default {
    data () {
      return {
        name: 'example',
        baseUrl: baseUrl,
        fileList: [],
        downloadFileList: '',
        content: '',
        editorOption: {
          placeholder: '请输入内容',
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline', 'strike'],
              ['blockquote', 'code-block'],
              [{header: 1}, {header: 2}],
              [{list: 'ordered'}, {list: 'bullet'}],
              [{script: 'sub'}, {script: 'super'}],
              [{indent: '-1'}, {indent: '+1'}],
              [{direction: 'rtl'}],
              [{size: ['small', false, 'large', 'huge']}],
              [{header: [1, 2, 3, 4, 5, 6, false]}],
              [{color: []}, {background: []}],
              [{font: []}],
              [{align: []}],
              ['clean'],
              ['link', 'image']
            ]
          }
        }
      }
    },
    computed: {
      editor () {
        return this.$refs.textEditor.quill
      }
    },
    mounted () {
      this.getdownloadlist()
    },
    methods: {
      getdownloadlist () {
        let params = {}

        downloadList.getDownloadList(params).then((res) => {
          if (res.data.success === true) {
            this.downloadFileList = res.data.value
          }
        })
      },
      handleSuccess () {
        this.getdownloadlist()
      },
      getContent: function () {
        let data = this.content
        console.log('content', data)
      }
    }
  }
</script>
