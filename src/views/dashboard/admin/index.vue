<template>
  <div class="dashboard-editor-container">
    <panel-group @handleSetLineChartData="handleSetLineChartData" />

    <el-row style="background: #fff; padding: 16px 16px 0; margin-bottom: 32px">
      <line-chart :chart-data="lineChartData" />
    </el-row>

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="12">
        <transaction-table />
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import GithubCorner from '@/components/GithubCorner'
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import RaddarChart from './components/RaddarChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
import TransactionTable from './components/TransactionTable'
import TodoList from './components/TodoList'
import BoxCard from './components/BoxCard'

const lineChartData = {
  sensor: {
    expectedData: [
      694, 750, 522, 500, 507, 555, 762, 794, 813, 657, 497, 505, 512, 519, 639,
      811, 653, 496, 504, 511, 519, 631, 810, 667, 497, 504, 512, 520, 636, 811,
      662, 496, 503, 512, 539, 736, 573, 523, 749, 629, 497, 505, 514, 523, 663,
      809, 630, 498, 509, 518, 528, 659, 812, 638, 498, 507, 517, 527, 657, 811,
      634, 499, 508, 518, 527, 672, 808, 622, 496, 506, 516, 527, 704, 799, 589,
      501, 509, 518, 534, 733, 791, 566, 501, 511, 521, 542, 746, 796, 575, 499
    ],
    actualData: [
      730, 767, 449, 563, 545, 541, 779, 746, 862, 616, 486, 483, 502, 473, 612,
      806, 634, 442, 510, 506, 560, 636, 842, 660, 523, 439, 568, 517, 709, 846,
      614, 543, 522, 446, 558, 796, 583, 482, 732, 659, 494, 475, 462, 544, 705,
      869, 578, 544, 481, 561, 555, 680, 796, 579, 550, 490, 539, 457, 686, 867,
      575, 443, 512, 464, 557, 731, 835, 633, 509, 548, 505, 496, 680, 729, 551,
      459, 464, 489, 516, 697, 747, 577, 517, 516, 463, 531, 728, 767, 557, 457
    ]
  }
}

export default {
  name: 'DashboardAdmin',
  components: {
    GithubCorner,
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart,
    TransactionTable,
    TodoList,
    BoxCard
  },
  data() {
    return {
      // 默认首页显示这个曲线
      lineChartData: lineChartData.sensor
    }
  },
  methods: {
    // 点击页面第一行的按钮，type是从PanelGroup组件的handleSetLineChartData方法传来的
    handleSetLineChartData(type) {
      if (type == 'alarm') {
        this.lineChartData = lineChartData[type]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
