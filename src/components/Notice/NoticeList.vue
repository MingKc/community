<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item><a href="#/noticelist">公告资讯</a></el-breadcrumb-item>
            <el-breadcrumb-item><a href="/">公告管理</a></el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片 -->
        <el-card>
            <!-- 搜索和添加公告 -->
            <el-row :gutter="20">
                <!-- 搜索框 -->
                <el-col :span="10">
                    <el-input v-model="queryInfo.query" placeholder="请输入搜索公告" clearable @clear="getNoticeList">
                        <el-button slot="append" icon="el-icon-search" @click="getNoticeList"></el-button>
                    </el-input>
                </el-col>
                <!-- 添加公告按钮 -->
                <el-col :span="4">
                    <el-button type="primary" @click="addNotice">添加公告</el-button>
                </el-col>
            </el-row>

            <!-- 公告列表 -->
            <el-table :data="noticeList"  stripe border style="width: 100%">
                <!-- 索引列 -->
                <el-table-column type="index"></el-table-column>
                <el-table-column label="公告标题" prop="notice_title">
                </el-table-column>
                <el-table-column prop="create_time" label="发布时间" width="280px"></el-table-column>
                <!-- 操作 -->
                <el-table-column label="操作" width="175px">
                    <template v-slot="notice">
                        <!-- 修改 -->
                        <el-tooltip effect="dark" content="修改" placement="bottom" :enterable="false">
                          <el-button type="primary" icon="el-icon-edit" size="mini" @click="modifyNotice(notice.row.notice_id)"></el-button>
                        </el-tooltip>
                        <!-- 删除 -->
                        <el-tooltip effect="dark" content="删除" placement="bottom" :enterable="false">
                          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteNotice(notice.row.notice_id)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 15, 20]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                queryInfo: {
                    query: '',
                    pagesize: 10,
                    pagenum: 1
                },
                noticeList: [],
                total: 0
            }
        },
        methods: {
            async getNoticeList(){
                const ret = await this.axios.get('notice/query', { params: this.queryInfo })
                if(ret.meta.status !== 200){
                    return this.$message.error('获取公告资讯失败！')
                }
                this.noticeList = ret.data.notice
                this.total = ret.data.total
            },
            // 监听pagesize的改变
            handleSizeChange: function (newSize) {
                this.queryInfo.pagesize = newSize
                // 重新渲染页面数据
                this.getNoticeList()
            },
            // 监听页码改变
            handleCurrentChange: function (newPage) {
                this.queryInfo.pagenum = newPage
                // 重新渲染页面数据
                this.getNoticeList()
            },
            // 修改公告
            modifyNotice(notice_id){
                this.$router.push(`/noticelist/add?notice_id=${notice_id}`)
            },
            // 删除公告
            async deleteNotice(notice_id){
                const tip = await this.$confirm('此操作将删除该公告, 是否继续?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).catch(err => err)
                // 确定删除返回confirm，取消返回cancel
                if (tip === 'confirm') {
                    const ret = await this.axios.get('notice/delete', {
                        params: {
                            'notice_id': notice_id
                        }
                    })
                    if (ret.meta.status !== 200) {
                        return this.$message.error('公告删除失败！')
                    }
                    this.$message.success('公告删除成功！')
                    this.getNoticeList()
                }
            },
            // 跳转添加公告页
            addNotice(){
                this.$router.push('noticelist/add')
            }
        },
        created(){
            this.getNoticeList()
        }
    }
</script>

<style lang="less" scoped>
    
</style>
