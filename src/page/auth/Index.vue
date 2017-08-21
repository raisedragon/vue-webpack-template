
<template>
    <el-card class="box-card">
        <header>
            <h1 class="title">用户权限查询</h1>

            <router-link class="el-button el-button--info  new-item" :to="{name:'auth'}">
                绑定用户角色
            </router-link>
        </header>

        <section class="form">
            <el-form :inline="true" :model="form"  @keyup.enter.native="handleQuery"
                     class="demo-form-inline" id="form_query">

                <el-form-item label="用户名：" style="display: none;">
                    <el-input   placeholder="请输入英文用户名"></el-input>
                </el-form-item>

                <el-form-item label="用户名：">
                    <el-input v-model="form.account" placeholder="请输入英文用户名"></el-input>
                </el-form-item>

                <!--<el-form-item label="角色：">
                    <el-select v-model="form.roleId" clearable>
                        <el-option v-for="(item,index) in roleList"
                                   :key="index"
                                   :value="item.value"
                                   :label="item.label" >
                        </el-option>
                    </el-select>

                </el-form-item>-->

                <el-form-item>
                    <el-button type="primary" @click="handleQuery">查询</el-button>
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

                    prop="account"
                    label="用户">
            </el-table-column>

            <el-table-column
                    align="center"

                    prop="roleName"
                    label="角色名称">
            </el-table-column>

<!--            <el-table-column
                    align="center"
                    prop="auth"
                    show-overflow-tooltip
                    label="角色权限">
            </el-table-column>

            <el-table-column
                    align="center"
                    width="210"
                    prop=""
                    label="操作">
                <template scope="scope">
                    <el-button type="danger" size="small">删除</el-button>
                    <router-link :to="{name:'auth',params:{id: scope.row.id } }"
                                 class="el-button el-button&#45;&#45;info el-button&#45;&#45;small">修改</router-link>
                </template>
            </el-table-column>-->

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
</template>


<script>

    import {query,handleCurrentChange,handleQuery} from "script/queryHandle";
    import {mapState,mapGetters } from 'vuex'


    export default {
        name: 'authIndex',
        data(){
            return {


                //表单数据
                form: {
                    roleId: '',
                    account: '',

                    page: 1,
                },

                //表格数据
                dataLoading: false,

                //分页
                pagination: {
                    currentPage: 1,
                    totalNum: 0
                },

                tableData: [{
                    id: 1,
                    role: '超级管理员',
                    user: 'pikefeng',
                    auth: '我的工作台，我的应用，新建应用',
                    invalidTime: '2011-11-09 20:11',

                },{
                    id: 2,
                    role: 'OA用户',
                    user: 'nosexia',
                    auth: '我的工作台，我的应用，新建应用',
                    invalidTime: '2011-11-09 20:11',

                },{
                    id: 3,
                    user: 'willchen',
                    role: '实习生',
                    auth: '我的工作台',
                    invalidTime: '2011-11-09 20:11',

                }],
            }
        },
        computed: {
            ...mapState(['roleList']),
            ...mapGetters(['hasRoleList'])
        },

        methods: {
            getRoleList() {
                if (!this.hasRoleList) {
                    this.$store.dispatch('getRoleList')
                }
            },
            query() {
                this::query('/user/list');
            },
            handleCurrentChange,
            handleQuery
        },
        mounted() {
            this.handleQuery();
//            this.getRoleList();
        }
    }

</script>


<style lang="sass" rel="stylesheet/scss" scoped>

</style>
