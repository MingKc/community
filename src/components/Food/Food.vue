<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item><a href="/health">饮食服务</a></el-breadcrumb-item>
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
            
            <!-- 搜索和添加商品 -->
            <el-row :gutter="20">
                <!-- 搜索框 -->
                <el-col :span="8">
                    <el-input v-model="food_name" placeholder="请输入搜索菜品名称" clearable @clear="getFoodList">
                        <el-button slot="append" icon="el-icon-search" @click="getFoodList"></el-button>
                    </el-input>
                </el-col>
            </el-row>

            <!-- 标签页 -->
            <el-tabs tab-position="left" style="height: 400px;" v-model="activeIndex" @tab-click="tabClick">
                <!-- 新鲜蔬菜 -->
                <el-tab-pane label="新鲜蔬菜" name="1">
                    <el-row :gutter="20">
                      <el-col :span="8" v-for="(item, index) in foodList" :key="index">
                        <el-card :body-style="{ padding: '0px' }">
                          <img :src="item.food_pics" class="image">
                          <div style="padding: 14px;">
                            <span>{{item.food_name}}</span>
                            <div class="bottom clearfix">
                                <time class="time">{{ item.food_price }}</time>
                                <el-input-number v-model="num" @change="handleChange" :min="0" :max="10" class="button"></el-input-number>
                            </div>
                          </div>
                        </el-card>
                      </el-col>
                    </el-row>
                    <!-- 分页 -->
                    <div class="block">
                        <el-pagination @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-size="queryInfo.pagesize" layout="total, prev, pager, next, jumper" :total="total">
                        </el-pagination>
                    </div>
                </el-tab-pane>

                <!-- 主食 -->
                <el-tab-pane label="主食" name="2">
                    <el-row :gutter="20">
                      <el-col :span="8" v-for="(item, index) in foodList" :key="index">
                        <el-card :body-style="{ padding: '0px' }">
                          <img :src="item.food_pics" class="image">
                          <div style="padding: 14px;">
                            <span>{{item.food_name}}</span>
                            <div class="bottom clearfix">
                                <time class="time">{{ item.food_price }}</time>
                                <el-input-number v-model="num" @change="handleChange" :min="0" :max="10" class="button"></el-input-number>
                            </div>
                          </div>
                        </el-card>
                      </el-col>
                    </el-row>
                    <!-- 分页 -->
                    <div class="block">
                        <el-pagination @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-size="queryInfo.pagesize" layout="total, prev, pager, next, jumper" :total="total">
                        </el-pagination>
                    </div>
                </el-tab-pane>
                
                <!-- 豆制品 -->
                <el-tab-pane label="豆制品" name="3">
                    <el-row :gutter="20">
                      <el-col :span="8" v-for="(item, index) in foodList" :key="index">
                        <el-card :body-style="{ padding: '0px' }">
                          <img :src="item.food_pics" class="image">
                          <div style="padding: 14px;">
                            <span>{{item.food_name}}</span>
                            <div class="bottom clearfix">
                                <time class="time">{{ item.food_price }}</time>
                                <el-input-number v-model="num" @change="handleChange" :min="0" :max="10" class="button"></el-input-number>
                            </div>
                          </div>
                        </el-card>
                      </el-col>
                    </el-row>
                    <!-- 分页 -->
                    <div class="block">
                        <el-pagination @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-size="queryInfo.pagesize" layout="total, prev, pager, next, jumper" :total="total">
                        </el-pagination>
                    </div>
                </el-tab-pane>
                
                <!-- 海鲜产品 -->
                <el-tab-pane label="海鲜产品" name="4">
                    <el-row :gutter="20">
                      <el-col :span="8" v-for="(item, index) in foodList" :key="index">
                        <el-card :body-style="{ padding: '0px' }">
                          <img :src="item.food_pics" class="image">
                          <div style="padding: 14px;">
                            <span>{{item.food_name}}</span>
                            <div class="bottom clearfix">
                                <time class="time">{{ item.food_price }}</time>
                                <el-input-number v-model="num" @change="handleChange" :min="0" :max="10" class="button"></el-input-number>
                            </div>
                          </div>
                        </el-card>
                      </el-col>
                    </el-row>
                    <!-- 分页 -->
                    <div class="block">
                        <el-pagination @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-size="queryInfo.pagesize" layout="total, prev, pager, next, jumper" :total="total">
                        </el-pagination>
                    </div>
                </el-tab-pane>

                <!-- 禽类荤菜 -->
                <el-tab-pane label="禽类荤菜" name="5">
                    <el-row :gutter="20">
                      <el-col :span="8" v-for="(item, index) in foodList" :key="index">
                        <el-card :body-style="{ padding: '0px' }">
                          <img :src="item.food_pics" class="image">
                          <div style="padding: 14px;">
                            <span>{{item.food_name}}</span>
                            <div class="bottom clearfix">
                                <time class="time">{{ item.food_price }}</time>
                                <el-input-number v-model="num" @change="handleChange" :min="0" :max="10" class="button"></el-input-number>
                            </div>
                          </div>
                        </el-card>
                      </el-col>
                    </el-row>
                    <!-- 分页 -->
                    <div class="block">
                        <el-pagination @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-size="queryInfo.pagesize" layout="total, prev, pager, next, jumper" :total="total">
                        </el-pagination>
                    </div>
                </el-tab-pane>

                <!-- 汤、羹类 -->
                <el-tab-pane label="汤、羹类" name="6">汤、羹类</el-tab-pane>

                <!-- 面食 -->
                <el-tab-pane label="面食" name="7">面食</el-tab-pane>

                <!-- 凉菜 -->
                <el-tab-pane label="凉菜" name="8">凉菜</el-tab-pane>

                <!-- 水果 -->
                <el-tab-pane label="水果" name="9">水果</el-tab-pane>

                <!-- 饮料 -->
                <el-tab-pane label="饮料" name="10">饮料</el-tab-pane>
            </el-tabs>
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
                    pagesize: 3
                },
                // 菜品种类
                cate: 1,
                // 菜品名称
                food_name: '',
                // 总记录数
                total: 0,
                // tabs当前激活项
                activeIndex: '1',
                // 菜品列表
                foodList: [],
                num: 0
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
                const ret = await this.axios.get('food/list', { params: query})
                if(ret.meta.status !== 200){
                    return this.$message.error('菜品获取失败！')
                }
                this.foodList = ret.data.food
                this.total = ret.data.total
            },
            // 监听页码改变
            handleCurrentChange(newPage){
                this.queryInfo.pagenum = newPage
                this.getFoodList()
            },
            // 监听商品数量改变
            handleChange(){

            },
            // 监听tabs点击事件
            tabClick(){
                this.cate = this.activeIndex
                this.getFoodList()
            }
        },
        mounted(){
            this.getFoodList()
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

  .el-tabs{
    margin-top: 15px;
  }

</style>
