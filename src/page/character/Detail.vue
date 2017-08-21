<template>
    <el-card class="box-card character-detail">
        <section class="card-sec">
            <header>
                <h1 class="title">角色管理</h1>
            </header>



            <div class="main">
                <el-form :model="form" label-width="150px" label-position="right">
                    <el-form-item prop="name"
                                  label="角色名称：">
                        <el-input v-model="form.name"
                                  :disabled="isModify"
                                  placeholder="请输入角色名称">

                        </el-input>
                    </el-form-item>

                    <el-form-item prop="desc"
                                  label="角色描述：">
                        <el-input v-model="form.desc"
                                  placeholder="请输入角色描述">

                        </el-input>
                    </el-form-item>

                    <el-form-item label="权限选择：">
                        <el-tree
                                ref="tree"
                                :data="treeData"
                                :props="defaultProps"
                                show-checkbox
                                node-key="id"
                                default-expand-all

                                :render-content="renderContent">
                        </el-tree>

                    </el-form-item>


                    <el-form-item>
                        <el-button @click="addRole"
                                   type="primary"

                                   size="large">保存</el-button>
                        <router-link class="el-button el-button--plain el-button--large" :to="{name:'character'}">取消</router-link>

                    </el-form-item>
                </el-form>


            </div>

        </section>

        <AddNodeDialog :info="currentNode"
                       :type="currentEditType"
                       v-model="dialogVisible" @submit="handleSubmit"
        ></AddNodeDialog>



    </el-card>
</template>


<script>


    import AddNodeDialog from 'components/character/AddNodeDialog'

    export default {
        name: 'CharacterDetail',
        components: {
            AddNodeDialog
        },
        data() {
            return {
                form: {
                    name: '',
                    desc: '',
                },
                submitDisable: false,

                treeData: [],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },


                dialogVisible: false,
                currentEditType: 'add',
                currentNode: {},
            }
        },

        computed: {
            isModify() {

                if (this.$route.params.id && this.$route.params.id  >  0 ) {
                    this.form.id = this.$route.params.id;
                    return true;
                }

                return false;
            }
        },

        methods: {
            /* 添加或修改节点 */
            handleSubmit(form) {
//                 resource/add(pid, name, uri)
                const url =  this.currentEditType === 'add' ? '/resource/add' : '/resource/update';
                /*const submitForm = this.currentEditType === 'add' ? Object.assign({},{pid: this.currentNode.id},form)
                    : Object.assign({},{id: this.currentNode.id},form); */

                this.$http.post(url, form
                ).then(({data})=>{
                    this.$notify({
                        title: '成功',
                        message: "权限资源操作成功。",
                        type: 'success'
                    });

                    this.dialogVisible = false;

                    /*添加/修改 成功*/
                    if (this.currentEditType === 'modify') {
                        Object.assign(this.currentNode, form);
                    } else {
                        this.currentNode.children.push(data);

                    }
                })

            },
            append(store, data) {
                this.dialogVisible = true;
                this.currentEditType = 'add';
                this.currentNode = data;
//                store.append({ id: id++, name: 'testtest', children: [] }, data);
            },

            modify(store, data) {
                this.dialogVisible = true;
                this.currentEditType = 'modify';
                this.currentNode = data;
//                store.remove(data);
            },



            renderContent(h, { node, data, store }) {
                return (
                <span>
                    <span>
                        <span>{node.label}</span>
                    </span>
                    <span style="float: right; margin-right: 20px">
                        <el-button type="primary" size="small" on-click={ (e) => {this.append(store, data);e.stopPropagation() }
                        }>添加</el-button>
                        <el-button type="danger" size="small" on-click={ () => this.modify(store, data) }>修改</el-button>
                    </span>
                </span>);
            },


            addRole() {
                const url = this.isModify ? '/role/modify' : '/role/add',
                    submitForm = Object.assign(this.form, {resourceIds: this.$refs.tree.getCheckedKeys() });


                this.submitDisable = true;
                this.$http.post(url, submitForm)
                    .then(({data})=>{

                    this.$notify.success({
                        title:'成功',
                        message: data
                     });
                    this.submitDisable = false;

                    this.$router.push({name:'character'});
                });

//                console.log(this.$refs.tree.getCheckedKeys());
            },


            getWholeTree() {
                const url = 'resource/getWholeTree';

                return this.$http.post(url)
                    .then(({data})=>{
                    this.treeData.push(data);
                })
            },

            /*获取角色信息*/
            getRoleInfo(){

                const url = '/role/get';
                this.$http.post(url,{
                    id: this.$route.params.id
                }).then(({data})=>{
                    this.form.name = data.name;
                    this.form.desc = data.desc;

                    this.$refs.tree.setCheckedKeys(data.resourceIds);

                })
            },
            /*获取角色权限*/
            getRoleRight() {

                const url = '/rights/list';
                this.$http.post(url,{
                    roleId: this.$route.params.id
                }).then(({data})=>{
                    const idList = data.list.map( item=> item.roleId);
                    this.$refs.tree.setCheckedKeys(idList);

                 });
            }

        },

        created() {
            this.getWholeTree()
                .then(()=>{
                    if (this.isModify) {
                        this.getRoleInfo();
//                this.getRoleRight();
                    }
                });

        }
    };
</script>


<style lang="sass" rel="stylesheet/scss" scoped>
    .character-detail {
        .el-form {
            width: 700px;
        }
    }
</style>
