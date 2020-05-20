<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item><a href="#/noticelist">公告资讯</a></el-breadcrumb-item>
            <el-breadcrumb-item>
                <a href="/" v-if="notice_id === null">添加公告</a>
                <a href="/" v-else>修改公告</a>
            </el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <el-form ref="addNoticeFormRef" label-width="0px" :model="addNoticeForm" :rules="addNoticeRules">
                <p>公告标题：</p>
                <el-form-item prop="notice_title">
                    <el-input type="text" placeholder="请输入内容" v-model="addNoticeForm.notice_title" maxlength="30" show-word-limit></el-input>
                </el-form-item>
                <p>公告内容：</p>
                <el-form-item prop="notice_desc">
                    <!-- 富文本编辑器 -->
                    <quill-editor v-model="addNoticeForm.notice_desc" />
                </el-form-item>
                <!-- 文件附件 -->
                <el-upload class="upload-demo" :action="uploadUrl" :on-preview="handlePreview" :on-remove="handleRemove" multiple :limit="3" :on-exceed="handleExceed" :file-list="fileList"  :headers="requestHeader" :on-success="uploadSuccess">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传3个压缩包文件，且不超过500kb</div>
                </el-upload>
                <!-- 添加公告按钮 -->
                <el-button type="primary" class="addbtn" @click="addNotice" v-if="notice_id === null">添加公告</el-button>
                <el-button type="primary" class="addbtn" @click="addNotice" v-else>修改公告</el-button>
            </el-form>
        </el-card>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                // 公告id，如果存在则为修改,不存在为添加
                notice_id: null,
                addNoticeForm: {
                    notice_title: '',
                    notice_desc: '',
                    // 所有附件路径
                    notice_file: []
                },
                // 上传附件列表
                fileList: [],
                // 附件上传url
                uploadUrl: 'http://localhost:80/server/public/index/notice/upload',
                // 文件上传请求头
                requestHeader: {
                    Authorization: window.sessionStorage.getItem('token')
                },
                // 附件下载预览url
                previewURL: '',
                // 添加公告校验对象
                addNoticeRules: {
                    notice_title: [
                        { required: true, message: '请输入公告标题', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            // 添加公告或修改公告
            addNotice(){
                this.$refs.addNoticeFormRef.validate(async validate => {
                    if(validate){
                        if(this.addNoticeForm.notice_desc === ''){
                            return this.$message.error('公告正文内容不能为空！')
                        }
                        var params = new URLSearchParams()
                        params.append('notice_title', this.addNoticeForm.notice_title)
                        params.append('notice_desc', this.addNoticeForm.notice_desc)
                        params.append('notice_file', JSON.stringify(this.addNoticeForm.notice_file))
                        var ret = {};
                        if(this.notice_id === null){
                            ret = await this.axios.post('notice/add', params)
                        }else{
                            params.append('notice_id', this.notice_id)
                            ret = await this.axios.post('notice/modify', params)
                        }
                        if(ret.meta.status !== 200){
                            return this.$message.error('公告添加失败！')
                        }
                        if(this.notice_id === null){
                            this.$message.success('公告添加成功！')
                        }else{
                            this.$message.success('公告修改成功！')
                        }
                        this.$router.push('/noticelist')
                    }
                })

            },
            // 查询公告
            async getNoticeDesc(){
                const ret = await this.axios.get('notice/desc', {
                    params: {
                        'notice_id': this.notice_id
                    }
                })
                if(ret.meta.status !== 200){
                    return this.$message.error('获取公告详情失败！')
                }
                this.addNoticeForm.notice_title = ret.data.notice_title
                this.addNoticeForm.notice_desc = ret.data.notice_desc
            },
            // 附件预览效果事件
            handlePreview: function (file) {
                // 获取附件上传的url
                this.previewURL = file.url
                window.open(`http://localhost/${this.previewURL}`)
            },
            // 附件移出事件
            handleRemove: function (file) {
                // 获取要删除附件的临时路径的下标
                const index = this.addNoticeForm.notice_file.findIndex(item => {
                    return item === file.response
                })
                // 从数组中移出临时路径
                this.addNoticeForm.notice_file.splice(index, 1)
            },
            // 附件上传成功
            uploadSuccess: function (response) {
                // 添加每个上传的附件路径
                this.addNoticeForm.notice_file.push(response)
            },
            // 文件上传超过限制
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
            }
        },
        created(){
            // 获取公告id
            var url = window.location.href
            var params = url.split('?')[1]
            if(params){
                var notice_id = params.split('=')[1]
                if(notice_id){
                    this.notice_id = notice_id
                    this.getNoticeDesc()
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .addbtn{
        margin-top:15px;
    }

    .quill-editor{
        margin-top: 15px;
    }

    .upload-demo{
        margin-top: 15px;
    }
</style>
