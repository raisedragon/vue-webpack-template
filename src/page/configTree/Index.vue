<template>

    <el-card class="config-tree box-card">
        <header >
            <h1 class="title">配置树</h1>

        </header>


        <div class="main-container">
        <el-tree v-loading="loadingTree"
                 element-loading-text="拼命加载中"
                 class="tree-item"
                 ref="tree"
                 :data="treeData"
                 :props="defaultProps"
                 node-key="id"
                 @node-click="getCurrentNode"
                 :highlight-current="true"
                 current-node-key="0"
                 :default-expanded-keys="[0]"
                :expand-on-click-node="false"
                 :render-content="renderContent">
        </el-tree>

        <div class="content">
            <header style="padding: 0;font-size: 16px;margin-left: -20px;margin-top: -20px;">
                <h2>节点信息</h2>
            </header>

            <section   class="node-info">
                <div class="node-item">
                    <span>节点路径：</span>
                    <p>{{currentNode.path}}</p>
                </div>

                <div class="node-item">
                    <span>节点名称：</span>
                    <p>{{currentNode.name}}</p>
                </div>
                <div class="node-item">
                    <span>节点值：</span>
                     <pre>{{currentNode.value}}</pre>
                </div>
                <div class="node-item">
                    <span>节点描述：</span>
                    <p>{{currentNode.desc}}</p>
                </div>
                <div class="node-item">
                    <span>创建人：</span>
                    <p>{{currentNode.creator}}</p>
                </div>
                <div class="node-item">
                    <span>创建时间：</span>
                    <p>{{ currentNode.createTime | dateFormat}}</p>
                </div>
                <div class="node-item">
                    <span>修改人：</span>
                    <p>{{currentNode.modifier}}</p>
                </div>
                <div class="node-item">
                    <span>修改时间：</span>
                    <p>{{ currentNode.modifyTime | dateFormat}}</p>
                </div>
            </section>

<!--            <el-form label-width="100px" label-position="right">
                <el-form-item label="节点路径：">
                    {{currentNode.path}}
                </el-form-item>
                <el-form-item label="节点名称：">
                    {{currentNode.name}}
                </el-form-item>
                <el-form-item label="节点值：">
                    <pre>{{currentNode.value}}</pre>
                </el-form-item>
                <el-form-item label="节点描述：">
                    {{currentNode.desc}}
                </el-form-item>

                <el-form-item label="创建人：">
                    {{currentNode.creator}}
                </el-form-item>
                <el-form-item label="创建时间：">
                    {{ currentNode.createTime | dateFormat}}
                    &lt;!&ndash;{{ currentNode.createTime ? new Date(currentNode.createTime) :""}}&ndash;&gt;
                </el-form-item>
                <el-form-item label="修改人：">
                    {{currentNode.modifier}}
                </el-form-item>
                <el-form-item label="修改时间：">
                    {{ currentNode.modifyTime | dateFormat}}

                </el-form-item>
            </el-form>-->

        </div>
        </div>

        <el-dialog title="添加节点"

                   @close="handleDialogClose"
                   v-model="dialogFormVisible">
            <el-form ref="nodeForm"  :model="nodeForm" >
                <el-form-item v-if="currentFlag === 'add'" label="节点名称" prop="name" label-width="100px">
                    <el-input v-model.trim="nodeForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="节点值" prop="value" label-width="100px">
                    <el-input type="textarea" v-model.trim="nodeForm.value" :rows="5" ></el-input>
                </el-form-item>
                <el-form-item label="节点描述" prop="desc" label-width="100px">
                    <el-input v-model.trim="nodeForm.desc"  auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="dialogFormVisible = false;">取 消</el-button>
                <el-button type="primary" @click="handleAppend();">确定
                </el-button>
            </div>
        </el-dialog>

    </el-card>

</template>


