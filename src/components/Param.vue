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
            <el-table-column type="expand">
              <!-- 获得每个参数记录信息 -->
              <template slot-scope="info">
                <!-- 展示每个参数的可选值列表 -->
                <el-tag
                  v-for="(v,k) in info.row.attr_vals_arr"
                  :key="k"
                  closable
                  disable-transitions
                >{{v}}</el-tag>

                <!-- 添加可选值 的按钮和输入框 -->
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(info.row)"
                  @blur="handleInputConfirm(info.row)"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
              </template>
            </el-table-column>
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
            <el-table-column type="expand">
              <!-- 获得每个参数记录信息 -->
              <template slot-scope="info">
                <!-- 展示每个参数的可选值列表 -->
                <el-tag
                  v-for="(v,k) in info.row.attr_vals_arr"
                  :key="k"
                  closable
                  disable-transitions
                >{{v}}</el-tag>

                <!-- 添加可选值 的按钮和输入框 -->
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(info.row)"
                  @blur="handleInputConfirm(info.row)"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
              </template>
            </el-table-column>
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
    /* 添加参数可选值 相关1 */
    // 输入框 被敲回车键 或 失去焦点的回调处理
    // nowParam:当前被添加可选值对应的"参数记录对象"
    handleInputConfirm(nowParam) {
      // 1.通过el-tag显示被添加的可选值(本质: 给nowParam.attr_vals_arr增加元素而已)
      if (this.inputValue.trim() !== '') {
        nowParam.attr_vals_arr.push(this.inputValue.trim())
      }
      // 2.input隐藏、button显示
      this.inputVisible = false
      // 3.清除输入框输入的旧信息
      this.inputValue = ''
    },
    // button按钮被点击回调
    showInput() {
      // (input显示、button隐藏)
      this.inputVisible = true

      // 给 输入框 设置获得焦点
      // $nextTick作用: 全部内容从"Vue内存"已经渲染到"html容器"了
      //  与window.onload相似
      this.$nextTick(_ => {
        // 如下 有连贯调用两次$refs
        // 主要作用: 获得最原始底层的input元素
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    /* 添加参数可选值 相关2 */
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

      // 遍历,把各个参数信息的 可选值内容 由字符串变为数组处理
      res.data.forEach(item => {
        // 给参数信息增加attr_vals_arr成员,用以接收 数组格式可选值 信息
        // split()可以使得字符串变为数组
        item.attr_vals_arr = item.attr_vals.split(' ')
      })
      // console.log(res)
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
      /* 添加可选值相关1 */
      inputVisible: false, // 输入框/按钮 切换显示开关
      inputValue: '', // 接收输入框信息
      /* 添加可选值相关2 */

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

// 给el-tag参数可选值设置样式
.el-tag {
  margin: 10px 5px;
}

// 给可选值输入框设置样式
.input-new-tag {
  width: 90px;
}
</style>
