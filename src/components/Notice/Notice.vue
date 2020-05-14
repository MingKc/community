<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item><a href="#/notice">公告资讯</a></el-breadcrumb-item>
            <el-breadcrumb-item><a href="/">公告栏</a></el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片 -->
        <el-card>
            <!-- 搜索公告 -->
            <el-row :gutter="20">
                <!-- 搜索框 -->
                <el-col :span="10">
                    <el-input v-model="queryInfo.query" placeholder="请输入搜索标题" clearable @clear="getNoticeList">
                        <el-button slot="append" icon="el-icon-search" @click="getNoticeList"></el-button>
                    </el-input>
                </el-col>
            </el-row>

            <!-- 公告列表 -->
            <el-table :data="noticeList" stripe style="width: 100%">
                <el-table-column label="公告">
                    <template v-slot="notice">
                        <el-link :underline="false" @click="showDesc(notice.row.notice_id)">{{notice.row.notice_title}}</el-link>
                    </template>
                </el-table-column>
                <el-table-column prop="create_time" label="发布时间" width="280px"></el-table-column>
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
            handleSizeChange(newSize) {
                this.queryInfo.pagesize = newSize
                // 重新渲染页面数据
                this.getNoticeList()
            },
            // 监听页码改变
            handleCurrentChange(newPage) {
                this.queryInfo.pagenum = newPage
                // 重新渲染页面数据
                this.getNoticeList()
            },
            // 查看公告详情
            showDesc(noticeId){
                console.log(noticeId)
                this.$router.push('/notice/desc?notice_id=' + noticeId)
            }
        },
        created(){
            this.getNoticeList()
        }
    }
</script>

<style lang="less" scoped>
</style>
