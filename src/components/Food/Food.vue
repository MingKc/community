<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item><a href="#/food">饮食服务</a></el-breadcrumb-item>
            <el-breadcrumb-item><a href="/">订餐服务</a></el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片区域 -->
        <el-card>
            <!-- 走马灯 -->
            <el-carousel :interval="4000" type="card" height="200px">
                <el-carousel-item>
                    <img src="http://localhost:80/server/public/image/banner1.png">
                </el-carousel-item>
                <el-carousel-item>
                    <img src="http://localhost:80/server/public/image/banner2.png">
                </el-carousel-item>
                <el-carousel-item>
                    <img src="http://localhost:80/server/public/image/banner3.png">
                </el-carousel-item>
                <el-carousel-item>
                    <img src="http://localhost:80/server/public/image/banner4.png">
                </el-carousel-item>
                <el-carousel-item>
                    <img src="http://localhost:80/server/public/image/banner5.png">
                </el-carousel-item>
                <el-carousel-item>
                    <img src="http://localhost:80/server/public/image/banner6.png">
                </el-carousel-item>
            </el-carousel>

            <el-container>
                <el-header>
                    <!-- 搜索和添加商品 -->
                    <el-row :gutter="20">
                        <!-- 搜索框 -->
                        <el-col :span="8">
                            <el-input v-model="food_name" placeholder="请输入搜索菜品名称" clearable @clear="getFoodList">
                                <el-button slot="append" icon="el-icon-search" @click="getFoodList"></el-button>
                            </el-input>
                        </el-col>
                    </el-row>
                </el-header>
                <el-container>
                    <el-aside width="100px">
                            <el-menu :default-active="nowActive" class="el-menu-vertical-demo" @select="selectMenu">
                                <el-menu-item :index="index" :key="index" v-for="(item, index) in foodCate">
                                <span slot="title">{{item}}</span>
                            </el-menu-item>
                        </el-menu>
                    </el-aside>
                    <el-main>
                        <el-row :gutter="20">
                            <el-col :span="8" v-for="(item, index) in foodList" :key="index">
                                <el-card :body-style="{ padding: '0px' }">
                                    <img :src="item.food_pics" class="image">
                                    <div style="padding: 14px;">
                                        <span>{{item.food_name}}</span>
                                        <div class="bottom clearfix">
                                        <time class="time">{{ item.food_price }}</time>
                                        <el-input-number v-model="selectFood[item.food_id]" @change="handleChange" :min="0" :max="10" class="button"></el-input-number>
                                         </div>
                                    </div>
                                </el-card>
                            </el-col>
                        </el-row>
                        <!-- 分页 -->
                        <div class="block">
                            <el-pagination @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-size="queryInfo.pagesize" layout="total, prev, pager, next, jumper" :total="total">
                            </el-pagination>
                            <el-badge class="item" :value="totalFoodNum" :hidden="totalFoodNum === 0 ? true:false">
                                <el-button class="share-button"  icon="el-icon-shopping-cart-2" type="default" @click="drawer = true"></el-button>
                            </el-badge>
                        </div>
                    </el-main>
                </el-container>
            </el-container>
        </el-card>

        <!-- 购物车抽屉 -->
        <el-drawer :visible.sync="drawer" :direction="direction">
            <el-table :data="order" stripe>
                <el-table-column prop="food_name" label="菜品名称" width="150"></el-table-column>
                <el-table-column prop="number" label="菜品数量" width="200"></el-table-column>
                <el-table-column prop="total_price" label="菜品总价"></el-table-column>
            </el-table>
            <el-divider></el-divider>
            <div class="money">
                <h3>总价为：</h3>
                <h3>{{totalPrice}}元</h3>
            </div>
            <div class="submitMenu">
                <el-button type="primary" icon="el-icon-edit" @click="submitMenu">提交订单</el-button>
            </div>
        </el-drawer>
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
                    pagesize: 3
                },
                // 菜品种类
                cate: 1,
                // 菜品名称
                food_name: '',
                // 总记录数
                total: 0,
                // 菜品列表
                foodList: [],
                foodCate: {
                    1:  '新鲜蔬菜',
                    2: '主食',
                    3: '豆制品',
                    4: '海鲜产品',
                    5: '禽类荤菜',
                    6: '汤、羹类',
                    7: '面食',
                    8: '凉菜',
                    9: '水果',
                    10: '饮料'
                },
                // 当前菜品种类
                nowActive: '1',
                // 选择的菜品数量
                selectFood: [],
                // 每个菜品的总价
                selectFoodTotalPrice: [],
                // 每个菜品的单价
                foodPrice: [],
                // 控制购物车的显示
                drawer: false,
                // 购物车从下往上显示
                direction: 'rtl'
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
                        "pagesize": this.queryInfo.pagesize,
                        "cate": this.cate
                    }
                }
                const ret = await this.axios.get('food/list', { params: query })
                if(ret.meta.status !== 200){
                    return this.$message.error('菜品获取失败！')
                }
                this.foodList = ret.data.food
                this.total = ret.data.total
                for (var i = 0; i < this.foodList.length; i++) {
                    this.foodPrice[this.foodList[i].food_id] = {
                        'food_price': this.foodList[i].food_price,
                        'food_name': this.foodList[i].food_name
                    }
                }
            },
            // 监听页码改变
            handleCurrentChange(newPage){
                this.queryInfo.pagenum = newPage
                this.getFoodList()
            },
            // 监听商品数量改变
            handleChange(){
                // 计算数量改变后每个菜品的总价
                for (var i = 0; i < this.selectFoodTotalPrice.length; i++) {
                    if(this.foodPrice[i]){
                        this.selectFoodTotalPrice[i] = this.selectFood[i]*this.foodPrice[i].food_price
                    }
                }
            },
            // 菜品种类改变
            selectMenu(index){
                this.queryInfo.pagenum = 1
                this.cate = index
                this.getFoodList()
            },
            // 提交订单
            async submitMenu(){
                if(this.totalFoodNum !== 0){
                    var params = new URLSearchParams()
                    params.append('order_price', this.totalPrice)
                    params.append('order_desc', JSON.stringify(this.order))
                    const ret = await this.axios.post('order/add', params)
                    if(ret.meta.status !== 200){
                        return this.$message.error('订单提交失败！')
                    }
                    for (var i = 0; i < this.selectFood.length; i++) {
                        this.selectFood[i] = 0
                    }
                    this.$message.success('订单提交成功！')
                    this.drawer = false
                }
            }
        },
        created(){
            for (let i = 0; i <= 120; i++) {
                // i是food_id, 菜品数量
                this.selectFood[i] = 0
                this.selectFoodTotalPrice[i] = 0
            }
            this.getFoodList()
        },
        computed: {
            // 菜品总数
            totalFoodNum(){
                let total = 0
                for (var i = 0; i < this.selectFood.length; i++) {
                    total += this.selectFood[i]
                }
                return total
            },
            // 订单详情
            order(){
                let order = new Array()
                let index = 0
                for (var i = 0; i < this.selectFood.length; i++) {
                    if(this.selectFood[i] !== 0){
                        order.push ({
                            'id': i,
                            'food_name': this.foodPrice[i].food_name,
                            'number': this.selectFood[i],
                            'total_price': this.selectFoodTotalPrice[i]
                        })
                    }
                }
                return order
            },
            // 订单总价
            totalPrice(){
                let sum = 0
                for (var i = 0; i < this.order.length; i++) {
                    sum += this.order[i].total_price
                }
                return sum
            }
        }

    }
</script>

<style lang="less" scoped>
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
  }
  
  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }

  .image {
    width: 100%;
    height: 222px;
    display: block;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }
  
  .clearfix:after {
      clear: both
  }

  .el-menu-item{
    height: 40px;
  }

  .block{
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
  }

  .money{
    display: flex;
    justify-content: space-between;
    h3{
        padding: 0 20px;
    }
  }

  .submitMenu{
    display: flex;
    justify-content: flex-end;
    button{
        margin-right: 20px;
    }
  }

</style>
