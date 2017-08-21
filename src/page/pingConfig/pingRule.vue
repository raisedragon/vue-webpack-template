<template>
<el-row :gutter="20">
  <el-col :span="20">
<el-form :inline="true" :model="addRuleForm" :rules="addRuleFormRules" ref="addRuleForm" class="demo-form-inline" label-width="180px">
  <el-form-item label="机器IP地址" prop="ip">
    <el-input v-model="addRuleForm.ip" placeholder="请输入机器IP地址"></el-input>
  </el-form-item>
  <el-form-item label="ping次数" prop="count">
    <el-input v-model="addRuleForm.count" placeholder="请输入ping次数"></el-input>
  </el-form-item>
  <el-form-item label="间隔时间" prop="interval">
    <el-input v-model="addRuleForm.interval" placeholder="请输入间隔时间"></el-input>
  </el-form-item>
  <el-form-item label="绑定接口" prop="interFace">
    <el-input v-model="addRuleForm.interFace" placeholder="请输入绑定接口"></el-input>
  </el-form-item>
  <el-form-item label="超出时间" prop="timeout">
    <el-input v-model="addRuleForm.timeout" placeholder="请输入超出时间"></el-input>
  </el-form-item>
  <el-form-item label="类型">
    <el-select v-model="addRuleForm.netType" prop="netType" placeholder="请输入类型">
      <el-option label="未知" value="0"></el-option>
      <el-option label="专线" value="1"></el-option>
      <el-option label="全国机房" value="2"></el-option>
      <el-option label="IDC机房" value="3"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="关联机房">
    <el-select v-model="addRuleForm.idcId" prop="idcId"  placeholder="请选择关联机房">
      <el-option :key="item.value" :label="item.label":value="item.value" v-for="item in relIDCs"></el-option>
     <!--  <el-option label="测试机房1 深圳" value="1"></el-option>
      <el-option label="测试机房2 深圳" value="2"></el-option> -->
    </el-select>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="addRule('addRuleForm')">添加</el-button>
  </el-form-item>
</el-form>
  </el-col>
  <el-col :span="24">
  <el-table
    border
    ref="singleTable"
    :data="ruleList"
    highlight-current-row
    style="width: 100%">
    <el-table-column
         property="ruleId"
      label="序号"
      width="70">
    </el-table-column>
    <el-table-column
      property="ip"
      label="机器IP地址"
      width="140"
      >
    </el-table-column>
    <el-table-column
      property="netType"
      label="类型"
      width="80"
      >
    </el-table-column>
    <el-table-column
      property="count"
      width="100"
      label="Ping次数">
    </el-table-column>
     <el-table-column
      property="interval"
      width="110"
      label="间隔时间(s)">
    </el-table-column>
     <el-table-column
      property="interFace"
      width="100"
      label="绑定接口">
    </el-table-column>
     <el-table-column
      property="timeout"
      width="110"
      label="超时时间(s)">
    </el-table-column>
     <el-table-column
      property="relIDC"
       width="200"
      label="关联机房和规则">
    </el-table-column>
     <el-table-column
      property="create"
      label="创建时间">
    </el-table-column>
     <el-table-column
      property="modify"
      label="修改时间">
    </el-table-column>
     <el-table-column
      label="操作"width="140">
      <template scope="scope">
        <el-button
          size="small"
          @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        <el-button
          size="small"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>

  </el-table>
  </el-col>
<!-- 编辑IDC -->
<el-dialog title="编辑ping规则" :visible.sync="dialogEditRuleVisible " size="tiny">
  <el-form :model="editRuleForm" :rules="editRuleFormRules" ref="editRuleForm" class="demo-form-inline" label-width="100px">
  <el-form-item label="机器IP地址" prop="ip">
    <el-input v-model="editRuleForm.ip" placeholder="请输入机器IP地址"></el-input>
  </el-form-item>
  <el-form-item label="类型">
    <el-select v-model="editRuleForm.netType" prop="netType" placeholder="请输入类型">
      <el-option label="未知" value="0"></el-option>
      <el-option label="专线" value="1"></el-option>
      <el-option label="全国机房" value="2"></el-option>
      <el-option label="IDC机房" value="3"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="ping次数" prop="count">
    <el-input v-model="editRuleForm.count" placeholder="请输入ping次数"></el-input>
  </el-form-item>
  <el-form-item label="间隔时间" prop="interval">
    <el-input v-model="editRuleForm.interval" placeholder="请输入间隔时间"></el-input>
  </el-form-item>
  <el-form-item label="绑定接口" prop="interFace">
    <el-input v-model="editRuleForm.interFace" placeholder="请输入绑定接口"></el-input>
  </el-form-item>
  <el-form-item label="超出时间" prop="timeout">
    <el-input v-model="editRuleForm.timeout" placeholder="请输入超出时间"></el-input>
  </el-form-item>
  <el-form-item label="关联机房">
    <el-select v-model="editRuleForm.idcId" prop="idcId"  placeholder="请选择关联机房" >
      <el-option :key="item.value"  :label="item.label" :value="item.value" v-for="item in relIDCs"></el-option>
    </el-select>
  </el-form-item>

