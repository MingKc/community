<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item><a href="#/health">健康信息</a></el-breadcrumb-item>
            <el-breadcrumb-item><a href="/">健康历史</a></el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片区域 -->
        <el-card>
            <!-- echarts图表 -->
            <div id="main" style="width: 750px; height: 400px;"></div>
        </el-card>
    </div>
</template>

<script>
import echarts from 'echarts'
    export default {
        data(){
            return {}
        },
        methods:{
            getHealthData: async function() {
                var myChart = echarts.init(document.getElementById('main'))
                const ret = await this.axios.get('health/query')
                if(ret.meta.status !== 200){
                    return this.$message.error('健康历史数据获取失败！')
                }
                myChart.setOption(ret.data)
            }
        },
        mounted(){
            this.getHealthData()
        }
    }
</script>

<style lang="less" scoped>
    .el-card{
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>
