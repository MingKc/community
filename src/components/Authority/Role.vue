<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item><a href="/">角色管理</a></el-breadcrumb-item>
          <el-breadcrumb-item><a href="/">角色列表</a></el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片 -->
        <el-card>
            <el-row>
                <el-col>
                    <!-- 添加角色按钮 -->
                    <el-button type="primary" @click="addRoleDialogVisible = true">添加角色</el-button>
                </el-col>
            </el-row>
            <el-table :data="rolesList" stripe border>
                <!-- 展开列 -->
                <el-table-column type="expand">
                    <template v-slot="rightsInfo">
                        <el-row :class="['borderbottom', index1 === 0? 'bordertop':'', 'position']" v-for="(rights, index1) in rightsInfo.row.children" :key="rights.id">
                            <!-- 一级权限 -->
                            <el-col :span="5">
                                <el-tag>{{rights.auth_name}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 二级权限和三级权限 -->
                            <el-col :span="19">
                                <el-row :class="[index2 === 0? '':'bordertop', 'position']" v-for="(item, index2) in rights.children" :key="item.id">
                                    <!-- 二级权限 -->
                                    <el-col :span="6">
                                        <el-tag type="success">{{item.auth_name}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <!-- 三级权限 -->
                                    <el-col :span="18">
                                        <el-tag type="warning" v-for="(item3) in item.children" :key="item3.id">{{item3.auth_name}}</el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <!-- 索引列 -->
                <el-table-column type="index"></el-table-column>
                <el-table-column label="角色名称" prop="role_name" ></el-table-column>
                <el-table-column label="角色描述" prop="role_desc" ></el-table-column>
                <!-- 操作 -->
                <el-table-column label="操作" width="300px">
                    <template v-slot="slotProps">
                        <!-- 编辑角色 -->
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditRole(slotProps.row.role_id)">编辑</el-button>
                        <!-- 删除角色 -->
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteRole(slotProps.row.role_id)">删除</el-button>
                        <!-- 分配权限 -->
                        <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRights(slotProps.row)">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 编辑角色对话框 -->
        <el-dialog title="编辑角色" :visible.sync="editRolesDialogVisible" width="50%" @close="editClosed">
            <!-- 添加用户表单 -->
            <el-form :model="editRoles" status-icon :rules="rolesRules" ref="editRolesRef" label-width="80px">
                <el-form-item label="角色名称" prop="role_name">
                    <el-input v-model="editRoles.role_name"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="role_desc">
                    <el-input v-model="editRoles.role_desc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editRolesDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editRolesEvent">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 添加角色对话框 -->
        <el-dialog title="添加角色" :visible.sync="addRoleDialogVisible" width="50%" @close="addClosed">
            <!-- 添加用户表单 -->
            <el-form :model="addRoles" status-icon :rules="rolesRules" ref="addRolesRef" label-width="80px">
                <el-form-item label="角色名称" prop="role_name">
                    <el-input v-model="addRoles.role_name"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="role_desc">
                    <el-input v-model="addRoles.role_desc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addRoleDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRolesEvent">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 分配权限对话框 -->
        <el-dialog title="分配权限" :visible.sync="setRightsDialogVisible" width="40%" @close="setRightsDialogClosed">
            <el-tree :data="setRightsData" :props="defaultProps" default-expand-all show-checkbox :default-checked-keys="defaultKeys" node-key="auth_id" ref="setRightsRef"></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRightsDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="setRightsEvent">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data: function () {
        return {
            // 角色信息列表
            rolesList: [],
            // 存放编辑角色表单数据
            editRoles: {},
            // 控制编辑角色对话框
            editRolesDialogVisible: false,
            // 控制添加角色对话框
            addRoleDialogVisible: false,
            // 控制分配权限对话框
            setRightsDialogVisible: false,
            // 角色表单校验对象
            rolesRules: {
                role_name: [
                    { required: true, message: '请输入角色名称', trigger: 'blur' }
                ],
                role_desc: [
                    { required: true, message: '请输入角色描述', trigger: 'blur' }
                ]
            },
            // 添加角色表单数据
            addRoles: {
                role_name: '',
                role_desc: ''
            },
            // 分配权限数据
            setRightsData: {},
            // 分配权限树形控制对象
            defaultProps: {
                // 层级显示内容
                label: 'auth_name',
                // 父子级管理
                children: 'children'
            },
            // 默认已有的权限节点
            defaultKeys: [],
            // 需要分配权限的id
            roleId: ''
        }
    },
    methods: {
        // 查询角色信息
        async queryRoles() {
            const ret = await this.axios.get('role/list')
            if (ret.meta.status !== 200) {
                return this.$message.error('获取角色列表失败！')
            }
            this.rolesList = ret.data
        },
        // 打开编辑角色对话框并渲染数据
        async showEditRole(id) {
            const ret = await this.axios.get('role/list', { params: { role_id: id } })
            if (ret.meta.status === 200) {
                this.editRoles = ret.data
                this.editRolesDialogVisible = true
            }
        },
        // 重置编辑角色表单
        editClosed() {
            this.$refs.editRolesRef.resetFields()
        },
        // 提交编辑角色信息
        editRolesEvent() {
            // 表单预校验
            this.$refs.editRolesRef.validate(async value => {
                if (value) {
                    var params = new URLSearchParams()
                    params.append('role_name', this.editRoles.role_name)
                    params.append('role_id', this.editRoles.role_id)
                    params.append('role_desc', this.editRoles.role_desc)
                    const ret = await this.axios.post('role/modify', params)
                    if (ret.meta.status !== 200) {
                        return this.$message.error('编辑角色信息失败！')
                    }
                    this.editRolesDialogVisible = false
                    this.$message.success('编辑角色信息成功！')
                    this.queryRoles()
                }
            })
        },
        // 删除角色
        async deleteRole(id) {
            const tip = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).catch(err => err)
            // 确定删除返回confirm，取消返回cancel
            if (tip === 'confirm') {
                const ret = await this.axios.get('role/delete', { params: { role_id: id }})
                if (ret.meta.status !== 200) {
                    return this.$message.error('删除角色失败！')
                }
                this.$message.success('删除角色成功！')
                this.queryRoles()
            }
        },
        // 重置添加角色表单
        addClosed() {
            this.$refs.addRolesRef.resetFields()
        },
        // 添加用户表单
        addRolesEvent() {
            // 表单预校验
            this.$refs.addRolesRef.validate(async value => {
                if (value) {
                    var params = new URLSearchParams()
                    params.append('role_name', this.addRoles.role_name)
                    params.append('role_desc', this.addRoles.role_desc)
                    const ret = await this.axios.post('role/add', params)
                    console.log(ret)
                    if (ret.meta.status !== 200) {
                        return this.$message.error('添加角色信息失败！')
                    }
                    this.addRoleDialogVisible = false
                    this.$message.success('添加角色信息成功！')
                    this.queryRoles()
                }
            })
        },
        // 显示分配权限
        async setRights(role) {
            this.roleId = role.role_id
            // 加载所有权限
            const ret = await this.axios.get('auth/showlist', { params: { type: 'tree' }})
            if (ret.meta.status !== 200) {
                return this.$message.error('加载权限列表失败！')
            }
            this.setRightsData = ret.data
            // 直接获取三级权限节点值
            this.findRights(role, this.defaultKeys)
            this.setRightsDialogVisible = true
        },
        // 递归查找先有角色的所有权限
        findRights: function (node, arr) {
            if (!node.children) {
                return arr.push(node.auth_id)
            }
            node.children.forEach(childNode => this.findRights(childNode, arr))
        },
        // 关闭分配权限对话框重置对话框
        setRightsDialogClosed() {
            this.defaultKeys = []
        },
        // 提交分配权限
        setRightsEvent: async function () {
            // ...展开运算符 展开数组
            const choice = [
                ...this.$refs.setRightsRef.getHalfCheckedKeys(),
                ...this.$refs.setRightsRef.getCheckedKeys()
            ]
            // id排序保证菜单栏输出顺序
            choice.sort();
            // 拼接权限ids
            const str = choice.join(',')
            var params = new URLSearchParams()
            params.append('role_id', this.roleId)
            params.append('role_auth_ids', str)
            const ret = await this.axios.post('role/auth', params)
            if (ret.meta.status !== 200) {
                return this.$message.error('权限分配失败！')
            }
            this.$message.success('权限分配成功！')
            this.queryRoles()
            this.setRightsDialogVisible = false
        }
    },
    created: function () {
        this.queryRoles()
    }
}
</script>

<style lang="less" scoped>
.el-tag{
    margin: 7px;
}

.borderbottom{
    border-bottom: 1px solid #eee;
}

.bordertop{
    border-top: 1px solid #eee;
}

.position{
    display: flex;
    align-items: center;
}
</style>
