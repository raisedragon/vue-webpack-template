<template>
<el-row :gutter="20">
  <el-col :span="24">
<el-form :inline="true" :model="addAddressForm" :rules="addAddressFormRules" ref="addAddressForm"  class="demo-form-inline" >
  <el-form-item label="Ping IP地址"  prop="ip">
    <el-input v-model="addAddressForm.ip" placeholder="请输入IP地址" @change="trim(addAddressForm.ip)"></el-input>
  </el-form-item>
    <el-form-item label="城市" prop="city">
    <el-select  filterable v-model="addAddressForm.city"  placeholder="请选择城市">
      <el-option :key="city" :label="city" :value="city" v-for="city in citys"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item   label="运营商" prop="operator">
    <el-select   v-model="addAddressForm.operator"  placeholder="请选择运营商">
      <el-option label="未知" value="0"></el-option>
      <el-option label="移动" value="1"></el-option>
      <el-option label="电信" value="2"></el-option>
      <el-option label="联通" value="3"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="关联规则" prop="ruleId">
    <el-select   v-model="addAddressForm.ruleId" placeholder="请选择关联规则">
      <el-option :key="item.val" :label="item.label" :value="item.val" v-for="item in relRule"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="addAddress('addAddressForm')" >添加</el-button>
  </el-form-item>
</el-form>
  </el-col>
  <el-col :span="24">
  <el-table
    border
    ref="singleTable"
    :data="addressList"
    highlight-current-row
    style="width: 100%">
    <el-table-column
       property="addressId"
      label="序号"
      width="80"
      >
    </el-table-column>

    <el-table-column
     property="targetIp"
      label="Ping IP地址"
      >
    </el-table-column>
    <el-table-column
 property="targetCity"
      label="城市"
      width="120">
    </el-table-column>
    <el-table-column
 property="operator"
      label="运营商"
      width="100">
    </el-table-column>
     <el-table-column
      property="idc_sourceId"
      label="关联机房和规则">
    </el-table-column>
    <el-table-column
    property="create"
      label=" 创建时间">
    </el-table-column>
    <el-table-column
    property="modify"
      label="修改时间">
    </el-table-column>
     <el-table-column
     property="count"
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
  <div class="block" style="text-align:right;padding-top:10px">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="sizes, prev, pager, next"
      :total="paginationTotal">
    </el-pagination>
</div>
  </el-col>
<!-- 编辑address -->
<el-dialog title="编辑IDC" :visible.sync="dialogEditAddressVisible " size="tiny">
<el-form :model="editAddressForm" :rules="editAddressFormRules" ref="editAddressForm"  class="demo-form-inline" label-width="100px">
  <el-form-item label="Ping IP地址"  prop="ip">
    <el-input v-model="editAddressForm.ip" placeholder="请输入IP地址"></el-input>
  </el-form-item>
    <el-form-item label="城市" prop="city">
    <el-select  filterable v-model="editAddressForm.city"  placeholder="请选择城市">
      <el-option :key="city" :label="city" :value="city" v-for="city in citys"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item   label="运营商" prop="operator">
    <el-select   v-model="editAddressForm.operator"  placeholder="请选择运营商">
      <el-option label="未知" value="0"></el-option>
      <el-option label="移动" value="1"></el-option>
      <el-option label="电信" value="2"></el-option>
      <el-option label="联通" value="3"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="关联规则" prop="ruleId">
    <el-select   v-model="editAddressForm.ruleId" placeholder="请选择关联规则">
      <el-option :key="item.val" :label="item.label" :value="item.val" v-for="item in relRule"></el-option>
    </el-select>
  </el-form-item>

</el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogEditAddressVisible = false">取 消</el-button>
    <el-button type="primary" @click="editAddress('editAddressForm')" >确 定</el-button>
  </div>
</el-dialog>

