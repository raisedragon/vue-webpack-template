<template>
<div class="tree">
    <div class="fl">
        <ul id="tree" class="ztree" style=" overflow:auto;"></ul>
    </div>
    <div class="fr">
    <el-row>
    <el-col :span="24" class="search">
    <el-form :inline="true" :model="searchGraphForm" :rules="searchGraphFormRules" ref="searchGraphForm" class="demo-form-inline searchGraphFormVisible" v-show="searchGraphFormVisible">
    <el-form-item label="起始时间" prop="start">

    <el-date-picker v-model="searchGraphForm.start" type="datetime" placeholder="选择日期时间">
    </el-date-picker>
    </el-form-item>
    <el-form-item label="终止时间" prop="end">
    <el-date-picker v-model="searchGraphForm.end" type="datetime" placeholder="选择日期时间">
    </el-date-picker>
    </el-form-item>

    <el-form-item>
    <el-button type="primary" @click="submitsearchGraph('searchGraphForm')" >查询</el-button>
    </el-form-item>

    <el-form-item label-width="80px" >
    <el-select   v-model="echartsShowCol" @change="echartsShowColChange" >
      <el-option label="一栏" value="1"></el-option>
      <el-option label="两栏" value="2"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item>
    <el-button type="warning" class="togglehide">关闭</el-button>
    </el-form-item>
    </el-form>
    </el-col>
    <el-col :span="24" id="showCharts">
    <!-- echarts的展示 -->
    </el-col>
    <el-col :span="24" >
    <div class="block" style="text-align:right;padding-right:30px">
    <el-pagination v-show="paginationShow" ref="pagination"
    layout="prev, pager, next"
:page-size="pageSize"
@current-change="currentChange"
:total="graphsTotal">
    </el-pagination>
    </div>
    </el-col>
    </el-row>
    </div>

    <!-- 添加graph -->
    <el-dialog title="添加graph" :visible.sync="addGraphDialogVisible">
    <el-form :model="addGraphRuleForm" :rules="addGraphRules" ref="addGraphRuleForm" label-width="300px">
    <el-form-item label="graph标题：" prop="name">
    <el-input v-model.trim="addGraphRuleForm.name"></el-input>
    </el-form-item>
    <el-form-item label="Endpoints列表（多个值用“|”进行分割）：" prop="endpoints">
    <el-input v-model.trim="addGraphRuleForm.endpoints"></el-input>
    </el-form-item>
    <el-form-item label="Counters列表（多个值用“|”进行分割）：" prop="counters">
    <el-input v-model.trim="addGraphRuleForm.counters"></el-input>
    </el-form-item>
    <el-form-item label="默认时间跨度：" prop="timespan">
    <el-select v-model="addGraphRuleForm.timespan" placeholder="请选择时间跨度">
    <el-option label="1小时" value="3600"></el-option>
    <el-option label="6小时" value="21600"></el-option>
    <el-option label="12小时" value="43200"></el-option>
    <el-option label="1天" value="86400"></el-option>
    <el-option label="7天" value="604800"></el-option>
    <el-option label="1月" value="2592000"></el-option>
    <el-option label="1年" value="31536000"></el-option>
    </el-select>
    </el-form-item>

    <el-form-item label="视角" prop="graphType">
    <el-select v-model="addGraphRuleForm.graphType" placeholder="选择视角">
    <el-option label="endpoint" value="h"></el-option>
    <el-option label="counter" value="k"></el-option>
    </el-select>
    </el-form-item>

    <el-form-item label-width="300px">
    <el-button @click="resetForm('addGraphRuleForm')">取消</el-button>
    <el-button type="primary" @click="submitAddGraph('addGraphRuleForm')">立即添加</el-button>
    </el-form-item>
    </el-form>
    </el-dialog>
    <!-- 添加screen -->
    <el-dialog title="添加文件夹" :visible.sync="addScreenDialogVisible">
    <el-form :model="addScreenRuleForm" :rules="addScreenRules" ref="addScreenRuleForm" label-width="150px">
    <el-form-item label="文件夹标题：" prop="name">
    <el-input v-model.trim="addScreenRuleForm.name"></el-input>
    </el-form-item>
    <el-form-item label-width="150px">
    <el-button @click="resetForm('addScreenRuleForm')">取消</el-button>
    <el-button type="primary" @click="submitAddScreen('addScreenRuleForm')">立即添加</el-button>
    </el-form-item>
    </el-form>
    </el-dialog>


    <!-- 查询相关组 -->
    <el-dialog title="相关组" :visible.sync="screenReTeamVisible" class="reTeam" @close="cancelReTeam">
    <!-- <el-input v-model.trim="switchSearch" placeholder="请输入ip"></el-input> -->
        <el-row>
            <el-col :span="24" style="padding:10px;border:1px solid #EEF1F6;min-height:46px">
                <el-tag  :key="tag"  v-for="tag in reTeamList" @close="handleTagClose(tag)" :closable="true"  :close-transition="false">{{tag.name}}</el-tag>
            </el-col>
        </el-row>

