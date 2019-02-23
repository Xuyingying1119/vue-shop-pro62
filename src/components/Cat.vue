<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- card卡片区域 -->
    <el-card class="box-card">
      <el-button type="primary" @click="showAddDialog">添加分类</el-button>

      <!-- table-tree展示区域 -->
      <zk-table
        :data="catInfos"
        :columns="catInfosColumns"
        show-index
        :expand-type="false"
        :selection-type="false"
      >
        <template slot="order" slot-scope="info">
          <el-tag v-if="info.row.cat_level==0">一级</el-tag>
          <el-tag v-else-if="info.row.cat_level==1" type="success">二级</el-tag>
          <el-tag v-else type="warning">三级</el-tag>
        </template>
        <template slot="opt">
          <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
        </template>
      </zk-table>

      <!-- 添加分类对话框 -->
      <el-dialog title="添加分类" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="分类上级">
            <!-- 级联选择器 区 -->
            <el-cascader
              expand-trigger="hover"
              :options="catInfosTwo"
              :props="catInfosTwoProps"
              v-model="selectedCat"
              @change="handleChange"
            ></el-cascader>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCat">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  // 生命周期函数
  created() {
    this.getcatInfos()
  },
  methods: {
    /* 添加分类相关1 */
    // 上级分类 更换 后的回调
    handleChange() {
      /* 上级选取随时变化  随时感知
         通过成员 selectedCat 感知当前选取的上级分类信息情况
         selectedCat本身是一个数组:
         [] 没有选取上级分类
         [130]选取了一个第1级别上级分类
         [130,155] 选取了一个第2级别上级分类
         console.log(this.selectedCat)
         cat_pid 分类父id   cat_level 分类当前层级
         根据selectedCat制作"新分类的cat_pid和cat_level"
       */
      if (this.selectedCat.length === 0) {
        //  没有选取上级分类(新分类作为第1级别分类添加)
        this.addForm.cat_pid = 0
        this.addForm.cat_level = 0
      } else {
        //  有选取上级分类(新分类作为子级分类存在)
        var len = this.selectedCat.length
        this.addForm.cat_pid = this.selectedCat[len - 1]
        this.addForm.cat_level = len
      }
    },
    // 展示添加分类的对话框
    async showAddDialog() {
      // 展示对话框
      this.addDialogVisible = true

      // 获取"第1/2级别'上级分信息
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // console.log(res)
      // 通过catINFOSTwo接收获得前两个级别分类信息
      this.catInfosTwo = res.data
    },
    // 关闭对话框回调
    addDialogClose() {
      // 重置form表单
      this.$refs.addFormRef.resetFields()
      // 重置 级联选择器
      this.selectedCat = []
    },
    // 添加分类 收集数据存储
    addCat() {
      // 表单校验
      this.$refs.addFormRef.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.post(
            'categories',
            this.addForm
          )
          if (res.meta.status !== 201) {
            return this.$message.error(res.meta.msg)
          }
          // 关闭对话框、成功提示、数据重新加载
          this.addDialogVisible = false
          this.$message.success(res.meta.msg)
          this.getcatInfos()
        }
      })
    },
    /* 添加分类相关2 */

    // 获得分类列表数据
    async getcatInfos() {
      const { data: res } = await this.$http.get('categories', {
        params: this.querycdt
      })
      if (res.meta.status !== 200) {
        return this.$message.console.error(res.meta.msg)
      }
      // console.log(res)
      // 把获得好的3个级别的分类信息赋予给 catInfos 成员
      this.catInfos = res.data.result
    }
  },
  data() {
    return {
      /* 添加分类相关1 */
      catInfosTwo: [], // 上级分类显示的数据
      // 给 级联选择器 节点 设置内容属性
      catInfosTwoProps: {
        label: 'cat_name', // 名称 字段
        value: 'cat_id', // "值" 字段
        children: 'children' // 子级 字段
      },
      selectedCat: [], // 设置 或 接收 选中的上级分类
      // 表单校验规则
      addFormRules: {
        cat_name: [{ required: true, message: '分类名称必填', trigger: 'blur' }]
      },
      // 表单数据对象
      addForm: {
        cat_name: '', // 分类名称
        cat_pid: 0, // 分类直接父级id
        cat_level: 0 // 分类等级
      },
      addDialogVisible: false, // 对话框显示开关
      /* 添加分类相关2 */
      catInfos: [], // 分类列表数据
      // 给table-tree定义列属性
      catInfosColumns: [
        // {label:表格各列头部名称, prop:列内容字段名称}
        { label: '分类名称', prop: 'cat_name' },
        { label: '排序', type: 'template', template: 'order' },
        { label: '操作', type: 'template', template: 'opt' }
      ],
      // 定义获取分类数据的条件
      querycdt: {
        type: 3, // 默认获取3个级别全部分类信息
        pagenum: 1, // 默认页码
        pagesize: 5 // 默认条数
      }
    }
  }
}
</script>

<style lang="less" scoped>
.zk-table {
  margin-top: 15px;
}
</style>
