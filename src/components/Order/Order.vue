<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item><a href="#/order">订单管理</a></el-breadcrumb-item>
            <el-breadcrumb-item><a href="/">订单列表</a></el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片区域 -->
        <el-card>
            <div class="block">
                <el-timeline reverse>
                <el-timeline-item :timestamp="item.create_time" placement="top" v-for="item in ordersList" :key="item.order_id">
                    <el-card>
                        <h4>订单编号：{{item.order_id}}</h4>
                        <el-row type="flex" justify="space-between">    
                            <el-col>
                                <p>订单总价为：{{item.order_price}}</p>
                            </el-col>
                            <el-col>
                                <el-button type="primary" icon="el-icon-s-platform" size="mini" @click="showDescDialog(item.order_id)">订单详情</el-button>
                                <el-button type="danger" icon="el-icon-delete-solid" size="mini" @click="deleteOrder(item.order_id)">删除订单</el-button>
                            </el-col>
                        </el-row>    
                        <el-tag type="danger" v-if="item.pay_status === 0">未付款</el-tag>
                        <el-tag type="success" v-else>已付款</el-tag>
                    </el-card>
                </el-timeline-item>
              </el-timeline>
            </div>

            <!-- 分页 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[3, 5, 10, 15]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>

        <!-- 订单详情对话框 -->
        <el-dialog title="订单详情" :visible.sync="descDialogVisible" width="50%">
            <el-table :data="orderDesc" stripe>
                <el-table-column prop="food_name" label="菜品名称"></el-table-column>
                <el-table-column prop="food_number" label="菜品数量"></el-table-column>
                <el-table-column prop="food_price" label="菜品单价"></el-table-column>
                <el-table-column prop="food_total_price" label="菜品总价"></el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                queryInfo: {
                    // 当前页
                    pagenum: 1,
                    // 每页显示记录
                    pagesize: 5
                },
                // 订单列表
                ordersList: [],
                // 订单总数
                total: 0,
                // 订单详情
                orderDesc: [],
                // 控制订单详情对话框
                descDialogVisible: false
            }
        },
        methods: {
            async getOrderList(){
                const ret = await this.axios.get('order/orders', { params: this.queryInfo })
                if(ret.meta.status !== 200){
                    return this.$message.error('订单列表获取失败！')
                }
                this.ordersList = ret.data.order
                this.total = ret.data.total
            },
            // 查看订单详情
             async showDescDialog(orderId){
                const ret = await this.axios.get('order/desc', {
                    params: {
                        'order_id': orderId
                    }
                })
                if(ret.meta.status !== 200){
                    return this.$message.error('订单详情获取失败！')
                }
                this.orderDesc = ret.data
                console.log(this.orderDesc)
                this.descDialogVisible = true
            },
            // 监听pagesize改变
            handleSizeChange(newSize){
                this.queryInfo.pagesize = newSize
                this.getOrderList()
            },
            // 监听pagenum改变
            handleCurrentChange(newPage){
                this.queryInfo.pagenum = newPage
                this.getOrderList()
            },
            // 删除订单
            async deleteOrder(orderId){
                const tip = await this.$confirm('此操作将删除该订单, 是否继续?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).catch(err => err)
                // 确定删除返回confirm，取消返回cancel
                if (tip === 'confirm') {
                    const ret = await this.axios.get('order/delete', {
                        params: {
                            'order_id': orderId
                        }
                    })
                    if (ret.meta.status !== 200) {
                        return this.$message.error('订单删除失败！')
                    }
                    this.$message.success('订单删除成功！')
                    this.getOrderList()
                }
            }
        },
        created(){
            this.getOrderList()
        }
    }
</script>

<style lang="less" scoped>
</style>
