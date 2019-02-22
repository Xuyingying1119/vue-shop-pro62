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
      <el-button type="primary">添加分类</el-button>

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
      catInfos: [], //分类列表数据
      // 给table-tree定义列属性
      catInfosColumns: [
        // {label:表格各列头部名称, prop:列内容字段名称}
        { label: '分类名称', prop: 'cat_name' },
        { label: '排序', type:'template', template: 'order'},
        { label: '操作',type:'template',template:'opt'}
      ],
      // 定义获取分类数据的条件
      querycdt: {
        type: 3, //默认获取3个级别全部分类信息
        pagenum: 1, //默认页码
        pagesize: 5 //默认条数
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>