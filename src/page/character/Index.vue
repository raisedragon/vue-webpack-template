<template>
    <div class="app-content">
        <el-card class="box-card">
            <header>
                <h1 class="title">角色管理</h1>
                <router-link class="el-button el-button--info new-item" :to="{name:'characterDetail'}">
                    新建角色
                </router-link>

            </header>



            <el-table
                    stripe
                    border
                    :data="tableData"
                    v-loading.body="dataLoading"
                    style="width: 100%">
                <el-table-column
                        align="center"
                        prop="name"
                        label="角色名称">
                </el-table-column>


                <el-table-column
                        align="center"
                        width="210"
                        prop=""
                        label="操作">
                    <template scope="scope">

                        <router-link :to="{name:'characterDetail',params:{id: scope.row.id } }"
                                     class="el-button el-button--info el-button--small">修改</router-link>
                    </template>
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

    export default {
        name: 'characterIndex',
        data(){
            return {
                //表单数据
                form: {

                    page: 1,

                },

                //表格数据
                dataLoading: false,
                tableData: [ ],


                //分页
                pagination: {
                    currentPage: 1,
                    totalNum: 0
                }
            }
        },



        methods: {
            query() {
                this::query('/role/list');
            },
            handleCurrentChange,
            handleQuery
        },
        mounted() {
            this.handleQuery();
        }

    }

</script>


<style lang="sass" rel="stylesheet/scss" scoped>

</style>