<el-form>
  <el-form-item  style="margin-top:10px">
    <el-input style="width:400px"  placeholder="模糊搜索" @change="dimSearch" @keyup.enter.prevent v-model="dimSearchKey"></el-input>
  </el-form-item>
  </el-form>
    <el-table  :data="teamListData" tooltip-effect="dark"  style="margin-top:10px;" @selection-change="tempTeamListChange">
    <el-table-column type="selection" width="55">
    </el-table-column>
    <el-table-column prop="name" label="相关组">
    </el-table-column>
    <el-table-column prop="strMembers" label="组成员" :show-overflow-tooltip="true">
    </el-table-column>
    </el-table>
    <div class="block" style="text-align:right;padding-top:10px">
    <el-pagination
    ref="reTeamPagination"
    layout="prev, pager, next"
    @current-change="teamCurrentChange"
    :total="allTeamListCount">
  </el-pagination>
  </div>
     <div style="margin-top: 20px;padding-left:50px">
    <el-button @click="cancelReTeam">关闭</el-button>
    <el-button type="primary" @click="submitReTeam()">确定</el-button>
    </div>
    </el-dialog>

    <!-- 添加交换机 -->
    <el-dialog title="添加交换机" :visible.sync="addSwitchDialogVisible" size="tiny">
    <el-form   >
    <el-form-item >
    <el-input v-model.trim="switchSearch" placeholder="请输入ip" @change="filterSwitchIp(switchSearch)"></el-input>
    </el-form-item>
    </el-form>
    <el-table ref="multipleTable" :data="switchIp" tooltip-effect="dark" height="350" style="width:100%;max-height:350px" @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="55">
    </el-table-column>

    <el-table-column prop="ip" label="交换机IP">
    </el-table-column>

    </el-table>
    <div style="margin-top: 20px">
    <el-button @click="cancelSelection()">取消选择</el-button>
    <el-button type="primary" @click="submitSwitchIp()">确定选择</el-button>
    </div>
    </el-dialog>
     <!-- ping配置 -->
    <el-dialog title="机房配置" :visible.sync="pingVisible" size="tiny">
    
    <el-table ref="pingTable" :data="pingIdcId" tooltip-effect="dark"   @selection-change="pingIdcIdChange">
    <el-table-column type="selection" width="55">
    </el-table-column>

    <el-table-column prop="name" label="机房名称">
    </el-table-column>
    <el-table-column prop="city" label="城市">
    </el-table-column>


    </el-table>
    <div style="margin-top: 20px">
    <el-button @click="pingVisible=false">取消选择</el-button>
    <el-button type="primary" @click="pingSubmit">确定选择</el-button>
    </div>
    </el-dialog>
    <!-- 编辑graph -->
    <el-dialog title="编辑graph" :visible.sync="editGraphDialogVisible">
    <el-form :model="editGraphRuleForm" :rules="editGraphRules" ref="editGraphRuleForm" label-width="300px">
    <el-form-item label="graph标题：" prop="name">
    <el-input v-model.trim="editGraphRuleForm.name"></el-input>
    </el-form-item>
    <el-form-item label="Endpoints列表（多个值用“|”进行分割）：" prop="endpoints">
    <el-input v-model.trim="editGraphRuleForm.endpoints"></el-input>
    </el-form-item>
    <el-form-item label="Counters列表（多个值用“|”进行分割）：" prop="counters">
    <el-input v-model.trim="editGraphRuleForm.counters"></el-input>
    </el-form-item>
    <el-form-item label="默认时间跨度：" prop="timespan">
    <el-select v-model="editGraphRuleForm.timespan" placeholder="请选择时间跨度">
    <el-option label="1小时" value="3600"></el-option>
    <el-option label="6小时" value="21600"></el-option>
    <el-option label="12小时" value="43200"></el-option>
    <el-option label="1天" value="86400"></el-option>
    <el-option label="7天" value="604800"></el-option>
    <el-option label="1月" value="2592000"></el-option>
    <el-option label="1年" value="31536000"></el-option>
    </el-select>
    </el-form-item>

    <el-form-item label="视角" prop="graphType">
    <el-select v-model="editGraphRuleForm.graphType" placeholder="选择视角">
    <el-option label="endpoint" value="h"></el-option>
    <el-option label="counter" value="k"></el-option>
    </el-select>
    </el-form-item>

    <el-form-item label-width="300px">
    <el-button @click="resetForm('editGraphRuleForm')">取消</el-button>
    <el-button type="primary" @click="submitEditGraph('editGraphRuleForm')">确认修改</el-button>
    </el-form-item>
    </el-form>
    </el-dialog>
    <!-- 粘贴graph -->
    <el-dialog title="粘贴graph" :visible.sync="pasteGraphDialogVisible">
    <el-form :model="pasteGraphRuleForm" :rules="pasteGraphRules" ref="pasteGraphRuleForm" label-width="300px">
    <el-form-item label="graph标题：" prop="name">
    <el-input v-model.trim="pasteGraphRuleForm.name"></el-input>
    </el-form-item>
    <el-form-item label="Endpoints列表（多个值用“|”进行分割）：" prop="endpoints">
    <el-input v-model.trim="pasteGraphRuleForm.endpoints"></el-input>
    </el-form-item>
    <el-form-item label="Counters列表（多个值用“|”进行分割）：" prop="counters">
    <el-input v-model.trim="pasteGraphRuleForm.counters"></el-input>
    </el-form-item>
    <el-form-item label="默认时间跨度：" prop="timespan">
    <el-select v-model="pasteGraphRuleForm.timespan" placeholder="请选择时间跨度">
    <el-option label="1小时" value="3600"></el-option>
    <el-option label="6小时" value="21600"></el-option>
    <el-option label="12小时" value="43200"></el-option>
    <el-option label="1天" value="86400"></el-option>
    <el-option label="7天" value="604800"></el-option>
    <el-option label="1月" value="2592000"></el-option>
    <el-option label="1年" value="31536000"></el-option>
    </el-select>
    </el-form-item>
    <el-form-item label="视角" prop="graphType">
    <el-select v-model="pasteGraphRuleForm.graphType" placeholder="选择视角">
    <el-option label="endpoint" value="h"></el-option>
    <el-option label="counter" value="k"></el-option>
    </el-select>
    </el-form-item>
    <el-form-item label-width="300px">
    <el-button @click="resetForm('pasteGraphRuleForm')">取消</el-button>
    <el-button type="primary" @click="submitAddGraph('pasteGraphRuleForm')">立即添加</el-button>
    </el-form-item>
    </el-form>
    </el-dialog>
    <!-- 编辑screen -->
    <el-dialog title="编辑screen" :visible.sync="editScreenDialogVisible">
    <el-form :model="editScreenRuleForm" :rules="editScreenRules" ref="editScreenRuleForm" label-width="300px">
    <el-form-item label="旧的的screen标题：">
    <el-input v-model.trim="editScreenRuleForm.oldName"></el-input>
    </el-form-item>
    <el-form-item label="新的screen标题：" prop="name">
    <el-input v-model.trim="editScreenRuleForm.name"></el-input>
    </el-form-item>
    <el-form-item label-width="300px">
    <el-button @click="resetForm('editScreenRuleForm')">取消</el-button>
    <el-button type="primary" @click="submitEditScreen('editScreenRuleForm')">确认修改</el-button>
    </el-form-item>
    </el-form>
    </el-dialog>
    <!-- 根元素 -->
    </div>

    </template>
    <script>

import echarts from 'echarts/lib/echarts';
//  引入线形图
import 'echarts/lib/chart/line';
//  引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/dataZoom';
import 'echarts/lib/component/toolbox';
import 'echarts/lib/component/legend';

