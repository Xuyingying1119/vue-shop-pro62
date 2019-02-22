<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- card卡片区域 -->
    <el-card class="box-card">
      <!-- 表格展示数据列表 -->
      <el-table :data="rightsInfos" border style="width: 100%">
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column label="等级">
          <template slot-scope="info">
            <el-tag v-if="info.row.level==='0'">一级</el-tag>
            <el-tag v-else-if="info.row.level==='1'" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  // 生命周期函数
  created() {
    this.getRightsInfos()
  },
  methods: {
    // 获得权限列表数据
    async getRightsInfos() {
      const { data: res } = await this.$http.get('rights/list')

      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }

      // 把获得的权限数据 赋予 给rightsInfos成员
      this.rightsInfos = res.data
    }
  },
  data() {
    return {
      // 接收权限列表
      rightsInfos: []
    }
  }
}
</script>

<style lang="less" scoped>
</style>