</el-row>
</template>
<script>
import citys from "script/citys.js"
 export default {
    data() {
      return {
        dialogEditAddressVisible:false,
        paginationTotal:0,
        addressList:[],
        currentPage: 1,
        pageSize:10,
        relRule:[],
        citys:citys,
        addAddressForm:{
          ip:"",
          operator: "0",
          city:"",
          ruleId: ""
        },
        addAddressFormRules:{
          ip: [{ required: true, message: '请输入IP地址', trigger: 'blur' }],
          operator: [{ required: true, message: '请选择运营商', trigger: 'chang' }],
          city: [{ required: true, message: '请选择城市', trigger: 'chang' }],
          ruleId: [{ required: true, message: '请选择关联规则', trigger: 'chang' }]
        },
        editAddressForm:{
          id:'',
          ip:"",
          operator: "",
          city:"",
          ruleId: ""
        },
        editAddressFormRules:{
          ip: [{ required: true, message: '请输入IP地址', trigger: 'blur' }],
          operator: [{ required: true, message: '请选择运营商', trigger: 'chang' }],
          city: [{ required: true, message: '请选择城市', trigger: 'chang' }],
          ruleId: [{ required: true, message: '请选择关联规则', trigger: 'chang' }]
        }

      }
    },
     watch:{
      currentPage(val,oldVal){
        this.getAddressList(this.currentPage,this.pageSize)
      },
      pageSize(val,oldVal){
        this.getAddressList(this.currentPage,this.pageSize)
      }
     },
    methods: {
      trim(val){
       val.replace(/(^\s*)|(\s*$)/g, '');
      },
       editAddress(formName) {
          this.$refs[formName].validate((valid) => {
                if (valid) {
                  this.$http.post('/v1/ping/address/modify',this[formName],{dataType:"json"}).then( (res)=> {
                    if (res.code==0) {
                     this.dialogEditAddressVisible=false;
                    this.$message({
                        type: 'success',
                        message: '修改成功'
                    });
                     this.getAddressList(this.currentPage,this.pageSize)
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
      this.dialogEditAddressVisible=true;
        this.editAddressForm.id=row.addressId;
        this.editAddressForm.ip=row.targetIp;
        this.editAddressForm.operator=String(row.operator);
        this.editAddressForm.city=row.targetCity;
        this.editAddressForm.ruleId=String(row.ruleId);
      },
      handleDelete(index, row) {
           this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http({method:"get",url:"/v1/ping/address/delete",params:{id:row.addressId}}).then((res)=>{
                      if (res.code==0) {
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
                this.getAddressList(this.currentPage,this.pageSize)
                }
            })
            }).catch(() => {
                    this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
      },
          addAddress(formName) {
  this.$refs[formName].validate((valid) => {
                if (valid) {
                  let data=JSON.stringify(this[formName])
                   this.$http.post('/v1/ping/address/add',this[formName],{dataType:"json"}).then( (res)=> {
                      if(res.code==0){
                         this.$message({
                        type: 'success',
                        message: '添加成功'
                    });
                         this.getAddressList(this.currentPage,this.pageSize)
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
       handleSizeChange(val) {
        this.pageSize=val
      },
      handleCurrentChange(val) {
        this.currentPage=val
      },
      getAddressList(currentChange,pageSize){
          this.$http({method:"get",url:"/v1/ping/address/list",params:{page:currentChange,limit:pageSize}}).then((res)=>{
       let data=res.data;
        this.paginationTotal=data.total;
        for (var i = 0; i < data.list.length; i++) {
          let date1=new Date(data.list[i].create).toLocaleDateString().replace(/\//g,"-")
          let time1=new Date(data.list[i].create).toTimeString().slice(0,8)
          let date2=new Date(data.list[i].modify).toLocaleDateString().replace(/\//g,"-")
          let time2=new Date(data.list[i].modify).toTimeString().slice(0,8)
         Object.assign(data.list[i],{create:date1+" "+time1})
         Object.assign(data.list[i],{modify:date2+" "+time2})
         if (data.list[i].idcId>0) {
           Object.assign(data.list[i],{idc_sourceId:data.list[i].name+" ("+data.list[i].sourceCity+") "+data.list[i].sourceIp})
         }
        }
        this.addressList=data.list;
      })
      },
      getRelRule(){
         this.$http.get("/v1/ping/rule/list").then((res)=>{
        if(res.code=="0"){
        let data=res.data
        //时间转换
        for (var i = 0; i < data.length; i++) {
         if (data[i].netType==1){
          this.relRule.push({label:data[i].name+" ("+data[i].city+") "+"专线",val:String(data[i].ruleId)})
         }else if(data[i].netType==2){
           this.relRule.push({label:data[i].name+" ("+data[i].city+") "+"全国机房",val:String(data[i].ruleId)})
         }

        }
        }
      })
      }
    },
    mounted(){
    this.getAddressList(this.currentChange,this.pageSize);
    this.getRelRule()

    }

  }
</script>
<style>
.el-pagination .el-select .el-input input{
  height:35px;
}
  .el-pagination .el-pager li {
    font-size: 16px;
    min-width: 35px;
    height: 35px;
    line-height: 35px;
}

.el-pagination button{
     font-size: 16px;
    min-width: 35px;
    height: 35px;
    line-height: 35px;
}
</style>
<style scoped>

</style>
