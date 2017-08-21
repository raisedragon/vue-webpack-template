<template>
<div class="idc">
<el-row :gutter="20">
  <el-col  :span="10">
<el-form :inline="true" :model="addIDCForm" :rules="addIDCformRules" ref="addIDCForm" class="demo-form-inline">
  <el-form-item label="机房名称" prop="name">
    <el-input v-model="addIDCForm.name" placeholder="请输入机房"></el-input>
  </el-form-item>
  <el-form-item label="城市">
    <el-select v-model="addIDCForm.city" prop="city" filterable placeholder="请输入城市" size="">
      <el-option :key="city" :label="city" :value="city" v-for="city in citys"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="addIDC('addIDCForm')">添加</el-button>
  </el-form-item>
</el-form>
  </el-col>
  <el-col :span="15">
  <el-table
    border
    ref="singleTable"
    :data="idcList"
    highlight-current-row

    style="width: 100%">
    <el-table-column
      property="id"
      label="序号"
      width="100">
    </el-table-column>

    <el-table-column
      property="name"
      label="机房名称"
      width="120">
    </el-table-column>
    <el-table-column
      property="city"
      label="城市"
      width="120">
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
      label="操作">
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
<el-dialog title="编辑IDC" :visible.sync="dialogEditIDCVisible " size="tiny">
  <el-form :model="editIDCform" :inline="true" :rules="editIDCformRules" ref="editIDCform">
    <el-form-item label="机房名称" prop="name">
    <el-input v-model="editIDCform.name" placeholder="请输入机房"></el-input>
  </el-form-item>
  <el-form-item label="城市" prop="city">
    <el-select v-model="editIDCform.city" filterable placeholder="请输入城市">
       <el-option :key="city" :label="city" :value="city" v-for="city in citys"></el-option>
    </el-select>
  </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogEditIDCVisible = false">取 消</el-button>
    <el-button type="primary" @click="editIDC('editIDCform')">确 定</el-button>
  </div>
</el-dialog>

</el-row>
</div>
</template>
<script>
import citys from "script/citys.js"
 export default {
    data() {
      return {
        dialogEditIDCVisible:false,
        idcList: [],
        citys:citys,
        editRow:'',
        addIDCForm:{
          name:'',
          city:'深圳'
        },
        editIDCform:{
          name:'',
          city:'',
          id: '',
        },
        addIDCformRules: {
                name: [
                    { required: true, message: '请输入机房名称', trigger: 'blur' },
                ],
                city: [
                    { required: true, message: '请输入机房所在的城市', trigger: 'change' },
                ]
            },
        editIDCformRules: {
                name: [
                    { required: true, message: '请输入机房名称', trigger: 'blur' },
                ],
                city: [
                    { required: true, message: '请输入机房所在的城市', trigger: 'change' },
                ]
            },
      }
    },
    methods: {
      addIDC(formName) {
  this.$refs[formName].validate((valid) => {

                if (valid) {
                   this.$http.post('/v1/ping/idc/add',this[formName],{dataType:"json"}).then( (res)=> {
                        //此处需要返回节点信息
                      if(res.code==0){
                         this.$message({
                        type: 'success',
                        message: '添加成功'
                    });
                           this.getList()
                      }

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
      editIDC(formName) {
          this.$refs[formName].validate((valid) => {
                if (valid) {
                  this.$http.post('/v1/ping/idc/modify',this[formName],{dataType:"json"}).then( (res)=> {
                     this.dialogEditIDCVisible=false;
                    Object.assign(this.editRow,this[formName])//更新表格
                    this.$message({
                        type: 'success',
                        message: '修改成功'
                    });
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
        this.editRow=row;
        this.dialogEditIDCVisible=true;
        this.editIDCform.city=row.city
        this.editIDCform.name=row.name
        this.editIDCform.id=row.id
      },
      handleDelete(index, row) {
           this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http({method:"get",url:"/v1/ping/idc/delete",params:{id:row.id}}).then((res)=>{
                      if(res.data==1){
                        this.$message({
                         type: 'success',
                         message: '删除成功!'
                         });
                       this.idcList.splice(index,1)
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
      getList(){
          this.$http.get("/v1/ping/idc/list").then((res)=>{
        let data=res.data
        //时间转换
        for (var i = 0; i < data.length; i++) {
          let date1=new Date(data[i].create).toLocaleDateString().replace(/\//g,"-")
          let time1=new Date(data[i].create).toTimeString().slice(0,8)
          let date2=new Date(data[i].modify).toLocaleDateString().replace(/\//g,"-")
          let time2=new Date(data[i].modify).toTimeString().slice(0,8)
         Object.assign(data[i],{create:date1+" "+time1})
         Object.assign(data[i],{modify:date2+" "+time2})
        }
        this.idcList=data
      })
      }

    },
    mounted(){
      this.getList()
    }
  }
</script>
<style scoped>
.idc{
  .el-select-dropdown__list{
    /*list-style: none;
    padding: 6px 0;
    margin: 0;
    box-sizing: border-box;*/
    height: 100px !important;
    overflow-y: scroll !important;
  }
}

</style>
