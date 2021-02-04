<template>
  <div class="UploadFile">
      <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        action=""
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        :on-change="handleFileChange"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">
          <!-- <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的用户数据 -->
          <el-link type="info" style="font-size:12px" @click="importTemplate">下载模板</el-link>
        </div>
        <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="submitFileForm">确 定</el-button>
        <el-button size="mini" @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
    name: "UploadFile",
    data() {
        return {
            upload: {
                open: false,
                title: "用户导入",
                isUploading: false,
            },
        }
    },
    methods: {
        handleFileUploadProgress(event, file, fileList){
            
        },
        handleFileSuccess(response, file, fileList){
           
        },
        handleFileChange(file, fileList){
            console.log(file, fileList);
        },
        importTemplate(){
            alert(1)
        },
        submitFileForm(){},
      
    },
}
</script>

<style>

</style>