<script>
    let id = 1000;

    export default {
        name: 'configTree',
        data() {
            return {
                /*树的对应信息名*/
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                treeData: [],

                loadingTree: true,

                dialogFormVisible:false ,

                nodeForm: {
                    name: '',
                    desc: '',
                    value: ''
                },

                currentNode: {
                    name: '',
                    desc: '',
                    value: ''
                },

                /*正在进行添加/修改操作的节点*/
                currentEditNode: {

                },
                currentFlag: '',


            }
        },
        methods: {
            renderContent(h, { node, data, store }) {

                return (
                    <span>
                    <span>
                    <span>{node.label}</span>
                </span>
                <span style="float: right; margin-right: 20px; ">
                    <el-button type="primary" size="small" on-click={ (e) =>
                {this.openAppendDialog(store, data,'add');e.stopPropagation() }
            }>添加子节点</el-button>
                <el-button class="modify-btn" type="warning" size="small" on-click={ (e) => {
                    this.openAppendDialog(store, data,'modify');e.stopPropagation() }
                }>修改</el-button>
                <el-button class="delete-btn" type="danger" size="small" on-click={ (e) => { this.remove(store, data);
                e.stopPropagation() } }>删除</el-button>
                </span>
                </span>);
            },
            /*关闭对话框回调*/
            handleDialogClose() {
                Object.assign(this.nodeForm,{desc:"",name:"",value:""} )
            },
            /*打开对话框*/
            openAppendDialog(store, data, flag) {

                this.dialogFormVisible = true;

                this.currentFlag = flag;  // 修改or新增
                if (flag == 'modify') {
                    let {desc,name,value} = data;
                    Object.assign(this.nodeForm,{desc,name,value} )
                }

                /*获取正在操作的节点数据到对话框*/
                this.currentEditNode = data;
//                data.children.push({ id: id++, label: '测试', children: [] });
//                store.append({ id: id++, label: 'testtest', children: [] }, data);
            },

            /*打开对话框后确定提交*/
            handleAppend() {

                let url,addNodeForm;

                /*修改提交*/
                if (this.currentFlag == 'modify') {
                    url = '/regedit/modify';
                    addNodeForm = Object.assign({},this.nodeForm, {id: this.currentEditNode.id });
                    this.$http.post(url, addNodeForm)
                        .then( (response)=>{
//                            this.currentEditNode = null;
                            /*离线更新最近操作的节点的数据*/
                            Object.assign(this.currentEditNode,this.nodeForm);
                            /*离线更新 右侧显示的数据*/
                            Object.assign(this.currentNode,addNodeForm);


                            this.dialogFormVisible = false;


                            this.$notify.success({
                                title: '成功',
                                duration: 3000,
                                message: response.data
                            });

                        });

                /*新增提交*/
                } else {
                    url = '/regedit/add';
                    addNodeForm = Object.assign({},this.nodeForm, {pid: this.currentEditNode.id });
                    this.$http.post(url, addNodeForm)
                        .then((response)=>{
                            this.currentEditNode.children.push(response.data);
                            this.dialogFormVisible = false;

                            this.$notify.success({
                                title: '成功',
                                duration: 3000,
                                message: response.data
                            });
                        })
                }

            },

            /*删除节点*/
            remove(store, data) {


                this.$confirm('此操作将删除该节点, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    return this.$http.post('/regedit/delete',{
                        id: data.id
                    })

                }).then(()=>{
                    store.remove(data);

                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });


            },

            getCurrentNode(obj,node,tree) {
                this.currentNode = Object.assign({}, obj );
            },

            getWholeTree() {
                this.$http.post('/regedit/getWholeTree')
                    .then((response)=>{
                        this.treeData.push(response.data) ;
                        this.loadingTree = false;
                    })
            },

        },



        mounted() {
            this.getWholeTree();
            this.$once( 'deleteRootBtn',(e)=>{
                document.querySelector('.modify-btn').remove();
                document.querySelector('.delete-btn').remove();
            } )
        },
        updated() {
            this.$emit('deleteRootBtn');
        }
    }
</script>


<style lang="sass" rel="stylesheet/scss"  >
    .config-tree {
        min-height:calc(100vh - 100px);

        .main-container {
            display: flex;
            justify-content: flex-start;


        }
        .el-tree {
            border: initial;
            padding: 20px;
            min-width: 540px;
            border-right: 1px solid #d1dbe5;

        }

        .content {

            margin-left:40px;
            margin-top: 20px;
            margin-right:20px;
            flex:1;
            .node-item {
                display: flex;
                justify-content: flex-start;
                margin-bottom:10px;
                font-size:16px;
                margin-top:20px;
                line-height:1.5;

                span {
                    display: inline-block;
                    width:100px;
                    text-align: right;
                    color: #48576a;;
                }

                p {
                    flex: 1;
                }
            }
        }
    }
</style>
