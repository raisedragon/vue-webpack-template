<template>
<el-row>
  <el-col :span="24">
   <el-form :inline="true" ref="visualMap"  :model="visualMap" label-width="80px" >
  <h3 class="visualConfig">大盘视觉配置 <el-switch v-model="visualSwitch" on-text="编辑" off-text="禁用"  on-color="#13ce66"  off-color="#ff4949" ></el-switch></h3>
  <el-form-item label="最小值">
    <el-input-number v-model="visualMap.min" :disabled="visualSwitch" :min="0" :max="visualMap.max-1"></el-input-number>
  </el-form-item>
  
   <el-form-item label="最大值">
   <el-input-number v-model="visualMap.max" :disabled="visualSwitch" :min="visualMap.min+1" ></el-input-number>
  </el-form-item>

 <el-form-item label="颜色">
    <el-color-picker v-model="visualMap.color0"></el-color-picker>
    <el-color-picker v-model="visualMap.color1"></el-color-picker>
    <el-color-picker v-model="visualMap.color2"></el-color-picker>
    <el-color-picker v-model="visualMap.color3"></el-color-picker>
  </el-form-item>
 <el-form-item>
  
    <el-button type="primary" :disabled="visualSwitch" @click="setVisualMap">设置</el-button>
  </el-form-item>
  </el-form>
  </el-col>

 <el-col :span="24">
   <el-form :inline="true"  label-width="80px" >
  <h3 class="visualConfig">大盘排行配置 <el-switch v-model="topnSwitch" on-text="编辑" off-text="禁用" on-color="#13ce66"  off-color="#ff4949" ></el-switch></h3>
  <el-form-item label="排行值">
    <el-input-number v-model="topn"  :min="5" :disabled="topnSwitch"></el-input-number>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="setTopn" :disabled="topnSwitch">设置</el-button>
  </el-form-item>
  </el-form>
 </el-col>

</el-row> 
 
</template>
<script>
  export default{
    data(){
      return{
        topn:"",
        visualSwitch:true,
        topnSwitch:true,
        visualMap:{
          min:0,
          max:100,
          color0:"#",
          color1:"",
          color2:"",
          color3:""
        }
      }
    },

    methods:{
      
      setTopn(){
         this.$http.get("/v1/ping/config/setTopn",{params:{topn:this.topn}},{dataType:"json"}).then((res)=>{});
      },
      setVisualMap(){
        let colors=[this.visualMap.color0,this.visualMap.color1,this.visualMap.color2,this.visualMap.color3]
        let data={min:this.visualMap.min,max:this.visualMap.max,color:colors}
        this.$http.post("/v1/ping/config/setVisualMap",data,{dataType:"json"}).then((res)=>{});
      }
    },
    mounted(){
     
    this.$http.get("/v1/ping/config/getConfig").then(({data})=>{
        this.topn=data.topn;
       this.visualMap.min=data.visualMap.min
       this.visualMap.max=data.visualMap.max
       let colors=data.visualMap.color;
       colors.forEach((item,index)=>{
        this.visualMap["color"+index]=item
       })
        
      })
    }
  }
</script>

<style lang="sass" scoped>
  .visualConfig{
    margin:10px;
    color:#666666;
    padding-left:15px;
  }
  
</style>