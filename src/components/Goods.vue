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
      <!-- 搜索框 和 添加用户按钮 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入搜索内容"
            v-model="querycdt.query"
            :clearable="true"
            @clear="getGoodsInfos"
            @keyup.enter.native="getGoodsInfos"
          >
            <el-button slot="append" icon="el-icon-search" @click="getGoodsInfos"></el-button>
          </el-input>
        </el-col>
        <el-col :span="7">
          <el-button type="primary" @click="$router.push('goodsadd')">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 表格展示数据列表 -->
      <el-table :data="goodsInfos" border style="width: 100%">
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="110"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="120"></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="160"></el-table-column>
        <el-table-column label="操作" width="230">
          <template slot-scope="info">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 数据分页展示 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querycdt.pagenum"
        :page-sizes="[3,5,10,20]"
        :page-size="querycdt.pagesize"
        layout="total,sizes,prev,pager,next,jumper"
        :total="querycdt.tot"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  // 生命周期函数
  created() {
    this.getGoodsInfos()
  },
  methods: {
    // 数据分页相关1
    // 每条记录条数变化的回调处理
    handleSizeChange(arg) {
      // arg:变化后的记录条数
      // console.log(arg)
      this.querycdt.pagesize = arg
      // 重新根据条件获得数据
      this.getGoodsInfos()
    },
    // 当前页码变化的回调处理
    handleCurrentChange(arg) {
      // arg:变化后的当前页码值
      this.querycdt.pagenum = arg
      // 根据变化后的页码重新获得数据
      this.getGoodsInfos()
    },
    // 数据分页相关2

    // 获得用于显示的真实用户列表数据
    async getGoodsInfos() {
      // this.$http.get('goods',条数/页码/关键字)
      // 以下axios发送请求的url格式为:http://主机名: 端口/xxx/goods?query=&pagenum=1&pagesize=3
      const { data: res } = await this.$http.get('goods', {
        params: this.querycdt
      })
      // console.log(res)

      // 判断获取数据是否失败
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // 记录总记录条数
      this.querycdt.tot = res.data.total
      // 把获得好的用户数据 赋予 给goodsInfos 成员
      this.goodsInfos = res.data.goods
    }
  },
  data() {
    return {
      // 添加商品相关1
      // form表单需要的数据
      addForm: {
        goodsname: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 制作表单域校验的规则
      addFormRules: {
        goodsname: [{ required: true, message: '商品名必填', trigger: 'blur' }],
        password: [{ required: true, message: '密码必填', trigger: 'blur' }]
      },
      // 添加商品相关2

      // 商品数据
      goodsInfos: [],
      // 给获取商品数据设置查询条件
      querycdt: {
        // 查询关键字
        query: '',
        // 当前页码
        pagenum: 1,
        // 每页获取记录条数
        pagesize: 3,
        // 总记录条数
        tot: 0
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