import  "script/jquery.ztree.all.js"
import  "style/zTreeStyle.css"
import qs from 'querystring'
import axios from 'axios'
export default {
    data() {
        return{
            pingVisible:false,
            pingIdcId:[],
            pingSelections:[],
            dimSearchKey:"",//模糊查询关键字
            dimSearchTimer:'',
            screenReTeamVisible:false,
            tempTeamList:[],
            reTeamTags:[],
            teamListData:[],
            allTeamListCount:0,
            echartsShowCol:"1",
            echartsColor:['#c23531','#F8BF00', '#2DED00', '#11BFE1', '#710B9D','#0800AA',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],//颜色池
            intervalTimer:"",
            tempEchartsEl:[],
            tempEchartsInfo:[],
            paginationShow:false,
            pageSize:10,//
            allGraphs:[],
            graphsTotal:1,
            switchSearch:'',
            multipleSelection:[],
            allSwitchIp:[],
            switchIp:[],
            addSwitchDialogVisible:false,
            searchGraphFormVisible:false,
            searchGraphForm:{
                start:"",
                end:"",
                view:"endpoint"
            },
            searchGraphFormRules:{
                start: [
                    { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
                ],
                end: [
                    { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
                ]
            },
            addGraphDialogVisible: false,
            addGraphRuleForm: {
                name: '',
                timespan: '3600',
                endpoints: '',
                counters: '',
                screenId:'',
                graphType:'h'
            },
            addGraphRules: {
                name: [
                    { required: true, message: '请输入graph', trigger: 'blur' },
                ],
                timespan: [
                    { required: true, message: '请选择时间跨度', trigger: 'change' }
                ],
                endpoints: [
                    { required: true, message: '请输入endpoints', trigger: 'blur' }
                ],
                counters: [
                    { required: true, message: '请填写counters', trigger: 'blur' }
                ]
            },
            pasteGraphDialogVisible: false,
            pasteGraphRuleForm: {
                name: '',
                timespan: '',
                endpoints: '',
                counters: '',
                screenId:'',
                graphType:'',
            },
            pasteGraphRules: {
                name: [
                    { required: true, message: '请输入graph', trigger: 'blur' },
                ],
                timespan: [
                    { required: true, message: '请选择时间跨度', trigger: 'change' }
                ],
                endpoints: [
                    { required: true, message: '请输入endpoints', trigger: 'blur' }
                ],
                counters: [
                    { required: true, message: '请填写counters', trigger: 'blur' }
                ]
            },
            addScreenDialogVisible:false,
            addScreenRuleForm: {
                name: '',
                createUser: this.$store.state.user,
                pid:''
            },
            addScreenRules: {
                name: [
                    { required: true, message: '请输入screen', trigger: 'blur' },
                ]
            },
            editScreenDialogVisible:false,
            editScreenRuleForm: {
                oldName:'',
                name: '',
                id: ''
            },
            editScreenRules: {
                name: [
                    { required: true, message: '请新的screen标题', trigger: 'blur' },
                ]
            },
            editGraphDialogVisible:false,
            editGraphRuleForm: {
                name: '',
                id: '',
                endpoints:'',
                counters:'',
                timespan:'',
                screenId:'',
                graphType:'h'
            },
            editGraphRules: {
                name: [
                    { required: true, message: '请新的screen标题', trigger: 'blur' },
                ]
            },
            tempChartsOpt:[],
            zNodes:"",
            treeObj:'',
            tempNode:'',
            tempClickGraphNode:'',
            tempClickScreenNode:'',
            tempClickNode:'',
            copyNode:'',
            ztreeSetting:{
                async:{
                    enable :true,
                    url:"http://monitor.oa.fenqile.com/api/queryGraphAndScreen",
                    autoParam:["id=screenId"],
                    type:"get",
                    dataFilter: this.ztreeFilter
                },
                view: {
                    addHoverDom: this.addHoverDom,
                    removeHoverDom: this.removeHoverDom,
                    selectedMulti: false
                },
                edit: {
                    enable: true,
                    editNameSelectAll: true,
                    showRemoveBtn: false,
                    showRemoveBtn: this.showRemoveBtn,
                    removeTitle:"删除节点",
                    renameTitle:"编辑节点",
                    drag:{
                        isCopy:false,
                        prev:false,
                        next:false
                    }

                },
                data: {
                    simpleData: {
                        enable: true,
                        pIdKey: "pid"
                    }
                },
                callback: {
                    onClick: this.ztreeClick,
                    onExpand:this.ztreeExpand,
                    beforeEditName:this.beforeEditName,
                    beforeRemove:this.beforeRemove,
                    beforeDrop:this.ztreeBeforeDrop,
                    onDrop:this.ztreeOnDrop
                }
            }
        }
    },
computed: {
    reTeamList(){
        return this.reTeamTags.concat(this.tempTeamList)
    }
},
    methods: {
        dimSearch(){//模糊搜素
            clearTimeout(this.dimSearchTimer);
           this.dimSearchTimer= setTimeout(()=>{
             this.$http({url:"/api/getTeamList",params:{page:1,limit:10,query:this.dimSearchKey}}).then((res)=>{
                this.$refs.reTeamPagination.internalCurrentPage = 1
                // this.$refs['pagination'].;
                this.allTeamListCount=res.data.total;
                this.teamListData=res.data.list;
                this.teamListData.forEach((item,index)=>{
                    let arrMembers=[],strMembers='';
                    item.memberList.forEach((key,i)=>{
                        arrMembers.push(key.name)
                    })
                    item.strMembers=arrMembers.join(",")
                })

            })
           },500)
        },
        submitReTeam(){
            //更新操作
            let arr=[]
           this.reTeamList.forEach((item,index)=>{
            arr.push(item.id)
           })
            this.$http({method:"post",url:"/api/updateScreenRelTeam",data:{screenId:this.tempNode.id,teamIds:arr.join("|")}}).then((res)=>{
                if (res.code===0) {
                      this.$message({
                    type: 'success',
                    message: '组更新成功'
                });
                }

            })

        },
        cancelReTeam(){
             this.$refs.reTeamPagination.internalCurrentPage = 1;
             this.dimSearchKey="",
            this.screenReTeamVisible=false;
            this.reTeamTags=[];
            this.tempTeamList=[];
        },
        teamCurrentChange(val){
            this.tempTeamList.forEach((item)=>{
                let has=false
                this.reTeamTags.forEach((key)=>{
                    if (key.id===item.id) {
                        has=true
                        return;
                    }
                })
                if (!has) {
                this.reTeamTags.push(item)
                }
            })
              this.$http({url:"/api/getTeamList",params:{page:val,limit:10,query:this.dimSearchKey}}).then((res)=>{
                this.allTeamListCount=res.data.total;
                this.teamListData=res.data.list;
                this.teamListData.forEach((item,index)=>{
                    let arrMembers=[],strMembers='';
                    item.memberList.forEach((key,i)=>{
                        arrMembers.push(key.name)
                    })
                    item.strMembers=arrMembers.join(",")
                })

            })
        },
         handleTagClose(tag) {
            if (this.tempTeamList.indexOf(tag)>-1) {
                this.tempTeamList.splice(this.tempTeamList.indexOf(tag), 1);
            }else{
                this.reTeamTags.splice(this.reTeamTags.indexOf(tag), 1);
            }

      },
        tempTeamListChange(val){
            this.tempTeamList=val;
            //消除分页面切换时的重复元素
            val.forEach((item)=>{
                this.reTeamTags.forEach((k,i)=>{
                    if (k.id===item.id) {
                        this.reTeamTags.splice(i, 1);
                    }
                })
            })
        },
        echartsShowColChange(val){
            if (val=="1") {
                 $(".fluxTable").css({"margin-left":"80px"})
            }else if(val=="2"){
            $(".fluxTable").css({"margin-left":"10px"})
            }

            let px=100/val;
            $(".pflux").css({"width":px+"%"});
            this.tempEchartsInfo.forEach((item,index)=>{
                echarts.init(item.el).resize()
            })
        },
        currentChange(currentPage){

            this.$refs['searchGraphForm'].resetFields();
            this.$http({method:"get",url:"/api/queryGraphAndScreen",params:{screenId:this.tempClickScreenNode.id}}).then((res)=>{
                let resdata=res.data,sortData=[],index=[],items=[];
            for (var i = 0; i < resdata.length; i++) {
                resdata[i].name=resdata[i].title;
                index.push(resdata[i].name.split(",",1)[0].slice(8))
                sortData.push({index:resdata[i].name.split(",",1)[0].slice(8),item:resdata[i]})
            }
            index.sort((a,b)=>{return a-b})
            index.forEach((item,index)=>{
                sortData.forEach((k,i)=>{
                if (k["index"]==item) {
                items.push(k["item"])
            }
        })
        })
            resdata=items
            //处理图形显示
            $("#showCharts").html("")
            this.tempEchartsInfo=[];
            let start=(currentPage-1)*10,end=currentPage*10>resdata.length?resdata.length:currentPage*10;
            for (var j = start; j < end; j++) {
                this.showEcharts(resdata[j])
            };
            this.intervalUpdate()
        })
        },
        filterSwitchIp(val){
            var len = this.allSwitchIp.length;
            var arr = [];
            this.switchIp=[];
            if (val) {
                var reg = new RegExp(val);
                for(var i=0;i<len;i++){
                    //如果字符串中不包含目标字符会返回-1
                    if(this.allSwitchIp[i].match(reg)){
                        arr.push(this.allSwitchIp[i]);
                    }
                }
            }else{
                arr=this.allSwitchIp
            }
            for (var i = 0; i <  arr.length; i++) {
                this.switchIp.push({ip: arr[i]})
            }
        },
        pingIdcIdChange(val){
            this.pingSelections=val;
            
        },
        pingSubmit(){
            for (var i = 0; i < this.pingSelections.length; i++) {
                this.$http.get("/v1/ping/addPingGraph",{params:{idcId:this.pingSelections[i].id,
                            screenId:this.tempNode.id,
                            createUser:this.$store.state.user
                        }}).then((res)=>{
                            this.pingVisible=false
                            // console.log( $("#"+this.tempNode.tId+"_span"))
                            $("#"+this.tempNode.tId+"_span").trigger("click");
                            this.treeObj.reAsyncChildNodes(this.tempNode,"refresh")
                        })
                     }

              
        },
        submitSwitchIp(){
            for (var i = 0; i < this.multipleSelection.length; i++) {
                this.$http({method:'post',
                    url:'/api/addSwitchPortGraph',
                    data:{switchName:this.multipleSelection[i].ip,
                        pid:this.tempNode.id,
                        createUser:this.$store.state.user
                    }}).then((res)=>{
                    $("#"+this.tempNode.tId+"_span").trigger("click")
                this.$message({
                    type: 'success',
                    message: "交换机添加成功"
                });
                this.treeObj.reAsyncChildNodes(this.tempNode,"refresh")
                this.cancelSelection()
            }).catch(() => {
                    this.$message({
                    type: 'error',
                    message: '交换机添加失败'
                });
            })
            }
        },
        cancelSelection() {
            this.$refs.multipleTable.clearSelection();
            this.addSwitchDialogVisible=false;
            this.switchSearch=""
        },
        handleSelectionChange(val) {//交换机多选处理
            this.multipleSelection = val;
        },
        setTreeObj(){
            this.treeObj=$.fn.zTree.getZTreeObj("tree");
        },
        submitAddScreen(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$http({method:'post',url:'/api/addScreen',data:this[formName]}).then( (res)=> {
                        //此处需要返回节点信息
                        this.treeObj.reAsyncChildNodes(this.tempNode, "refresh")
                    this.resetForm(formName)
                    this.$message({
                        type: 'success',
                        message: 'screen添加成功'
                    });
                }).catch(()=>{
                        this.$message({
                        type: 'error',
                        message: 'screen添加失败'
                    });
                })
                } else {
                    return false;
        }
        });
        },
        submitAddGraph(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$http({method:'post',url:'/api/addGraph',data:this[formName]}).then((res)=> {
                        this.treeObj.reAsyncChildNodes(this.tempNode, "refresh")
                    this.resetForm(formName)
                    this.$message({
                        type: 'success',
                        message: 'graph添加成功'
                    });
                }).catch(()=>{
                        this.$message({
                        type: 'error',
                        message: 'graph添加失败'
                    });
                })
                } else {
                    return false;
        }
        });
        },
        submitEditScreen(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$http({method:'post',url:'/api/updateScreen',data:this[formName]}).then((res)=> {
                        this.tempNode.name=this[formName].name;
                    this.treeObj.updateNode(this.tempNode);
                    this.resetForm(formName)
                    this.$message({
                        type: 'success',
                        message: 'screen更新成功'
                    });
                }).catch(() => {
                        this.$message({
                        type: 'error',
                        message: 'screen更新失败'
                    });
                })

                }
            });
        },
        submitEditGraph(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$http({method:'post',url:'/api/updateGraph',data:this[formName]}).then((res)=> {
                        this.tempNode.name=this.editGraphRuleForm.name
                    this.tempNode.hosts=this.editGraphRuleForm.endpoints
                    this.tempNode.timespan=Number(this.editGraphRuleForm.timespan)
                    this.tempNode.counters=this.editGraphRuleForm.counters
                    this.tempNode.graphType=this.editGraphRuleForm.graphType
                    this.treeObj.updateNode(this.tempNode);
                    $("#"+this.tempNode.tId+"_span").trigger("click")
                    this.resetForm(formName)
                    $("#showCharts").html("")
                    this.tempEchartsInfo=[];
                    this.showEcharts(this.tempNode);
                    this.intervalUpdate()
                    this.$message({
                        type: 'success',
                        message: 'graph更新成功'
                    });

                }).catch(() => {
                        this.$message({
                        type: 'error',
                        message: 'graph更新失败'
                    });
                })

                }
            });
        },

        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.addGraphDialogVisible=false
            this.addScreenDialogVisible=false
            this.editScreenDialogVisible=false
            this.editGraphDialogVisible=false
            this.pasteGraphDialogVisible=false
        },

        sliceArray(arr,num){//将数组按指定个数分割,并以"|"做分割
            let newArr=[]
            for (var i = 0; i < arr.length; i+=num) {
                if(arr.length>=(i+num)) {
                    newArr.push(arr.slice(i,i+num).join("|"))
                }else{
                    newArr.push(arr.slice(i).join("|"))
                }
            }
            return newArr;
        },
        beforeRemove(treeId, treeNode){
            if (treeNode.isParent) {
                this.$confirm('此操作将永久删除该screen, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http({method:"post",url:"/api/deleteScreen",data:{id:treeNode.id}}).then((res)=>{
                    let parentNode=treeNode.getParentNode()
                    this.treeObj.removeNode(treeNode);
                parentNode.isParent=true
                this.treeObj.updateNode(parentNode);
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
            })
            }).catch(() => {
                    this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
            }else{
                this.$confirm('此操作将永久删除该graph, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http({method:"post",url:"/api/deleteGraph",data:{id:treeNode.id}}).then((res)=>{
                    //删除页面节点,当为最后一个节点时删除后依然保持为文件夹形式
                    let parentNode=treeNode.getParentNode()
                    this.treeObj.removeNode(treeNode);
                parentNode.isParent=true
                this.treeObj.updateNode(parentNode);
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
            })
            }).catch(() => {
                    this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
            }
            return false;
        },

        //查询时间更改提交事件
        submitsearchGraph(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let end=parseInt(this.searchGraphForm.end/1000)
                    let start=parseInt(this.searchGraphForm.start/1000)
                    this.reDrawEcharts(this.tempEchartsInfo,start,end)
                    //清楚定时器
                    clearInterval(this.intervalTimer)
                }
            });
        },
        reDrawEcharts(EchartsInfo,start,end){
            for (var i = 0; i < EchartsInfo.length; i++) {
                let data={
                    endpoints:EchartsInfo[i].info.endpoints,
                    counters:EchartsInfo[i].info.counters,
                    end:end,
                    start:start,
                    isCut:false,
                    num:i};
                let tempData=EchartsInfo[i].info
                this.$http({
                    method:"post",
                    url:'/data/query',
                    isCut:false,
                    data:data
                }).then((res)=>{
                    let num= qs.parse(res.config.data).num;
                let series=[];
                for (var j = 0; j < res.data.data.series.length; j++) {
                    let dataY=[],dataYmax=0,unit="B";
                    if (res.data.data.series[j].data !== null) {
                        for (var u = 0; u < res.data.data.series[j].data.length; u++) {
                            //将返回的时间戳由秒换成毫秒
                            res.data.data.series[j].data[u][0]=res.data.data.series[j].data[u][0]*1000;
                            dataY.push(res.data.data.series[j].data[u][1])
                        }
                        //获取最大值设置y坐标单位
                        dataYmax=Math.max(...dataY)
                        if (dataYmax/(1024*1024)>1) {
                            for (var u = 0; u < res.data.data.series[j].data.length; u++) {
                                res.data.data.series[j].data[u][1]=(res.data.data.series[j].data[u][1]/(1024*1024)).toFixed(2);
                            }
                            unit="MB"
                        }else if(dataYmax/1024>1){
                            for (var u = 0; u < res.data.data.series[j].data.length; u++) {
                                res.data.data.series[j].data[u][1]=(res.data.data.series[j].data[u][1]/1024).toFixed(2);
                            }
                            unit="KB"
                        }
                    }

                    series.push({data: res.data.data.series[j].data,name: res.data.data.series[j].counter,type: "line"});
                };
                let chart=echarts.init(EchartsInfo[num].el);
                chart.setOption({series:series});
                //最大值,最小值,平均值更新
                this.zoomFn(0,100,chart,$(EchartsInfo[num].el))
            })
            }
        },
        intervalUpdate(){
            if (this.intervalTimer) {clearInterval(this.intervalTimer)}
            let timer=setInterval(()=>{
                    if (this.tempEchartsInfo.length===0) {return}
            //计算时间间隔
            let interval=this.tempEchartsInfo[0].info.end-this.tempEchartsInfo[0].info.start
            let date=new Date()-0;

            let end=date;
            let start=(end-interval*1000);
            end=parseInt(end/1000)
            start=parseInt(start/1000)
            this.reDrawEcharts(this.tempEchartsInfo,start,end)
        },10000)
            //将定时器储存,以便日期查询时清除
            this.intervalTimer=timer
        },
        ztreeBeforeDrop(treeId, treeNodes, targetNode, moveType){
            //根节点||非文件夹类型
             return !((targetNode == null || (moveType != "inner" && !targetNode.parentTId))||!targetNode.isParent);
        },
        ztreeOnDrop(event, treeId, treeNodes, targetNode, moveType){
            if (treeNodes[0].isParent) {
                this.$http({method:'post',url:'/api/updateScreen',data:{id:treeNodes[0].id,pid:targetNode.id}}).then((res)=>{})
            }else{
                 this.$http({method:'post',url:'/api/updateGraph',data:{id:treeNodes[0].id,screenId:targetNode.id}}).then((res)=>{})
            }
        },
        ztreeClick(event, treeId, treeNode, clickFlag){
            this.echartsShowCol="1";
            this.$refs['searchGraphForm'].resetFields();//重置日期查询
            if (!treeNode.isParent) {
                this.paginationShow=false;
                if (this.tempClickNode.id!==treeNode.id) {//避免相通graph重复点击多次渲染
                    $("#showCharts").html("")
                    this.tempEchartsInfo=[];
                    this.showEcharts(treeNode)
                    // 每个一分钟重绘
                    this.intervalUpdate()

                    //重绘结束
                    this.searchGraphFormVisible=true;
                    this.tempClickGraphNode=treeNode;
                };
                this.tempClickNodeClass="graph";
            }else{
                this.paginationShow=false;
                    if (this.$refs['pagination'].internalCurrentPage) {
                         this.$refs['pagination'].internalCurrentPage = 1;
                    }
                if(treeNode.children){
                    this.searchGraphFormVisible=true;
                    this.paginationShow=false;
                    if (this.tempClickNode.id!==treeNode.id) {
                        $("#showCharts").html("");
                        this.tempEchartsInfo=[];
                        for (var i = 0; i < treeNode.children.length; i++) {
                            if(!treeNode.children[i].isParent){
                                if (treeNode.getParentNode().name) {
                                if (treeNode.getParentNode().name=="交换机端口") {
                                    if(i<this.pageSize){//this.pageSize默认为10
                                        this.showEcharts(treeNode.children[i]);
                                    }else{
                                        this.graphsTotal=treeNode.children.length;
                                        this.paginationShow=true;
                                        break;}
                                }else{
                                    this.paginationShow=false;
                                    this.showEcharts(treeNode.children[i])
                                }
                            }
                            }
                        }
                        this.intervalUpdate()
                    }else{
                        if (treeNode.getParentNode()) {
                        if (treeNode.getParentNode().name&&treeNode.getParentNode().name=="交换机端口") {
                            this.paginationShow=true;
                        }
                        }
                    }
                }else{
                    this.treeObj.reAsyncChildNodes(treeNode,"refresh",true)
                }
                this.tempClickNodeClass="screen";
                this.tempClickScreenNode=treeNode;
            }
            this.tempClickNode=treeNode
        },
        // 以Endpoint和counter视角显示
        showEcharts(treeNode,s,e){//s,e为起始毫秒时间戳
            if (treeNode.graphType=="h") {this.showEndpointEcharts(treeNode,s,e)}else {
                this.showCounterEcharts(treeNode,s,e)
            }
        },
        getChartOption(legendData){
            return {
                title : {
                    text: '',
                    subtext: '',
                    textStyle: {
                        fontSize: 4,
                        color:"#fff"
                    }
                },
                color:this.echartsColor,        
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        crossStyle: {
                            color: '#999'
                        }
                    }
                },
                 axisPointer: {
                    label: {
                     backgroundColor: '#f00'
                    }
                },
                toolbox: {
                    feature: {
                        dataZoom: {show: true,yAxisIndex:false},
                        restore: {show: true},
                        saveAsImage: {show: true}
                    },
                    iconStyle:{
                        normal:{
                            borderColor:"#fff"
                        }
                    }
                },
                // grid:{top:'20%'},
                legend: {width:"80%",data:legendData,textStyle:{color:"#fff"}},
                xAxis: {
                        type: 'time',
                        axisLine:{
                            lineStyle:{
                               color:'#fff'
                            }
                        }
                    },
                yAxis:{
                    type: 'value',
                    name: '数值',
                    axisLine:{

                    lineStyle:{color:'#ccc'}
                    },
                    axisLabel:{
                        textStyle:{
                            color:'#fff'
                        }
                    }
                },
                 series:[]
            }
            // Endpoint视角显示
        },
        showEndpointEcharts(treeNode,s,e){//graph节点,s,e为起始毫秒时间戳
            let endpoints=treeNode.hosts;
            let counters=treeNode.counters.split("|");
            let epArr=endpoints.split("|");
            let el="";
            let date=new Date()-0;

            let end=e||date;
            let start=s||(end-treeNode.timespan*1000);
            end=parseInt(end/1000)
            start=parseInt(start/1000)
            //添加echart容器
            for (var i = 0; i < epArr.length; i++) {
                el+='<div class="pflux" style="width:'+100/this.echartsShowCol+'%" ><div class="flux flux'+treeNode.id+'"></div><table class="fluxTable"  cellspacing="0"></table></div>'
            }
            $("#showCharts").append(el)
            //设置查询的密度
            let newCounters= this.sliceArray(counters,2)
            let legendData=counters;
            for (var k = 0; k < epArr.length; k++) {
                let option=this.getChartOption(legendData)
                for (var i = 0; i < newCounters.length; i++) {
                    this.$http({
                        method:"post",
                        url:'/data/query',
                        data:{
                            endpoints: epArr[k],
                            counters:newCounters[i],
                            start:start,
                            end:end,
                            isCut:false,
                            num:k
                        }
                    }).then((res)=>{

                        let num= qs.parse(res.config.data).num;
                    let endpoints= qs.parse(res.config.data).endpoints;
                    //为一分钟重绘做映射关系
                    this.tempEchartsInfo.push({el:$(".flux"+treeNode.id)[num],info:qs.parse(res.config.data)})
                    // 设置每个series类型
                    for (var j = 0; j < res.data.data.series.length; j++) {
                        let dataY=[],dataYmax=0,unit="B";
                        if (res.data.data.series[j].data !== null) {
                            for (var u = 0; u < res.data.data.series[j].data.length; u++) {
                                //将返回的时间戳由秒换成毫秒
                                res.data.data.series[j].data[u][0]=res.data.data.series[j].data[u][0]*1000;
                                dataY.push(res.data.data.series[j].data[u][1])
                            }
                            //获取最大值设置y坐标单位
                            dataYmax=Math.max(...dataY)
                            if (dataYmax/(1024*1024)>1) {
                                for (var u = 0; u < res.data.data.series[j].data.length; u++) {
                                    res.data.data.series[j].data[u][1]=(res.data.data.series[j].data[u][1]/(1024*1024)).toFixed(2);
                                }
                                unit="MB"
                            }else if(dataYmax/1024>1){
                                for (var u = 0; u < res.data.data.series[j].data.length; u++) {
                                    res.data.data.series[j].data[u][1]=(res.data.data.series[j].data[u][1]/1024).toFixed(2);
                                }
                                unit="KB"
                            }
                        }
                        
                        // option.yAxis=[{type: 'value',name: '数值',lineStyle:{color:'#fff'},axisLabel:{formatter: '{value}'+unit,textStyle:{color:'#fff'}}}]
                        option.yAxis.axisLabel.formatter='{value}'+unit;
                        option.series.push({data: res.data.data.series[j].data,name: res.data.data.series[j].counter,type: "line"});
                    };

                    var echart=echarts.init($(".flux"+treeNode.id)[num])
                    //更改每个echart头部名称
                    option.title.text=endpoints
                    echart.setOption(option)
                    this.zoomFn(0,100,echart,$(".flux"+treeNode.id).eq(num))
                    //声明图形缩放函数

                    echart.on("dataZoom",(e)=>{
                        let dataArr=echart.getOption().series[0].data
                        let start=dataArr[0][0]
                        let end=dataArr[dataArr.length-1][0]
                        let s=e.batch[e.batch.length-1].start||(parseInt(e.batch[0].startValue)-start)/(end-start)*100||0
                        let en=e.batch[e.batch.length-1].end||(1-(end-parseInt(e.batch[0].endValue))/(end-start))*100
                    this.zoomFn(s,en,echart,$(".flux"+treeNode.id).eq(num))

                })
                })
                }
                this.tempChartsOpt.push(option)
            }
        },
        zoomFn(s,e,echart,el){
            let data= echart.getOption().series
            if (!s) {s=0}
            let trs=`<tr><td></td><td>max</td><td>min</td><td>average</td></tr>`
            for (var l = 0; l < data.length; l++) {
                let name= data[l].name,color=this.echartsColor[l]||this.echartsColor[0];
                let dataArr=[],sum=0,max=0,min=0,aver=0;
                if (data[l].data) {
                    let start=Math.ceil(s/100*data[l].data.length)
                    let end=Math.ceil(e/100*data[l].data.length)
                    for (var k = start; k < end; k++) {
                        dataArr.push(data[l].data[k][1])
                    }
                    for (var m = 0; m < dataArr.length; m++) {
                        sum+=dataArr[m]*100
                    }
                    aver=(sum/100/dataArr.length).toFixed(2);
                    min=Math.min(...dataArr)
                    max=Math.max(...dataArr)
                }
                trs+=`<tr><td style="overflow:hidden"><i style="display:inline-block;margin-right:10px;width:10px;height:10px;border-radius:50%;background-color:`+color+`"></i>`+name+`</td><td>`+max+`</td><td>`+min+`</td><td>`+aver+`</td></tr>`
                el.next().html(trs)
            }
        },
        showCounterEcharts(treeNode,s,e){//graph节点,s,e是起始毫秒时间戳,但不是必须的参数
            let endpoints=treeNode.hosts;
            let counters=treeNode.counters.split("|");
            let el="";
            let date=new Date()-0;
            let end=e||date;
            let start=s||(end-treeNode.timespan*1000);
            end=parseInt(end/1000)
            start=parseInt(start/1000)
            //添加echart容器
            for (var i = 0; i < counters.length; i++) {
                el+='<div class="pflux" style="width:'+100/this.echartsShowCol+'%"><div class="flux flux'+treeNode.id+i+'"></div><table class="fluxTable"  cellspacing="0" ></table></div>'
            }

            $("#showCharts").append(el)
            //设置查询的密度
            let legendData=endpoints.split("|");

            for (var k = 0; k < counters.length; k++) {
                let option=this.getChartOption(legendData)
                this.$http({
                    method:"post",
                    url:'/data/query',
                    data:{
                        endpoints: endpoints,
                        counters:counters[k],
                        start:start,
                        end:end,
                        isCut:false,
                        num:k
                    }
                }).then((res)=>{
                    let num= qs.parse(res.config.data).num;
                let endpoints= qs.parse(res.config.data).endpoints;
                //为一分钟重绘做映射关系
                this.tempEchartsInfo.push({el:$(".flux"+treeNode.id+num)[0],info:qs.parse(res.config.data)})
                // 设置每个series类型
                for (var j = 0; j < res.data.data.series.length; j++) {
                    let dataY=[],dataYmax=0,unit="B";
                    if (res.data.data.series[j].data !== null) {
                        for (var u = 0; u < res.data.data.series[j].data.length; u++) {
                            //将返回的时间戳由秒换成毫秒
                            res.data.data.series[j].data[u][0]=res.data.data.series[j].data[u][0]*1000;
                            dataY.push(res.data.data.series[j].data[u][1])
                        }
                        //获取最大值设置y坐标单位
                        dataYmax=Math.max(...dataY)
                        if (dataYmax/(1024*1024)>1) {
                            for (var u = 0; u < res.data.data.series[j].data.length; u++) {
                                res.data.data.series[j].data[u][1]=(res.data.data.series[j].data[u][1]/(1024*1024)).toFixed(2);
                            }
                            unit="MB"
                        }else if(dataYmax/1024>1){
                            for (var u = 0; u < res.data.data.series[j].data.length; u++) {
                                res.data.data.series[j].data[u][1]=(res.data.data.series[j].data[u][1]/1024).toFixed(2);
                            }
                            unit="KB"
                        }
                    }
                     option.yAxis.axisLabel.formatter='{value}'+unit;
                    //将返回的时间戳由秒换成毫秒
                    option.series.push({data: res.data.data.series[j].data,name: res.data.data.series[j].name,type: "line"});
                };
                var echart=echarts.init($(".flux"+treeNode.id+num)[0])
                //更改每个echart头部名称
                option.title.text=counters[num]
                echart.setOption(option)
                this.zoomFn(0,100,echart,$(".flux"+treeNode.id+num).eq(0))
                //声明图形缩放函数
                echart.on("dataZoom",(e)=>{
                        let dataArr=echart.getOption().series[0].data
                        let start=dataArr[0][0]
                        let end=dataArr[dataArr.length-1][0]
                        let s=e.batch[e.batch.length-1].start||(parseInt(e.batch[0].startValue)-start)/(end-start)*100||0
                        let en=e.batch[e.batch.length-1].end||(1-(end-parseInt(e.batch[0].endValue))/(end-start))*100
                this.zoomFn(s,en,echart,$(".flux"+treeNode.id+num).eq(0))

            })


            })
            }
        },
        //节点异步加载数据处理
        ztreeFilter(treeId, parentNode, responseData){
            this.echartsShowCol="1";
            let sortData=[],index=[],items=[];
            for (var i = 0; i < responseData.data.length; i++) {
                if (null==responseData.data[i].hosts) {responseData.data[i].isParent=true}
                responseData.data[i].name=responseData.data[i].title;
                if(!responseData.data[i].isParent){
                    //对交换机端口排序
                    this.searchGraphFormVisible=true;
                    if(parentNode.getParentNode().name=="交换机端口"){
                        index.push(responseData.data[i].name.split(",",1)[0].slice(8))
                        sortData.push({index:responseData.data[i].name.split(",",1)[0].slice(8),item:responseData.data[i]})
                    }else{
                        this.paginationShow=false
                    }
                }
            }
            if(sortData.length!==0){
                if (sortData.length>10) {this.paginationShow=true}//控制分页的显示
                index.sort((a,b)=>{return a-b})
                index.forEach((item,index)=>{
                    sortData.forEach((k,i)=>{
                    if (k["index"]==item) {
                    items.push(k["item"])
                }
            })
            })
                responseData.data=items
            }

            $("#showCharts").html("")
            this.tempEchartsInfo=[];
            for (var i = 0; i < responseData.data.length; i++) {
                if(!responseData.data[i].isParent){
                    if (i<10) {
                        this.showEcharts(responseData.data[i])};
                }else{
                    break;
                }
            }
            this.intervalUpdate()
            this.allGraphs=responseData.data;
            this.graphsTotal=responseData.data.length
            this.tempClickScreenNode=parentNode;
            this.tempClickNodeClass="screen";
            return responseData.data
        },
        //节点hover事件处理
        addHoverDom(treeId, treeNode) {
            this.tempNode=treeNode;
            var sObj = $("#" + treeNode.tId + "_span");
            if (treeNode.editNameFlag || $("#addScreenBtn_"+treeNode.tId).length>0||$("#addGraphBtn_"+treeNode.tId).length>0||$("#copyGraphBtn_"+treeNode.tId).length>0||$("#addSwitch"+treeNode.tId).length>0||$("#queryTeam"+treeNode.tId).length>0) return;
            var addGraph = "<span class='button addGraph' id='addScreenBtn_" + treeNode.tId
                + "' title='添加文件夹''></span>";
            var addScreen = "<span class='button addScreen' id='addGraphBtn_" + treeNode.tId
                + "' title='添加graph''></span>";
            var copyGraph = "<span class='button copyGraph' id='copyGraphBtn_" + treeNode.tId
                + "' title='复制graph''></span>";
            var pasteGraph = "<span class='button pasteGraph' id='pasteGraphBtn_" + treeNode.tId
                + "' title='粘贴graph''></span>";
            var addSwitch = "<span class='button addGraph' id='addSwitch" + treeNode.tId
                + "' title='添加交换机''></span>";
            var queryTeam = "<span class='button queryTeam' id='queryTeam" + treeNode.tId
                + "' title='操作组''></span>";
            var ping = "<span class='button addGraph' id='ping" + treeNode.tId
                + "' title='ping配置''></span>";
            if (treeNode.isParent) {
                if (treeNode.name!="交换机端口"&&treeNode.name!="网络质量监控") {
                    sObj.after(addGraph).after(addScreen).after(queryTeam);
                    if (this.copyNode) {sObj.after(pasteGraph)}
                }else if(treeNode.name=="交换机端口"){
                    sObj.after(addSwitch).after(queryTeam);
                }else{
                    sObj.after(ping).after(queryTeam);
                }
            }else{
                sObj.after(copyGraph);
            }
            var addGraphBtn = $("#addGraphBtn_"+treeNode.tId);
            var addScreenBtn = $("#addScreenBtn_"+treeNode.tId);
            var copyGraphBtn = $("#copyGraphBtn_"+treeNode.tId);
            var pasteGraphBtn = $("#pasteGraphBtn_"+treeNode.tId);
            var addSwitch = $("#addSwitch"+treeNode.tId);
            var queryTeam = $("#queryTeam"+treeNode.tId);
            var ping = $("#ping"+treeNode.tId);

            if (addGraphBtn) addGraphBtn.bind("click", ()=>{
                this.addGraphDialogVisible = true;
            this.addGraphRuleForm.screenId=treeNode.id;
        });

            if (ping) ping.bind("click", ()=>{
                console.log(treeNode.id)
                this.pingVisible=true;
                this.$http("/v1/ping/idc/list").then((res)=>{
                    this.pingIdcId=res.data;
                    console.log(res.data)
                })
             // axios.get()

        });
            if (addScreenBtn) addScreenBtn.bind("click", ()=>{
                this.addScreenDialogVisible = true;
            this.addScreenRuleForm.pid=treeNode.id;
        });
            if (copyGraphBtn) copyGraphBtn.on("click", ()=>{
            this.copyNode=treeNode;
            this.pasteGraphRuleForm.name=this.copyNode.name
            this.pasteGraphRuleForm.endpoints=this.copyNode.hosts
            this.pasteGraphRuleForm.counters=this.copyNode.counters
            this.pasteGraphRuleForm.timespan=String(this.copyNode.timespan)
            this.pasteGraphRuleForm.graphType=this.copyNode.graphType
        });
            if (pasteGraphBtn) pasteGraphBtn.on("click", ()=>{
                this.pasteGraphDialogVisible=true
            this.pasteGraphRuleForm.screenId=treeNode.id;
        });

            if (addSwitch) addSwitch.on("click", ()=>{
                this.addSwitchDialogVisible=true;

            this.$http("/api/querySwitch").then((res)=>{
                this.allSwitchIp=res.data;
            for (var i = 0; i <  this.allSwitchIp.length; i++) {
                this.switchIp.push({ip: this.allSwitchIp[i]})
            }
        })
        });
        if (queryTeam) queryTeam.on("click", ()=>{//组的操作
                this.screenReTeamVisible=true;
        this.$http({url:"/api/getScreenRelTeam",params:{screenId:treeNode.id}}).then((res)=>{
            this.reTeamTags=res.data
        }).then(()=>{
            this.$http({url:"/api/getTeamList",params:{page:1,limit:10,query:this.dimSearchKey}}).then((res)=>{
                this.allTeamListCount=res.data.total;
                this.teamListData=res.data.list;
                this.teamListData.forEach((item,index)=>{
                    let arrMembers=[],strMembers='';
                    item.memberList.forEach((key,i)=>{
                        arrMembers.push(key.name)
                    })
                    item.strMembers=arrMembers.join(",")
                })
            })
 })
        });
        },
        //ztree节点移除事件
        removeHoverDom(treeId, treeNode) {
            $("#addScreenBtn_"+treeNode.tId).unbind().remove();
            $("#addGraphBtn_"+treeNode.tId).unbind().remove();
            $("#copyGraphBtn_"+treeNode.tId).unbind().remove();
            $("#pasteGraphBtn_"+treeNode.tId).unbind().remove();
            $("#addSwitch"+treeNode.tId).unbind().remove();
            $("#queryTeam"+treeNode.tId).unbind().remove();
            $("#ping"+treeNode.tId).unbind().remove();
        },
        //编辑节点处理
        beforeEditName(treeId, treeNode){
            if (treeNode.isParent) {
                this.editScreenDialogVisible=true;
                this.editScreenRuleForm.oldName=treeNode.name;
                this.editScreenRuleForm.id=treeNode.id;
            }else{
                this.editGraphDialogVisible=true;
                this.editGraphRuleForm.id=treeNode.id;
                this.editGraphRuleForm.name=treeNode.name;
                this.editGraphRuleForm.endpoints=treeNode.hosts;
                this.editGraphRuleForm.counters=treeNode.counters;
                this.editGraphRuleForm.timespan=String(treeNode.timespan);
                this.editGraphRuleForm.screenId=treeNode.screenId;
                this.editGraphRuleForm.graphType=treeNode.graphType;
            }
            return false
        }
    },
    mounted(){
        //初始化ztree节点树
        this.$http({method:"get",url:"/api/getAllRootScreen"}).then((res)=> {
            let zNodes =res.data ;
        for (var i = 0; i < zNodes.length; i++) {
            zNodes[i].isParent=true;
        }
        this.zNodes=zNodes;
        $.fn.zTree.init($("#tree"), this.ztreeSetting, this.zNodes);
        this.treeObj=$.fn.zTree.getZTreeObj("tree")
    });
        //echarts最大值最小值平均值的显示隐藏设置
        var flag=false
        $(".togglehide").on("click",function(){
            if (!flag) {
                $(".fluxTable").css({display:"none"});
                $(this).css({background:"#FF4949","border-color": "#FF4949"}).html("打开")
                flag=true;
            }else{
                $(".fluxTable").css({display:"table"});
                $(this).css({background:"#F7BA2A","border-color": "#F7BA2A"}).html("关闭")
                flag=false;
            }
        })
    }
}
</script>
<style lang="sass" rel="stylesheet/scss">
.tree{
    overflow: hidden;
  
}
#showCharts{
    
}
.el-tooltip__popper {
    width: 800px;
    word-wrap: break-word;
}
.fl{

    min-height:900px;
    background-color: #AFADAE;
    border-radius:5px;
    border:1px solid #fff;
    float: left;
    height:100%;
    width: 450px;
 
}
.fr{
    overflow: hidden;
    .search{
        padding-top:10px;
        padding-left:5px;
        background-color: #545253;
        border:1px solid #fff;
        border-radius:5px;
        .el-form-item__label{
        color:#fff;
            
        }
    }
}
.ztree li span.button.addScreen {margin-left:2px; margin-right: -1px; background-position:-144px -80px; vertical-align:top; vertical-align:middle}
.ztree li span.button.addGraph {margin-left:2px; margin-right: -1px; background-position:-144px 0px; verticafl-align:top; vertical-align:middle}
.ztree li span.button.queryTeam {margin-left:2px; margin-right: -1px; background-position:-128px -80px; vertical-align:top; vertical-align:middle}
.ztree li span.button.copyGraph {margin-left:2px; margin-right: 2px;background-image:url("../../style/img/diy/myimg.png"); background-position:-16px 0px; vertical-align:top; vertical-align:top;z-index:99;position: relative;}
.ztree li span.button.pasteGraph {margin-left:2px; margin-right: 2px; background-image:url("../../style/img/diy/myimg.png");background-position:0px 0px; vertical-align:top; vertical-align:top;z-index:99;position: relative;}
.pflux{
    padding-top:5px;
    width:100%;
    display:inline-block;
    background-color: #2E2C2D;
    border-radius:10px;
    margin-bottom: 10px;
    border:1px solid #F6F6F6;
}
.flux{
    width:100%;
    height:400px;
    display:inline-block;
}
.fluxTable {
    margin-left:80px;
    width:80%;
    text-align:center;
    color:#fff;
    margin-top:-18px;
    margin-bottom:20px;
    font-size:14px;
    tr td{
        white-space: nowrap;
        overflow: hidden;
    }
}
.fluxTable tr td:nth-child(1){
    text-align:left;

}
</style>
