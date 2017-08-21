<template>
    <div class="app-content">
        <el-card class="box-card">
            <header>
                <h1 class="title">业务信息展示</h1>
            </header>

            <section class="form">
                <el-form :inline="true" :model="form" label-width="95px" @keyup.enter.native="handleQuery">

                    <el-form-item label="应用名称：">
                        <el-input v-model="form.creator" placeholder=""></el-input>
                    </el-form-item>

                    <el-form-item label="内网IP：">
                        <el-input v-model="form.creator" placeholder=""></el-input>
                    </el-form-item>

                    <el-form-item label="环境：">
                        <el-select v-model="form.creator" placeholder="">
                            <el-option v-for="(item,index) in ipEnvironmentList"
                                       :key="index"
                                       :label="item.label"
                                       :value="item.value">

                            </el-option>

                        </el-select>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="info" @click="handleQuery">查询</el-button>
                    </el-form-item>
                </el-form>
            </section>

            <el-table
                    stripe
                    border
                    :data="tableData"
                    v-loading.body="dataLoading"
                    style="width: 100%">
                <el-table-column
                        align="center"
                        prop="name"
                        label="应用名称">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="description"
                        label="应用描述">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="line"
                        width="150"
                        label="所属业务线">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="ip"
                        label="内网IP">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="machineType"
                        label="机器类型">
                </el-table-column>

                <el-table-column
                        align="center"
                        prop="environment"
                        width="100"
                        label="环境">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="port"
                        width="100"
                        label="端口号">
                </el-table-column>
                <el-table-column
                        align="center"
                        width="120"
                        prop="status"
                        label="使用状态">
                </el-table-column>
                <el-table-column
                        align="center"
                        width="120"
                        prop="deviceType"
                        label="设备类型">
                </el-table-column>

            </el-table>


            <footer class="pagination">
                <el-pagination
                        @current-change="handleCurrentChange"
                        :current-page="pagination.currentPage"
                        :page-size="10"
                        layout="total, prev, pager, next, jumper"
                        :total="pagination.totalNum">
                </el-pagination>
            </footer>
        </el-card>
    </div>
</template>


<script>

    import {query,handleCurrentChange,handleQuery} from "script/queryHandle";
    import {ipEnvironmentList} from "script/staticList"

    export default {
        name: 'businessInfo',
        data(){
            return {
                ipEnvironmentList,

                //表单数据
                form: {
                    creater: '',
                    is_finish: '',
                    page: 1,
                    select: '',
                    bDate: '',
                    eDate: ''
                },

                //表格数据
                dataLoading: false,
                tableData: [{
                    name: 'server_rcauth_ylzc_java',
                    description: '银联智策逻辑层服务',
                    line: '风控业务线',
                    ip: '10.10.40.189',
                    machineType: 'service层_java服务_FK-java-provider',
                    environment: 'dev',
                    port: '20117',
                    status: 'online',
                    deviceType: '虚拟机'
                },{
                    name: 'server_rcauth_ylzc_java',
                    description: '银联智策逻辑层服务',
                    line: '风控业务线',
                    ip: '10.10.40.189',
                    machineType: 'service层_java服务_FK-java-provider',
                    environment: 'dev',
                    port: '20117',
                    status: 'online',
                    deviceType: '虚拟机'
                }],


                //分页
                pagination: {
                    currentPage: 1,
                    totalNum: 0
                }
            }
        },

        methods: {
            query,
            handleCurrentChange,
            handleQuery
        }
    }

</script>


<style lang="sass" rel="stylesheet/scss" scoped>

</style>