</el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogEditRuleVisible = false">取 消</el-button>
    <el-button type="primary" @click="editRule('editRuleForm')">确 定</el-button>
  </div>
</el-dialog>

</el-row>
</template>
<script>
 export default {
    data() {
      return {
        dialogEditRuleVisible:false,
        ruleList: [],
        relIDCs:[{label:"未关联",value:0}],
        addRuleForm:{
          ip: "",
          netType: "0",
          count: 20,
          interval: 0.2,
          timeout: 2,
          interFace: "",
          idcId: 0
        },
        addRuleFormRules: {
                ip: [
                    { required: true, message: '请输入机器IP地址', trigger: 'blur' },
                ]
            },
        editRuleForm:{
          id:"",
          ip: "",
          netType: "",
          count: "",
          interval: "",
          timeout: "",
          interFace: "",
          idcId: ""
        },
        editRuleFormRules: {
                ip: [
                    { required: true, message: '请输入机器IP地址', trigger: 'blur' },
                ]
          }

      }
    },
    methods: {
      addRule(formName) {
      this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$http.post("/v1/ping/rule/add",this[formName],{dataType:"json"}).then( (res)=> {
                        //此处需要返回节点信息
                    this.$message({
                        type: 'success',
                        message: '添加成功'
                    });
                    this.getRuleList()
                }).catch(()=>{
                        this.$message({
                        type: 'error',
                        message: '添加失败'
                    });
                })
                } else {
                    return false;
        }
        })
      },
      editRule(formName) {
          this.$refs[formName].validate((valid) => {
                if (valid) {
                  this.$http.post("/v1/ping/rule/modify",this[formName],{dataType:"json"}).then( (res)=> {
                        //此处需要返回节点信息
                    if (res.code==0) {
                    this.$message({
                        type: 'success',
                        message: '修改成功'
                    });
                   this.getRuleList()
                    this.dialogEditRuleVisible=false;
                 }
                }).catch(()=>{
                        this.$message({
                        type: 'error',
                        message: '修改失败'
                    });
                })
                } else {
                    return false;
        }
        })

      },
       handleEdit(index, row) {
        this.editRuleRow=row;
        this.dialogEditRuleVisible=true;
        this.editRuleForm.id=row.ruleId;
        this.editRuleForm.netType=String(row.netType)
        this.editRuleForm.ip=row.ip;
        this.editRuleForm.count=row.count;
        this.editRuleForm.interval=row.interval;
        this.editRuleForm.timeout=row.timeout;
        this.editRuleForm.interFace=row.interFace;
        this.editRuleForm.idcId=row.idcId;
      },
      handleDelete(index, row) {
           this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http({method:"get",url:"/v1/ping/rule/delete",params:{id:row.ruleId}}).then((res)=>{

                      if (res.code==0) {
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
                this.ruleList.splice(index,1)
                }else{
                    this.$message({
                    type: 'info',
                    message: res.msg
                });
                }
            })
            }).catch(() => {
                    this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
      },
      getRuleList(){
         this.$http.get("/v1/ping/rule/list").then((res)=>{
        if(res.code=="0"){
        let data=res.data
        //时间转换
        for (var i = 0; i < data.length; i++) {
          let date1=new Date(data[i].create).toLocaleDateString().replace(/\//g,"-")
          let time1=new Date(data[i].create).toTimeString().slice(0,8)
          let date2=new Date(data[i].modify).toLocaleDateString().replace(/\//g,"-")
          let time2=new Date(data[i].modify).toTimeString().slice(0,8)
         Object.assign(data[i],{create:date1+" "+time1})
         Object.assign(data[i],{modify:date2+" "+time2})
         let type=""
         if (data[i].netType==1){
          type="专线"
         }else if(data[i].netType==2){
           type="全国机房"
         }
         if (data[i].idcId>0) {
          // data[i].relIDC=data[i].name+"("+data[i].city+")"

           Object.assign(data[i],{relIDC:data[i].name+" ("+data[i].city+") "+type})


         }
        }
        this.ruleList=data
        }
      })
      }
    },
    mounted(){
      //获取关联机房
      this.$http.get("/v1/ping/idc/list").then((res)=>{
        let data=res.data;
        for (var i = 0; i < data.length; i++) {
          this.relIDCs.push({label:data[i].name+"("+data[i].city+")",value:data[i].id})
        }
      })
      //获取规则列表
     this.getRuleList()
    }
  }
</script>
<style>

</style>
