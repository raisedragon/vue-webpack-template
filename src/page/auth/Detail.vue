<template>
    <el-card class="box-card auth">
        <section class="card-sec">
            <header>
                <h1 class="title">用户权限管理</h1>
            </header>

            <div class="main">
                <el-form :model="form" label-width="120px" label-position="right" style="width: 335px;">
                    <el-form-item label="用户角色：">
                        <el-select v-model="form.roleId" @change="handleRoleChange">
                            <el-option v-for="(item,index) in roleList"
                                       :key="index"
                                       :value="item.value"
                                       :label="item.label" >
                            </el-option>
                        </el-select>

                    </el-form-item>

                    <el-form-item label="用户名：">

                        <SelectUser :multiple="false" v-model="form.id"></SelectUser>


                    </el-form-item>

                </el-form>

             </div>

        </section>

        <section class="card-sec">
            <header>
                <h1 class="title">允许权限</h1>
            </header>
            <div class="main">


                <el-tree
                        ref="tree"
                        id="auth-tree"
                        :data="treeData"
                        :props="defaultProps"
                        show-checkbox
                        node-key="id"

                        default-expand-all
                >
                </el-tree>

            </div>
        </section>


        <footer class="submit">
            <el-button type="primary" size="large" @click="changeAuth">保存</el-button>
            <el-button @click="$router.go(-1)" type="plain" size="large">取消</el-button>
        </footer>

    </el-card>
</template>


<script>

    import {mapState,mapGetters } from 'vuex'
    import SelectUser from 'components/SelectUser.vue'

    export default {
        name: 'authDetail',
        components: {
            SelectUser
        },
        data() {
            return {
                /*权限列表*/


                isEdit: !!this.$route.params.id ,




                list: [],
                loading: false,

                form: {
                    roleId: '',
                    id: ''
                },






                treeData: [
                ],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },



            }
        },

        mounted() {


            this.$refs.tree.setCheckedKeys([1]);

            this.setCheckboxDisabled();

        },

        computed: {
            ...mapState(['userList','roleList']),
            ...mapGetters(['hasUserList','hasRoleList'])
        },
        methods: {


            setCheckboxDisabled(){
/*            setTimeout(()=>{
                document.querySelectorAll('#auth-tree .el-checkbox__input').forEach( (item)=>{
                    item.querySelector('input[type="checkbox"]').setAttribute('disabled','disabled');
                    item.classList.add('is-disabled');


                })
            },0)*/
            },

            handleRoleChange(id) {
                //  处理角色变化
                const url = '/role/get';

                this.$http.post(url, {
                    id
                }).then(({data})=>{
                    this.$refs.tree.setCheckedKeys(data.resourceIds);
                })
            },

            /*获取整个权限资源树*/
            getWholeTree() {
                const url = '/resource/getWholeTree';

                this.$http.post(url)
                    .then(({data})=>{
                        this.treeData.push(data);
                    })
            },

            /*获取角色权限*/
            getRoleRight() {

                const url = '/rights/list';
                this.$http.post(url,{
                    id: this.$route.params.id
                }).then(({data})=>{

                    const idList = data.list.map( item=> item.roleId);
                    this.$refs.tree.setCheckedKeys(idList);
                });
            },

            getRoleList() {
                if (!this.hasRoleList) {
                    this.$store.dispatch('getRoleList')
                }
            },




            changeAuth() {
                const url = '/user/modify';
                this.$http.post(url, this.form)
                    .then(({data})=>{
                        this.$notify({
                            title: '成功',
                            message: data,
                            type: 'success',
                            duration: 2000
                        });
                        this.$router.push({name:'checkUserAuth'})
                    })
            }


        },
        mounted() {
            this.getWholeTree();
            this.getRoleList();

        }

    }
</script>


<style lang="sass" rel="stylesheet/scss" scoped>
    .main {
        padding: 0 20px;

        .el-form {
            width: 700px;
        }

    }

    .info {
        color: #97a8be;
    }

    .card-sec {
        padding-bottom: 20px;
        .checkbox-item {
            margin-left: 0;
            margin-right: 15px;
            margin-bottom: 10px;
            width: 160px;

            .el-checkbox__label {
                font-size: 20px;

            }
        }

    }

    .user-list {
        border: 1px solid #d1dbe5;
        border-radius: 4px;

        .title {
            font-size: 22px;
        }
        .user-item {
            display: inline-block;
            transition: all 0.7s;

            font-size: 20px;
            margin-left: 20px;
            margin-bottom: 20px;
            padding: 5px 10px;
            height: auto;
        }
    }

    .submit {
        padding: 20px;
    }




    #auth-tree {
        pointer-events: none ;
        user-select: none;
    }



    .fade-enter, .fade-leave-active {
        opacity: 0;
        transform: scale(0);
    }

    .fade-leave-active {
        position: absolute;
    }
</style>
