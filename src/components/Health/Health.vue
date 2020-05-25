<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item><a href="#/health">健康信息</a></el-breadcrumb-item>
            <el-breadcrumb-item><a href="/">健康数据</a></el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片区域 -->
        <el-card>
            <el-row>
                <el-col :span="12">
                    <div id="temperature" style="height: 314px;"></div>
                </el-col>
                <el-col :span="12">
                    <div id="highBlood" style="height: 314px;"></div>
                </el-col>
                <el-col :span="12">
                    <div id="lowBlood" style="height: 314px;"></div>
                </el-col>
                <el-col :span="12">
                    <div id="heart" style="height: 314px;"></div>
                </el-col>
            </el-row>

            <el-dialog title="健康登记" :visible.sync="isInput" width="30%">
                <el-form :model="addForm" :rules="addRules" ref="addFormRef" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="体温" prop="temperature">
                        <el-input v-model="addForm.temperature"></el-input>
                    </el-form-item>
                    <el-form-item label="高压" prop="highBlood">
                        <el-input v-model="addForm.highBlood"></el-input>
                    </el-form-item>
                    <el-form-item label="低压" prop="lowBlood">
                        <el-input v-model="addForm.lowBlood"></el-input>
                    </el-form-item>
                    <el-form-item label="心率" prop="heart">
                        <el-input v-model="addForm.heart"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="addHealth">确 定</el-button>
                </span>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
import echarts from 'echarts'
    export default {
        data(){
            return {
                // 是否未输入数据
                isInput: false,
                addForm: {
                    health_id: 0,
                    temperature: 0.0,
                    highBlood: 0,
                    lowBlood: 0,
                    heart: 0
                },
                addRules: {
                    temperature: [
                        { required: true, message: '请输入体温', trigger: 'blur' }
                    ],
                    highBlood: [
                        { required: true, message: '请输入高压', trigger: 'blur' }
                    ],
                    lowBlood: [
                        { required: true, message: '请输入低压', trigger: 'blur' }
                    ],
                    heart: [
                        { required: true, message: '请输入心率', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            async getHealth(){
                //获取当天的健康数据
                const ret = await this.axios.get('health/today')
                if(ret.meta.status === 202){
                    //当天未录入数据
                    this.isInput = true
                }else if(ret.meta.status === 200){
                    this.addForm = ret.data
                    this.showHealth()
                }else{
                    return this.$message.error('发生未知异常！')
                }
            },
            // 显示数据
            showHealth(){
                var temperature = document.getElementById("temperature")
                var temperatureChart = echarts.init(temperature)
                var highBlood = document.getElementById("highBlood")
                var highBloodChart = echarts.init(highBlood)
                var lowBlood = document.getElementById("lowBlood")
                var lowBloodChart = echarts.init(lowBlood)
                var heart = document.getElementById("heart")
                var heartChart = echarts.init(heart)
                temperatureChart.setOption(this.setParams('体温', this.addForm.temperature, '℃', '#75caff'), true)
                highBloodChart.setOption(this.setParams('高压', this.addForm.highBlood, 'mmHg', '#da0f0f'), true)
                lowBloodChart.setOption(this.setParams('低压', this.addForm.lowBlood, 'mmHg', '#8543ef'), true)
                heartChart.setOption(this.setParams('心率', this.addForm.heart, 'bpm', '#1ce6b8'), true)
            },
            //配置echarts参数
            setParams(name, value, type, color){
                var option = {
                    tooltip: {
                        formatter: '{a} : {c}'+type
                    },
                    series: [
                    {
                        name: name,
                        startAngle: 180, //开始角度 左侧角度
                        endAngle: 0, //结束角度 右侧
                        type: 'gauge',
                        center: ['50%', '50%'], //调整仪表盘的位置
                        detail: {
                            formatter: `${value}${type}`,
                            color: '#ee83af',
                            fontSize: 26,
                            fontWeight: 'bolder'
                        },
                        axisLine: {
                            lineStyle: { 
                                color: [[1, color]]
                            }
                        },
                        itemStyle: { color: '#b6bcfb' },
                        splitLine: { show: false },
                        axisTick: { show: false },
                        axisLabel: {
                            show: true,
                            fontSize: 16,
                            distance: -10,
                            padding: [24, 0, 0, 0],
                            formatter: function (value) {
                                switch (value) {
                                    case 0:
                                        return 0;//首位刻度      
                                    case 160:
                                        return 160;//末尾刻度
                                    default: return '';
                                }
                            }
                        },
                        pointer: { width: 6 },
                        data: [{ value: value, name: name }],
                        title: {
                            show: true,
                            offsetCenter: [0, '70%'],
                            textStyle: {
                                fontWeight: 'bolder',
                                fontSize: 26,
                                color: '#b6bcfb'
                            }
                        }
                    }
                ]}
                return option
            },
            //提交健康数据
            addHealth(){
                this.$refs.addFormRef.validate(async value => {
                    if(value){
                        var params = new URLSearchParams()
                        params.append('temperature', this.addForm.temperature)
                        params.append('highBlood', this.addForm.highBlood)
                        params.append('lowBlood', this.addForm.lowBlood)
                        params.append('heart', this.addForm.heart)
                        const ret = await this.axios.post('health/add', params)
                        if(ret.meta.status === 200){
                            this.isInput = false
                            this.addForm = ret.data
                            console.log(ret.data)
                            this.showHealth()
                            return this.$message.success('健康登记成功！')
                        }
                        return this.$message.error('健康登记失败！')
                    }
                })
            }
        },
        mounted(){
            this.getHealth()
        }
    }
</script>

<style lang="less" scoped>
    canvas{
        height: 314px!important;
    }
</style>
