<template>
<div>
    <TopOptions ref="topOptions" @numChange="getStatisticsTop" @methodChange="getStatisticsTop"></TopOptions>
    <div ref="chartWrap" class="chart-tab-pane">
        <Chart :option="publishOpt" :width="size.width" :height="size.height"></Chart>
          <div style="width: 50%;">
              <el-table :data="tableData"
                        border
                        >
                  <el-table-column prop="ip" label="机器" align="center"></el-table-column>

                  <el-table-column prop="iface" label="接口" align="center" width="200px"></el-table-column>

                  <el-table-column prop="in" label="入流量(Mb)" align="center" ></el-table-column>

                  <el-table-column prop="out" label="出流量(Mb)" align="center" ></el-table-column>

                  <el-table-column prop="value" label="总流量(Mb)" align="center" ></el-table-column>

              </el-table>
          </div>
</div>
</div>

</template>


<script>

    import Chart from 'components/echart/Echart';
    import echarts from 'echarts/lib/echarts'
    import TopOptions from './TopOptions.vue';

    export default {
        components: {
            Chart,
            TopOptions
        },
        data() {
            return {
                size: {
                    width: '50%',
                    height: '600px'
                },
                timerId: {},
                tableData: [],

                numOptions: [{
                          value: '10',
                          label: '10'
                        }, {
                          value: '20',
                          label: '20'
                        }, {
                          value: '30',
                          label: '30'
                        }],
                 num: '10',
                 methodOptions: [{
                       value: 'desc',
                       label: '降序'
                     }, {
                       value: 'asc',
                       label: '升序'
                     }],
                 method: 'desc',

                publishOpt: {

                    title: {
                        text: '流量排行',
                        top: "top",
                        left: "center",
                    },
                    //提示框组件
                    tooltip: {
                        //触发类型
                        trigger: 'axis',
                        //指示器
                        axisPointer: {
                            type: 'shadow'
                        },
                        //提示悬浮文字
                        formatter: "{a} <br/>{b} : {c}"
                    },

                    grid: {
                        left: '0%',
                        right: '10%',
                        bottom: '12%',
                        top: '10%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'value',
                        name: '总流量',
                        nameLocation: 'end',
                        position: 'top',
                        //去掉，坐标尺度
                        axisTick: {
                            show: true
                        },
                        axisLabel: {
                            interval: 0,
                            formatter: '{value}',
                        },
                        boundaryGap: [0, 0.1],
                    },
                    yAxis: {
                        type: 'category',
                        name: '机器接口                         	',
                        nameLocation: 'start',

                        axisLabel: {
                            interval: 0,
                            rotate: 25,
                            textStyle: {
                                fontSize: 8
                            }
                        },
                        axisTick: {
                            show: false
                        },
                        inverse: 'true', //排序
                        data: [  ]
                    },
                    series: [{
                        name: '总流量',
                        type: 'bar',
                        barWidth: '70%',
                        itemStyle: {
                            normal: {　　
                                  color: '#58B7FF'
                                　　　　　　　　　　　　 //好，这里就是重头戏了，定义一个list，然后根据所以取得不同的值，这样就实现了，
//                                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
//                                    offset: 0,
//                                    color: 'lightBlue' // 0% 处的颜色
//                                }, {
//                                    offset: 1,
//                                    color: '#3398DB' // 100% 处的颜色
//                                }], false)
                            }
                        },
                        data: [ ]
                    }],
                    visualMap: [{
                        type: 'continuous',
                        show: false,
                        min: 0,
                        max: 10,
                        inRange: {
                            colorLightness: [0.4, 0.8]
                        }
                    }]
                }
            }

        },

        methods: {
            getStatisticsTop(num, method) {
                const url = '/top/query?id=1&num=' + num + '&method=' + method;
                this.$http.get(url)
                    .then(({data})=>{
                        this.tableData = [];
                        for (var i = 0; i < data.length; i++) {
                            var info = data[i].member.split(",");
                            var ifaceStr = info[2].split("=")[1].replace("GigabitEthernet", "G");
                            this.tableData[i] = {ip:info[0], iface:ifaceStr, in:(data[i].rawData["switch.if.In"] / 1024 / 1024).toFixed(2), out:(data[i].rawData["switch.if.Out"] / 1024 / 1024).toFixed(2), value:(data[i].value / 1024 / 1024).toFixed(2)};
                        }

                        let publishOpt = JSON.parse( JSON.stringify(this.publishOpt) )  ;

                        publishOpt.yAxis.data = [];
                        publishOpt.series[0].data = [];
                        this.tableData.forEach(item=>{
                            publishOpt.yAxis.data.push(item.ip + "_" + item.iface);
                            publishOpt.series[0].data.push(item.value);
                        })


                        Object.assign(this.publishOpt, publishOpt);
                    })
            }
        },

        mounted() {
            this.getStatisticsTop(this.$refs['topOptions'].num, this.$refs['topOptions'].method);
        },

        activated() {
            let duration = 60000;
            this.timerId = setInterval(()=>{
                this.getStatisticsTop(this.num, this.method);
            }, duration);
         },

        deactivated() {
            clearInterval(this.timerId);
        }
    }
</script>


<style lang="sass" rel="stylesheet/scss" scoped>
    .chart-tab-pane {
        display: flex;
        justify-content: space-around;
    }
</style>
