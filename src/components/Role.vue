<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- card卡片区域 -->
    <el-card class="box-card">
      <!-- 添加按钮 -->
      <el-button type="primary" @click="addDialogVisible2=true">添加角色</el-button>

      <!-- table表格展示数据列表 -->
      <el-table :data="roleInfos" border style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="info">
            <!-- 一级权限显示 -->
            <!-- <el-row v-for="(item,k) in info.row.children" :key="item.id"
          :style="k===0 ? 'border-bottom:1px solid #EBEEF5; border-top:1px solid #EBEEF5;' :'border-bottom:1px solid #EBEEF5;'"
            >-->
            <el-row
              v-for="(item,k) in info.row.children"
              :key="item.id"
              :style="{'border-bottom':'1px solid #EBEEF5','border-top':k===0 ? '1px solid #EBEEF5' : ''}"
            >
              <el-col :span="5">
                <!-- closable: 给tag标签设置关闭按钮 -->
                <el-tag
                  closable
                  :disable-transiton="true"
                  @close="closeTag(info.row.id,item.id)"
                >{{item.authName}}</el-tag>
                <!-- icon图标设置 -->
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <!-- 二级权限显示 -->
                <!-- 设置边框border-top:每组的第一个项目不要设置 -->
                <!-- <el-row v-for="(item2,k2) in item.children" :key="item2.id"
                 :style="k2!==0 ? 'border-top:1px solid #EBEEF5;': ''"
                >-->
                <el-row
                  v-for="(item2,k2) in item.children"
                  :key="item2.id"
                  :style="{'border-top' : k2!==0? '1px solid #EBEEF5' : ''}"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      :disable-transitions="true"
                      @close="closeTag(info.row.id,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <!-- 三级权限显示 -->
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      :disable-transition="true"
                      @close="closeTag(info.row.id,item.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>

        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" width="220"></el-table-column>
        <el-table-column label="操作" width="330">
          <template slot-scope="info">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(info.row.id)"
            >编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delRole(info.row.id)"
            >删除</el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showDistributeDialog(info.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分配权限 对话框 -->
      <el-dialog title="分配权限" :visible.sync="distributeDialogVisible" width="50%">
        <el-form :model="distributeForm" label-width="120px">
          <el-form-item label="当前的角色">{{distributeForm.roleName}}</el-form-item>
          <el-form-item label="分配的权限:">
            <el-tree
              :data="rightsInfos"
              :props="rightsInfosProps"
              node-key="id"
              default-expand-all
              show-checkbox
              :default-checked-keys="defaultCheckedKeys"
              ref="rightsRef"
            ></el-tree>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="distributeDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="distributeRights">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 添加角色弹层 -->
      <el-dialog
        title="添加角色"
        :visible.sync="addDialogVisible2"
        width="50%"
        top="185px"
        @close="addDialogClose2"
      >
        <!-- 添加角色自带验证的表单区域 -->
        <el-form
          :model="addForm"
          :rules="addFormRules"
          ref="addFormRef"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="addDialogClose2">取 消</el-button>
          <el-button type="primary" @click="addRole">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 修改角色弹层 -->
      <el-dialog
        title="修改角色"
        :visible.sync="editDialogVisible2"
        width="50%"
        top="185px"
        :before-close="editDialogCloseBefore"
        @close="addDialogClose2"
      >
        <!-- 修改角色自带验证的表单区域 -->
        <el-form
          :model="editForm"
          :rules="editFormRules"
          ref="editFormRef"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="editDialogClose2">取 消</el-button>
          <el-button type="primary" @click="editRole">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  // 生命周期函数
  created() {
    this.getRoleInfos()
  },
  methods: {
    /* 分配权限相关1 */
    // 存储分配好的权限信息
    async distributeRights() {
      // 把"全选"节点的id信息获得到,数组返回
      var ids1 = this.$refs.rightsRef.getCheckedKeys()
      // 把"半选"节点的id信息获得到,数组返回
      var ids2 = this.$refs.rightsRef.getHalfCheckedKeys()
      // console.log(ids1)   //[112, 147]
      // console.log(ids2)   //[103]

      // 把 全选 和 半选 的权限id合并到一起, 并通过逗号连接变为字符串
      var allids = [...ids1, ...ids2].join(',')
      // console.log(allids)   //112,147,103

      // 请调用axios, 把当前角色选取的权限存储到后端
      const { data: res } = await this.$http.post(
        'roles/' + this.distributeForm.id + '/rights',
        { rids: allids }
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // 添加权限成功: 关闭对话框、成功提示、页面数据重新加载
      this.distributeDialogVisible = false
      this.$message.success(res.meta.msg)
      this.getRoleInfos()
    },

    // 展示分配权限的对话框
    // role: 被分配权限的一条角色记录信息(包括id/roleName/roleDesc/children等等)
    async showDistributeDialog(role) {
      // 显示对话框
      this.distributeDialogVisible = true

      // 把role 赋予 给distributeForm表单数据对象
      this.distributeForm = role

      // 把 大树tree 需要的权限获得出来
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // 把获得到的权限数据 赋予 给rightsInfos 成员
      this.rightsInfos = res.data

      // 设置树节点默认选中
      // 条件: 当前角色拥有的权限要选中
      // 末级权限接收变量 数组
      var arrIds = []
      // 从role中 把末级权限id获得出来 并储存到arrIds中
      this.getHaveRights(role, arrIds)
      // 此时 系统已经把当前角色拥有的末级权限id汇总到arrIds中
      // console.log(arrIds)  [104,105,117,119]
      // 把addIds 赋予 给 defaultCheckedKeys
      this.defaultCheckedKeys = arrIds
    },
    // 通过"递归遍历"的方式把一个角色对应的"末级权限"的id获得出来
    getHaveRights(node, keys) {
      if (!node.children) {
        return keys.push(node.id)
      }
      node.children.forEach(item => {
        return this.getHaveRights(item, keys)
      })
    },
    /* 分配权限相关2 */

    /* 角色删除权限1 */
    // 把 roleId 对应角色的rightsId权限给删除
    closeTag(roleId, rightsId) {
      this.$confirm('确认要删除该权限么?', '删除权限', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          // axios 删除权限
          const { data: res } = await this.$http.delete(
            'roles/' + roleId + '/rights/' + rightsId
          )
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }

          // 成功提示、重新加载角色数据
          this.$message.success(res.meta.msg)
          this.getRoleInfos()
        })
        .catch(() => {})
    },

    // 获取角色列表数据
    async getRoleInfos() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // 把获得的权限数据 赋予 给roleInfos成员
      this.roleInfos = res.data
    },
    // 修改角色相关
    async showEditDialog(id) {
      // 显示对话框
      this.editDialogVisible2 = true
      // 根据id获得被修改用户的信息
      const { data: res } = await this.$http.get('roles/' + id)

      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }

      // 把获得到的用户信息 赋予 给editForm表单数据对象
      this.editForm = res.data
    },
    // 修改角色需要的事件方法
    // 添加弹框 点击旁地 关闭
    editDialogCloseBefore(done) {
      this.$refs.editFormRef.resetFields()
      done()
    },
    // 修改弹框 点击取消 关闭
    editDialogClose2() {
      this.editDialogVisible2 = false
      this.$refs.editFormRef.resetFields()
    },
    // 收集数据存储入库
    editRole() {
      this.$refs.editFormRef.validate(async valid => {
        if (valid) {
          // 校验成功处理
          // 收集数据存储入库
          const { data: res } = await this.$http.put(
            'roles/' + this.editForm.roleId,
            this.editForm
          )

          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }

          // 修改成功:关闭对话框、成功提示、页面数据更新
          this.editDialogVisible2 = false
          this.$message.success(res.meta.msg)
          this.getRoleInfos()
        }
      })
    },
    // 添加角色相关1
    // 收集数据存储入库(执行后端api数据接口)
    addRole() {
      this.$refs.addFormRef.validate(async valid => {
        if (valid) {
          // 表单校验成功
          const { data: res } = await this.$http.post('roles', this.addForm)

          // 添加失败
          if (res.meta.status !== 201) {
            return this.$message.error(res.meta.msg)
          }

          // 添加成功: 关闭对话框、成功提示、显示新添加用户
          this.addDialogVisible2 = false
          this.$message.success(res.meta.msg)
          this.getRoleInfos()
        }
      })
    },
    addDialogClose2() {
      // 重置form表单
      this.addDialogVisible2 = false
      this.$refs.addFormRef.resetFields()
    },
    // 角色删除权限
    delRole(id) {
      // 确认
      this.$confirm('确定要删除该角色么?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          // axios调用api删除数据
          const { data: res } = await this.$http.delete('roles/' + id)
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }

          // 删除成功:消息提示、刷新数据
          this.$message.success(res.meta.msg)
          this.getRoleInfos()
        })
        .catch(() => {})
    }
  },
  data() {
    return {
      /* 分配权限相关1 */
      // 对话框 显示开关
      distributeDialogVisible: false,
      // 表单数据对象
      distributeForm: {
        // 被分配权限的角色id信息
        id: 0,
        // 被分配权限的角色名称信息
        roleName: ''
      },
      // 接收被分配的权限列表
      rightsInfos: [],
      // 给 大树 设置属性字段
      rightsInfosProps: {
        // 设置"树节点"名称
        label: 'authName',
        // 设置 子树 的属性名称
        children: 'children'
      },
      // 收集默认权限id信息
      defaultCheckedKeys: [],
      /* 分配权限相关2 */

      // 添加角色相关1
      // 控制添加角色对话框是否显示
      addDialogVisible2: false,
      // 添加角色表单数据对象
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      // 添加角色 表单数据验证
      addFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      },
      // 修改角色 弹框默认不显示
      editDialogVisible2: false,
      // 修改角色表单数据对象
      editForm: {
        roleName: '',
        roleDesc: ''
      },
      // 修改角色 表单数据验证
      editFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      },

      // 接收角色列表信息
      roleInfos: []
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 10px 5px;
}
.el-row {
  display: flex;
  align-items: center;
}
</style>
