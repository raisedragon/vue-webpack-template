<template>
<div>
    <el-form :inline="true">
        <el-form-item label="排序数目：">
            <!--<el-select v-model="num" placeholder="请选择" @change="numChange">
              <el-option
                v-for="item in numOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>-->
            <el-autocomplete ref="numInput"
              class="inline-input"
              v-model="num"
              :fetch-suggestions="querySearch"
              placeholder="请输入内容"
              @select="numChange"
            ></el-autocomplete>
        </el-form-item>
        <el-form-item label="排序方法：">
            <el-select v-model="method" placeholder="请选择" @change="methodChange">
              <el-option
                v-for="item in methodOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
        </el-form-item>
    </el-form>
</div>
</template>


<script>
    export default {
        data() {
            return {
                numOptions: [],
                num: '10',
                preNum: '10',

                 methodOptions: [{
                       value: 'desc',
                       label: '降序'
                     }, {
                       value: 'asc',
                       label: '升序'
                     }],
                 method: 'desc'
            }

        },

        methods: {
            numChange() {
                if (this.num != this.preNum) {
                    this.$emit('numChange', this.num, this.method);
                    this.preNum = this.num;
                }
            },
            methodChange() {
                this.$emit('methodChange', this.num, this.method);
            },

            test() {
                debugger;
            },

            querySearch(queryString, cb) {
                // 调用 callback 返回建议列表的数据
                cb(this.numOptions);
            },

              loadAll() {
                return [
                  { "value": "10"},
                  { "value": "20"},
                  { "value": "30"}
                ];
              },
             bindBlur() {
                 this.$refs.numInput.$el.querySelector('input').addEventListener('blur', ()=>{
                     this.numChange();
                 })
             }
        },

        mounted() {
          this.bindBlur();
          this.numOptions = this.loadAll();
        }
    }
</script>


<style lang="sass" rel="stylesheet/scss" scoped>
    .chart-tab-pane {
        display: flex;
        justify-content: space-around;
    }
</style>
