<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- card卡片区域 -->
    <el-card class="box-card">
      <!-- 警告区 -->
      <el-alert title="注意:只允许为第三级分类设置相关参数!" type="warning" show-icon :closable="false"></el-alert>

      <!-- 商品级联选择器 区 -->
      <el-row>
        <el-col>
          <span>选择商品分类:</span>
          <el-cascader
            expand-trigger="hover"
            :options="catInfos"
            :props="catInfosProps"
            v-model="selectedCat"
            @change="handleChange"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- 标签切换区 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="showButton">添加动态参数</el-button>

          <!-- 表格展示数据列表 -->
          <el-table :data="manyParamInfos" border style="width: 100%">
            <el-table-column type="expend"></el-table-column>
            <el-table-column type="index" label="序号" width="60"></el-table-column>
            <el-table-column prop="attr_name" label="动态参数名称"></el-table-column>
            <el-table-column label="操作" width="350">
              <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态参数" name="only">
          <el-button type="primary" size="mini" :disabled="showButton">添加静态参数</el-button>

          <!-- 表格展示数据列表 -->
          <el-table :data="onlyParamInfos" border style="width: 100%">
            <el-table-column type="expend"></el-table-column>
            <el-table-column type="index" label="序号" width="60"></el-table-column>
            <el-table-column prop="attr_name" label="静态参数名称"></el-table-column>
            <el-table-column label="操作" width="350">
              <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  // 生命周期函数
  created() {
    this.getCatInfos()
  },
  methods: {
    // 切换标签被点击后的回调处理
    handleClick() {},
    // 获取 级联选择器 显示内容
    async getCatInfos() {
      // 获取"第1/2/3级别"分类信息
      const { data: res } = await this.$http.get('categories', {
        params: { type: 3 }
      })

      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // 通过catInfos接收全部的分类信息
      this.catInfos = res.data
    },
    // 级联选择器 内容变化的回调
    handleChange() {
      // 如果选取设置"非第3级别"分类,请重置分类
      if (this.selectedCat.length !== 3) {
        // 重置分类
        this.selectedCat = []
        // 禁用添加按钮
        this.showButton = true
        // 重置 catThreeId
        this.catThreeId = 0
        // 参数列表清空重置
        this.manyParamInfos = []
        this.onlyParamInfos = []
      } else {
        // 选取了第3级别分类
        // 激活添加按钮
        this.showButton = false
        // 把第3级别分类id 赋予 给catThreeId
        this.catThreeId = this.selectedCat[2]
        // 获取对应的参数信息
        this.getParamInfos()
      }
    },
    // 切换标签被点击后的回调处理
    handleClick() {
      // 如果没有选取第3级别分类,就不要获取参数了,代码停止
      if (this.catThreeId === 0) {
        return null
      }
      // 获取对应的参数信息
      this.getParamInfos()
    },
    // 统一获取参数类别实现逻辑
    async getParamInfos() {
      // 两个必要条件:
      // 1)第3级别分类id  catThreeId
      // 2)参数类型(动态/静态) activeName
      const { data: res } = await this.$http.get(
        'categories/' + this.catThreeId + '/attributes',
        { params: { sel: this.activeName } }
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // 通过data成员接收获取回来的"参数"信息
      if (this.activeName === 'many') {
        this.manyParamInfos = res.data
      } else {
        this.onlyParamInfos = res.data
      }
    }
  },
  data() {
    return {
      // 接收分类参数列表信息
      manyParamInfos: [],
      onlyParamInfos: [],
      // 接收选取的第3级别分类id
      catThreeId: 0,
      // 添加按钮是否激活(默认禁用)
      showButton: true,
      // 标签切换相关
      activeName: 'many', // 设置默认显示标签 / 获取选中标签值
      // 商品分类 级联选择器
      catInfos: [], // 定义 级联选择器 数据
      // 给 级联选择器 节点 设置内容属性
      catInfosProps: {
        label: 'cat_name', // 名称 字段
        value: 'cat_id', // "值" 字段
        children: 'children' // 子级 字段
      },
      selectedCat: [] // 设置 或 接收 选择器的选中项目
    }
  }
}
</script>

<style lang="less" scoped>
.el-row {
  margin-top: 15px;
}
</style>
