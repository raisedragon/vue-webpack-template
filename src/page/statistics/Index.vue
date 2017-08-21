<template>
    <el-tabs type="border-card" @tab-click="checkTab" :active-name="currentTab">
        <el-tab-pane label="流量排行" name="statistics">
            <keep-alive>
                <StatisticsTop v-if="currentTab === 'statistics'"></StatisticsTop>
            </keep-alive>
        </el-tab-pane>

        <el-tab-pane label="端口利用率排行" name="speedPercent">
            <keep-alive>
                <SpeedPercentTop v-if="currentTab === 'speedPercent'"></SpeedPercentTop>
            </keep-alive>
        </el-tab-pane>

        <el-tab-pane label="错误率排行" name="error">
            <keep-alive>
                <ErrorsTop v-if="currentTab === 'error'"></ErrorsTop>
            </keep-alive>
        </el-tab-pane>

        <el-tab-pane label="丢弃报文排行" name="discards">
            <keep-alive>
                <DiscardsTop v-if="currentTab === 'discards'"></DiscardsTop>
            </keep-alive>
        </el-tab-pane>

    </el-tabs>
</template>


<script>

    import SpeedPercentTop from './SpeedPercentTop.vue';
    import StatisticsTop from './StatisticsTop.vue';
    import ErrorsTop from './ErrorsTop.vue';
    import DiscardsTop from './DiscardsTop.vue';

    export default {
        name: 'pubDataIndex',
        components: {
            SpeedPercentTop,
            StatisticsTop,
            ErrorsTop,
            DiscardsTop,
        },
        data() {
            return {
                currentTab: 'statistics'
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
