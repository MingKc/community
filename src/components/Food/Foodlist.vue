<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item><a href="#/foodlist">饮食服务</a></el-breadcrumb-item>
            <el-breadcrumb-item><a href="/">食谱管理</a></el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片 -->
        <el-card>
            <!-- 搜索和添加商品 -->
            <el-row :gutter="20">
                <!-- 搜索框 -->
                <el-col :span="8">
                    <el-input v-model="food_name" placeholder="请输入搜索菜品名称" clearable @clear="getFoodList">
                        <el-button slot="append" icon="el-icon-search" @click="getFoodList"></el-button>
                    </el-input>
                </el-col>
                <!-- 添加菜品按钮 -->
                <el-col :span="4">
                    <el-button type="primary" @click="addFood">添加菜品</el-button>
                </el-col>
            </el-row>
            <!-- 公告列表 -->
            <el-table :data="foodList" stripe style="width: 100%">
                <el-table-column label="菜品ID" prop="food_id"></el-table-column>
                <el-table-column label="菜品名称" prop="food_name"></el-table-column>
                <el-table-column label="菜品价格" prop="food_price"></el-table-column>
                <el-table-column label="菜品分类" prop="cate_name"></el-table-column>
                <!-- 操作 -->
                <el-table-column label="操作" width="175px">
                    <template v-slot="food">
                        <!-- 删除 -->
                        <el-button type="danger" icon="el-icon-delete-solid" size="mini" @click="deleteFood(food.row.food_id)">删除菜品</el-button>
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
                // 获取参数
                queryInfo: {
                    // 当前页码
                    pagenum: 1,
                    // 每页显示
                    pagesize: 5
                },
                // 菜品列表
                foodList: [],
                total: 0,
                // 查询菜品名称
                food_name: ''
            }
        },
        methods: {
            async getFoodList(){
                let query = {}
                if(this.food_name !== ''){
                    query = {
                        "pagenum": this.queryInfo.pagenum,
                        "pagesize": this.queryInfo.pagesize,
                        "food_name": this.food_name
                    }
                }else{
                    query = {
                        "pagenum": this.queryInfo.pagenum,
                        "pagesize": this.queryInfo.pagesize
                    }
                }
                const ret = await this.axios.get('food/list', { params: query })
                if(ret.meta.status !== 200){
                    return this.$message.error('菜品获取失败！')
                }
                this.foodList = ret.data.food
                this.total = ret.data.total
            },
            // 监听pagesize的改变
            handleSizeChange(newSize) {
                this.queryInfo.pagesize = newSize
                // 重新渲染页面数据
                this.getFoodList()
            },
            // 监听页码改变
            handleCurrentChange(newPage) {
                this.queryInfo.pagenum = newPage
                // 重新渲染页面数据
                this.getFoodList()
            },
            // 跳转添加菜品
            addFood(){
                this.$router.push('/foodList/add')
            },
            // 删除菜品
            async deleteFood(food_id){
                const tip = await this.$confirm('此操作将删除该订单, 是否继续?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).catch(err => err)
                // 确定删除返回confirm，取消返回cancel
                if (tip === 'confirm') {
                    const ret = await this.axios.get('food/delete', {
                        params: {
                            'food_id': food_id
                        }
                    })
                    if (ret.meta.status !== 200) {
                        return this.$message.error('菜品删除失败！')
                    }
                    this.$message.success('菜品删除成功！')
                    this.getFoodList()
                }
            }
        },
        created(){
            this.getFoodList()
        }
    }
</script>

<style lang="less" scoped></style>
