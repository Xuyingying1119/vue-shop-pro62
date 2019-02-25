<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- card卡片区域 -->
    <el-card class="box-card">
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>

      <!-- 步骤条 -->
      <!-- active: 设置激活的项目el-step: 接收的值必须为number整型的(即项目的下标信息),例如0/1/2等等 -->
      <!-- active-0: 使得 字符串数字 变为 纯number数字 -->
      <el-steps :active="active-0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 标签切换 -->
      <!-- v-model="activeName" 设置 默认激活 或 获取到选中的标签项目的name属性值, -->
      <!-- "activeNmae" 接收信息格式必须为string字符串-->
      <!-- 标签切换 与 步骤条 联动 -->
      <el-tabs v-model="active" tab-position="left">
        <el-tab-pane label="基本信息" name="0">
          <!-- 添加商品基本信息 表单域制作 -->
          <el-form :rules="addFormRules" ref="addFormRef" :model="addForm" label-width="80px">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="1">商品参数</el-tab-pane>
        <el-tab-pane label="商品属性" name="2">商品属性</el-tab-pane>
        <el-tab-pane label="商品图片" name="3">
          <el-upload
            class="upload-demo"
            :action="uploadUrl"
            :headers="uploadParams"
            list-type="picture"
            :on-success="uploadSuccess"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="4">
          <!-- 富文本编辑器 -->
          <quill-editor v-model="addForm.goods_introduce" ref="myQuillEditor"></quill-editor>
        </el-tab-pane>
        <el-button type="primary" style="margin-top:15px;" @click="addGoods">添加商品</el-button>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
// 引入富文本编辑器的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 引入富文本编辑器的功能模块
import { quillEditor } from 'vue-quill-editor'

export default {
  // 私有化注册富文本编辑器
  components: {
    quillEditor
  },
  methods: {
    // 添加商品,收集数据存储
    addGoods(){
      // console.log(this.addForm)
      this.$refs.addFormRef.validate(async valid=>{
        if(valid){
          // 校验成功
          const {data:res} = await this.$http.post('goods', this.addForm)
          if(res.meta.status !== 201){
            return this.$message.error(res.meta.msg)
          }
          // 添加商品成功:成功提示、页面返回到列表去
          this.$message.success(res.meta.msg)
          this.$router.push('goods')
        }
      })
    },
    // 图片上传成功之后的回调处理
    uploadSuccess(result) {
      // result会把上传图片后的响应信息都接收到(data/meta)
      // console.log(result)
      if (result.meta.status !== 200) {
        return this.$message.error(result.meta.msg)
      }
      // 上传成功,把图片"临时"路径名汇总到addForm.pics中
      var obj = { pic: result.data.tmp_path }
      this.addForm.pics.push(obj)
    }
  },
  data() {
    return {
      /* 上传图片相关1 */
      uploadUrl: 'http://127.0.0.1:8888/api/private/v1/upload',
      uploadParams: {
        // 给上传图片设置token请求头信息
        Authorization: window.sessionStorage.getItem('token')
      },
      /* 上传图片相关2 */

      // 设置默认"步骤条"激活单元(标签切换也用,达到联动效果)
      active: '0',
      // 制作表单域校验的规则
      addFormRules: {
        goods_name: {
          required: true,
          message: '商品名称必填',
          trigger: 'blur'
        },
        goods_price: {
          required: true,
          message: '商品价格必填',
          trigger: 'blur'
        },
        goods_weight: {
          required: true,
          message: '商品重量必填',
          trigger: 'blur'
        },
        goods_number: {
          required: true,
          message: '商品数量必填',
          trigger: 'blur'
        }
      },
      // form表单数据对象
      addForm: {
        goods_name: '',
        goods_cat:'10,11,12',    //给必填项目设置假数据
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        pics: [], // 收集上传图片用的
        goods_introduce:''   //商品详情(接收富文本编辑器信息)
      }
    }
  }
}
</script>

<style lang="less" scoped>
// 给 步骤条/标签切换 设置样式
.el-steps,
.el-tabs {
  margin-top: 20px;
}
</style>
