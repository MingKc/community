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
            <!-- 页头 -->
            <el-page-header @back="goBack" content="公告详情"></el-page-header>
            <!-- 公告内容 -->
            <el-container>
                <el-header class="content">
                    <h1>{{noticeDesc.notice_title}}</h1>
                    <h5>发布人：{{noticeDesc.username}}    发布时间：{{noticeDesc.create_time}}</h5>
                </el-header>
                <el-main class="content" v-html="noticeDesc.notice_desc"></el-main>
                <el-footer style="heigth: 500px;">
                    附件：
                    <el-link icon="el-icon-files" v-if="path[0] !== '[]'" :key="index" v-for="(item, index) in path" :href="'http://localhost/'+item">附件{{index+1}}</el-link>
                </el-footer>
            </el-container>
        </el-card>
    </div>
    
</template>

<script>
    export default {
        data(){
            return {
                noticeDesc: [],
                // 附件路径
                path: []
            }
        },
        methods: {
            async getNoticeDesc(notice_id){
                const ret = await this.axios.get('notice/desc', {
                    params: {
                        'notice_id': notice_id
                    }
                })
                if(ret.meta.status !== 200){
                    return this.$message.error('获取公告详情失败！')
                }
                this.noticeDesc = ret.data
                this.path = ret.data.notice_file.split(',')
            },
            // 返回公告页
            goBack(){
                this.$router.go(-1)
            }
        },
        created(){
            // 获取公告id
            var url = window.location.href
            var params = url.split('?')[1]
            if(params){
                var notice_id = params.split('=')[1]
                if(notice_id){
                    this.getNoticeDesc(notice_id)
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .content{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-top: 30px;
        h5{
            margin-top: -10px;
            color: #999;
        }
    }

    .el-link{
        margin-right: 15px;
    }
</style>
