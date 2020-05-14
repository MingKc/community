<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item><a href="#/foodlist">饮食服务</a></el-breadcrumb-item>
            <el-breadcrumb-item><a href="/">添加菜品</a></el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片 -->
        <el-card>
            <!-- 步骤条 -->
            <el-steps :space="500" :active="activeIndex - 0" finish-status="success" align-center>
                <el-step title="菜品信息"></el-step>
                <el-step title="菜品图片"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>

            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-position="top">
                <!-- tabs区域 -->
                <el-tabs :tab-position="'left'" v-model="activeIndex" :before-leave="beforeLeave">

                    <!-- 基本信息 -->
                    <el-tab-pane label="菜品信息" name="0">
                        <el-form-item label="菜品名称" prop="food_name">
                            <el-input v-model="addForm.food_name"></el-input>
                        </el-form-item>
                        <el-form-item label="菜品价格" prop="food_price">
                            <el-input v-model="addForm.food_price" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="菜品分类" prop="food_cate">
                            <el-select v-model="addForm.food_cate" clearable placeholder="请选择">
                                <el-option v-for="item in cateList" :key="item.cate_id" :label="item.cate_name" :value="item.cate_id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-tab-pane>

                    <!-- 上传菜品图片 -->
                    <el-tab-pane label="菜品图片" name="1">
                        <!-- action 图片上传的后台API地址 -->
                        <el-upload :action="uploadURL" :on-preview="handlePreview" :on-remove="handleRemove" list-type="picture" :headers="requestHeader" :on-success="uploadSuccess" :limit="1">
                          <el-button size="small" type="primary">点击上传</el-button>
                          <div slot="tip" class="el-upload__tip">只能上传1个图片文件，且不超过500kb</div>
                        </el-upload>
                        <!-- 添加菜品按钮 -->
                        <el-button type="primary" class="addbtn" @click="addFood">添加菜品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>
        <!-- 图片预览对话框 -->
        <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
            <img :src="previewURL" alt="" class="previewImg">
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                // 步骤条当前激活下标
                activeIndex: '0',
                // 菜品分类信息
                cateList: [],
                // 添加菜品表单对象
                addForm: {
                    food_name: '',
                    food_price: 0,
                    food_cate: '',
                    // 图片上传临时路径
                    food_pics: ''
                },
                addFormRules: {
                    food_name: [
                        { required: true, message: '请输入菜品名称', trigger: 'blur' }
                    ],
                    food_price: [
                        { required: true, message: '请输入菜品价格', trigger: 'blur' }
                    ],
                    food_cate: [
                        { required: true, message: '请选择菜品分类', trigger: 'blur' }
                    ]
                },
                uploadURL: 'http://localhost:80/server/public/index/food/upload',
                // 图片上传请求头对象
                requestHeader: {
                    Authorization: window.sessionStorage.getItem('token')
                },
                // 图片预览路径
                previewURL: '',
                // 图片预览对话框控制
                previewVisible: false
            }
        },
        methods: {
            // 获取菜品种类
            async getCateList(){
                const ret = await this.axios.get('foodcate/getlist')
                if(ret.meta.status !== 200){
                    return this.$message.error('获取菜品种类失败！')
                }
                this.cateList = ret.data
            },
            // tab切换
            beforeLeave(activeName, oldActiveName) {
                if (oldActiveName === '0') {
                    this.$refs.addFormRef.validate(value => {
                        if(!value){
                            this.$message.error('请输入全部菜品信息！')
                            return false
                        }
                    })
                }
            },
            // 图片预览效果事件
            handlePreview: function (file) {
                // 获取图片的url
                this.previewURL = file.url
                this.previewVisible = true
            },
            // 图片移出事件
            handleRemove: function (file) {
                this.addForm.food_pics = ''
            },
            // 图片上传成功
            uploadSuccess: function (response) {
                this.addForm.food_pics = response 
                console.log(this.addForm.food_pics)
            },
            // 文件上传超过限制
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
            },
            addFood(){
                this.$refs.addFormRef.validate(async value => {
                    if(value){
                        var params = new URLSearchParams()
                        params.append('food_name', this.addForm.food_name)
                        params.append('food_cate', this.addForm.food_cate)
                        params.append('food_price', this.addForm.food_price)
                        params.append('food_pics', this.addForm.food_pics)
                        const ret = await this.axios.post('food/add', params)
                        if(ret.meta.status !== 200){
                            return this.$message.error('菜品添加失败！')
                        }
                        this.$message.success('菜品添加成功！')
                        this.$router.push('/foodlist')
                    }
                })
            }
        },
        created(){
            this.getCateList()
        }
    }
</script>

<style lang="less" scoped>
    .previewImg{
        width: 100%;
    }

    .addbtn{
        margin-top:15px;
    }
</style>
