<template>
    <el-tabs type="border-card" @tab-click="checkTab" :active-name="currentTab">
        <el-tab-pane label="源机房配置" name="pingIDC">
            <keep-alive>
                <pingIDC></pingIDC>
            </keep-alive>
        </el-tab-pane>

        <el-tab-pane label="目的地址配置" name="pingAddress">
            <keep-alive>
                <pingAddress></pingAddress>
            </keep-alive>
        </el-tab-pane>

         <el-tab-pane label="规则配置" name="pingRule">
             <keep-alive>
                 <pingRule></pingRule>
             </keep-alive>
         </el-tab-pane>

          <el-tab-pane label="大盘配置" name="config">
             <keep-alive>
                 <config></config>
             </keep-alive>
         </el-tab-pane>
    </el-tabs>
</template>


<script>
    import pingIDC from './pingIDC.vue';
    import pingAddress from './pingAddress.vue';
    import pingRule from './pingRule.vue';
    import config from './config.vue';

    export default {
            name: 'pubDataIndex',
            components: {
                pingIDC,
                pingAddress,
                pingRule,
                config
            },
            data() {
                return {
                    currentTab: 'pingIDC'
                }
            },

            methods: {
                checkTab(v) {
                    this.currentTab = v.name;
                },
            }
        }
</script>


<style lang="sass" rel="stylesheet/scss" scoped>
    .chart-tab-pane {
        display: flex;
        justify-content: space-around;
    }
</style>
