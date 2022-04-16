<template>
  <div class="dashboard-editor-container">
    <panel-group />

    <el-row style="background: #fff; padding: 16px 16px 0; margin-bottom: 32px">
      <line-chart :chart-data="lineChartData" />
    </el-row>

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>训练离线异常检测模型</span>
          </div>
          <el-form ref="form" :model="form" label-width="160px">
            <el-form-item label="模型名">
              <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item label="传感器组">
              <el-select v-model="form.group" placeholder="请选择传感器组">
                <el-option label="机械臂传感器" value="robotic_arm" />
                <el-option label="传送带传感器" value="conveyor" />
              </el-select>
            </el-form-item>
            <el-form-item label="训练集开始时间">
              <el-col :span="11">
                <el-date-picker
                  v-model="form.date1"
                  type="date"
                  placeholder="选择日期"
                  style="width: 100%"
                />
              </el-col>
              <el-col class="line" :span="2">-</el-col>
              <el-col :span="11">
                <el-time-picker
                  v-model="form.date2"
                  placeholder="选择时间"
                  style="width: 100%"
                />
              </el-col>
            </el-form-item>
            <el-form-item label="训练集结束时间">
              <el-col :span="11">
                <el-date-picker
                  v-model="form.date1"
                  type="date"
                  placeholder="选择日期"
                  style="width: 100%"
                />
              </el-col>
              <el-col class="line" :span="2">-</el-col>
              <el-col :span="11">
                <el-time-picker
                  v-model="form.date2"
                  placeholder="选择时间"
                  style="width: 100%"
                />
              </el-col>
            </el-form-item>
            <el-form-item label="自动选择最优传感器">
              <el-switch v-model="form.delivery" />
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="form.desc" type="textarea" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">立即创建</el-button>
              <el-button>取消</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>选择使用的模型</span>
          </div>
          <div style="text-align: center">
            <el-transfer
              v-model="select_model"
              style="text-align: left; display: inline-block"
              :titles="['所有模型', '选中模型']"
              :button-texts="['删除', '添加']"
              :data="model_list"
            />
          </div>
          <div style="text-align: center">
            <el-button
              type="primary"
              @click="onSelectedModel"
            >开始检测</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style>
.el-transfer-panel {
  width: 200px;
  height: 500px;
}
.el-transfer-panel__list.is-filterable {
  height: 400px;
}
</style>
<script>
import LineChart from './../components/LineChart'
import PanelGroup from './../components/PanelGroup'
export default {
  setup() {},
  components: {
    LineChart,
    PanelGroup
  },
  data() {
    return {
      // 默认首页显示这个曲线
      lineChartData: {
        expectedData: [
          0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2,
          0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2,
          0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2,
          0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2,
          0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2,
          0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2,
          0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2,
          0.2, 0.2
        ],
        actualData: [
          0.072608377, 0.133459325, 0.069863125, 0.063317448, 0.069157786,
          0.284234853, 0.19036838, 0.159899045, 0.25087483, 0.067244865,
          0.055234908, 0.122357863, 0.272236487, 0.120112964, 0.062778291,
          0.064541874, 0.066346378, 0.06165439, 0.064438189, 0.066914148,
          0.069078407, 0.061987961, 0.064122221, 0.062962744, 0.070586128,
          0.08659386, 0.070027486, 0.066191534, 0.068351061, 0.065311286,
          0.080768791, 0.066035368, 0.061931882, 0.061767479, 0.06490811,
          0.069014979, 0.072577852, 0.065719976, 0.063702155, 0.062042261,
          0.063124648, 0.059834554, 0.084984885, 0.073494793, 0.074495655,
          0.064473406, 0.059784082, 0.057865012, 0.060968012, 0.097945383,
          0.055377161, 0.072120921, 0.084290336, 0.069749208, 0.066307255,
          0.061998682, 0.054096558, 0.078155319, 0.099426601, 0.067167779,
          0.056258746, 0.062242484, 0.086977911, 0.062477827, 0.061268687,
          0.177795316, 0.074310376, 0.052989881, 0.065130246, 0.096259672,
          0.064396094, 0.057695644, 0.069542987, 0.061807612, 0.063913853,
          0.056597813, 0.071784306, 0.061120982, 0.060715978, 0.073169335,
          0.060676104, 0.05812092, 0.059336038, 0.062256154, 0.058752623,
          0.056463314, 0.070880582, 0.070264842, 0.072035995, 0.071049789,
          0.064218059, 0.071807179, 0.063466912, 0.067237633, 0.107276451,
          0.095630948, 0.057712636, 0.066768706, 0.091981687, 0.072457445
        ]
      },
      form: {
        name: '',
        group: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      model_list: [
        { key: '1', label: '机械臂训练模型1' },
        { key: '2', label: '机械臂训练模型2' },
        { key: '3', label: '传送带测试模型1' }
      ],
      select_model: []
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

