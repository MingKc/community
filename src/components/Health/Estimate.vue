<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item><a href="#/health">健康信息</a></el-breadcrumb-item>
            <el-breadcrumb-item><a href="/">健康评估</a></el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片区域 -->
        <el-card>
            <h1>您的健康评估等级为：</h1>
            <el-rate v-model="value" disabled show-score text-color="#ff9900" score-template="{value}">
            </el-rate>
            <h1>评估建议：</h1>
            <el-row :gutter="20">
                <el-col :xs="24" :sm="12">
                    <el-card>
                        <div :key="index" v-for="(item,index) in sportSuggest">
                            <h3 v-if="index === 0">运动</h3>
                            <el-divider v-if="index !== 0"></el-divider>
                            <h4>{{index+1}}、{{item.suggest}}</h4>
                        </div>
                    </el-card>
                </el-col>
                <el-col :xs="24" :sm="12">
                    <el-card>
                        <div :key="index" v-for="(item,index) in foodSuggest">
                            <h3 v-if="index === 0">饮食</h3>
                            <el-divider v-if="index !== 0"></el-divider>
                            <h4>{{index+1}}、{{item.suggest}}</h4>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                // 健康评分等级
                value: 0,
                // 运动建议
                sportSuggest: [],
                // 饮食建议
                foodSuggest: []
            }
        },
        methods: {
            // 获取健康评估信息
            async getEstimateInfo(){
                const result = await this.axios.get('estimate/estimate')
                if(result.meta.status !== 200){
                    return this.$message.error('健康评估信息获取失败！')
                }
                this.value = result.data.grade
                result.data.suggest.forEach(item => {
                    if(item.type === 0){
                        this.foodSuggest.push(item)
                    }else if(item.type === 1){
                        this.sportSuggest.push(item)
                    }
                })
            }
        },
        created(){
            this.getEstimateInfo()
        }
    }
</script>

<style lang="less" scoped>
    .el-row{
        margin-top: 15px;
    }
</style>
