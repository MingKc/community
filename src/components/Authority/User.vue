<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item><a href="/user">权限管理</a></el-breadcrumb-item>
          <el-breadcrumb-item><a href="/">用户管理</a></el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片 -->
        <el-card>
            <!-- 搜索和添加用户 -->
            <el-row :gutter="20">
                <!-- 搜索框 -->
                <el-col :span="10">
                    <el-input v-model="queryInfo.query" placeholder="请输入搜索用户名" clearable @clear="queryData">
                        <el-button slot="append" icon="el-icon-search" @click="queryData"></el-button>
                    </el-input>
                </el-col>
            </el-row>

            <!-- 用户列表 -->
            <el-table :data="userList" stripe border>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="姓名" prop="username" ></el-table-column>
                <el-table-column label="角色" prop="role_name" ></el-table-column>
                <el-table-column label="创建时间" prop="create_time" ></el-table-column>
                <el-table-column label="状态">
                <!-- 状态栏按钮 -->
                <template v-slot="slotProps">
                    <el-switch v-model="slotProps.row.status" @change="changeUserState(slotProps.row)">
                    </el-switch>
                </template>
                </el-table-column>
                <!-- 操作 -->
                <el-table-column label="操作" width="175px">
                    <template v-slot="useritem">
                        <!-- 分配角色 -->
                        <el-tooltip effect="dark" content="分配角色" placement="bottom" :enterable="false">
                          <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(useritem.row)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[3, 5, 10, 15]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="totalPage">
            </el-pagination>

            <!-- 分配角色对话框 -->
            <el-dialog title="分配角色" :visible.sync="setRolesDialogVisible" width="50%" @close="setRolesDialogClosed">
                <div>
                    <p>当前用户：{{userRole.username}}</p>
                    <p>当前角色：{{userRole.role_name}}</p>
                    <p>分配新角色：
                        <el-select v-model="selectedRoleId" placeholder="请选择">
                            <el-option v-for="item in rolesList" :key="item.role_id" :label="item.role_name" :value="item.role_id">
                            </el-option>
                        </el-select>
                    </p>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="setRolesDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="setRolesEvent">确 定</el-button>
                </span>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            queryInfo: {
               // 查询用户名
               query: '',
               // 当前页码
               pagenum: 1,
               // 每页显示条数
               pagesize: 5
            },
            // 用户数据列表
            userList: [],
            // 总共数据条数
            totalPage: 0,
            // 当前用户角色
            userRole: {},
            // 所有角色列表
            rolesList: [],
            // 控制分配角色对话框
            setRolesDialogVisible: false,
            // 新分配的角色ID
            selectedRoleId: ''
        }
    },
    methods: {
        // 查询用户数据
        async queryData() {
            const result = await this.axios.get('user/list', {
                params: this.queryInfo
            })
            // 判断是否查询成功
            if (result.meta.status !== 200) {
                return this.$message.error('获取用户列表失败！')
                
            }
            this.userList = result.data.users
            this.totalPage = result.data.total
        },
        // 监听pagesize的改变
        handleSizeChange: function (newSize) {
            this.queryInfo.pagesize = newSize
            // 重新渲染页面数据
            this.queryData()
        },
        // 监听页码改变
        handleCurrentChange: function (newPage) {
            this.queryInfo.pagenum = newPage
            // 重新渲染页面数据
            this.queryData()
        },
        // 监听用户状态改变
        async changeUserState(userinfo) {
            var params = new URLSearchParams()
            params.append('user_id', userinfo.id)
            params.append('status', userinfo.status)
            const result = await this.axios.post('user/status', params)
            // 判断是否更新成功
            if (result.meta.status !== 200) {
                userinfo.status = !userinfo.status
                return this.$message.error('用户状态更新失败！')
            }
            this.$message.success('用户状态更新成功！')
        },
        // 显示分配角色对话框
        async setRole(userinfo) {
            // 获取当前角色信息
            this.userRole = userinfo
            const ret = await this.axios.get('user/rolelist')
            if (ret.meta.status !== 200) {
                return this.$message.error('获取角色列表失败！')
            }
            this.rolesList = ret.data
            this.setRolesDialogVisible = true
        },
        // 提交分配角色
        async setRolesEvent() {
            if (!this.selectedRoleId) {
                return this.$message.error('请选择角色！')
            }
            var params = new URLSearchParams()
            params.append('user_id', this.userRole.id)
            params.append('role_id', this.selectedRoleId)
            const ret = await this.axios.post('user/role', params)
            if (ret.meta.status !== 200) {
                return this.$message.error('分配角色失败！')
            }
            this.$message.success('分配角色成功！')
            this.queryData()
            this.setRolesDialogVisible = false
        },
        // 监听分配角色对话框关闭
        setRolesDialogClosed: function () {
            this.selectedRoleId = ''
            this.rolesRules = []
        }
    },
    created() {
        this.queryData()
    }
}
</script>

<style lang="less" scoped>
</style>
