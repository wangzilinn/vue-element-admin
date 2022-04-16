<template>
  <div class="dashboard-editor-container">
    <panel-group />

    <el-row style="background: #fff; padding: 16px 16px 0; margin-bottom: 32px">
      <line-chart :chart-data="lineChartData" />
      <div>{{ cnt }}</div>
    </el-row>

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>新建在线异常检测模型</span>
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
            <el-form-item label="异常值计算方法">
              <el-radio-group v-model="form.resource">
                <el-radio label="loss" />
                <el-radio label="cdf-k" />
              </el-radio-group>
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
              v-model="selected_model"
              style="text-align: left; display: inline-block"
              :titles="['所有模型', '选中模型']"
              :button-texts="['删除', '添加']"
              :data="model_list"
            />
          </div>
          <div style="text-align: center">
            <el-button type="primary" @click="onSelectedModel"
              >开始检测</el-button
            >
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<style>
/* 穿梭框外框高宽度 */
.el-transfer-panel {
  width: 200px;
  height: 300px;
}
/* 穿梭框内部展示列表高宽度 */
.el-transfer-panel__list.is-filterable {
  height: 200px;
}
</style>
<script>
import LineChart from "./../components/LineChart";
import PanelGroup from "./../components/PanelGroup";
import { Cnt } from "@/api/detection";
export default {
  setup() {},
  components: {
    LineChart,
    PanelGroup,
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
          0.2, 0.2,
        ],
        actualData: [
          0.053369542, 0.050941017, 0.063683461, 0.076409248, 0.059486041,
          0.080341067, 0.09108722, 0.076524064, 0.072368069, 0.05943724,
          0.068530579, 0.051483206, 0.376713092, 0.330642251, 0.057646,
          0.051320067, 0.070864374, 0.053139171, 0.05229914, 0.057950988,
          0.059964577, 0.058700857, 0.056388172, 0.073003345, 0.051695196,
          0.051723504, 0.088233706, 0.070878309, 0.066313573, 0.06572987,
          0.058056147, 0.057159954, 0.066323141, 0.051735581, 0.054445514,
          0.085451521, 0.076999344, 0.061119403, 0.066971248, 0.0591296,
          0.061048765, 0.061471199, 0.051834493, 0.069703807, 0.07728485,
          0.077660887, 0.062091427, 0.068116933, 0.060345703, 0.068676631,
          0.055713663, 0.051880826, 0.075481964, 0.079684548, 0.078806286,
          0.064296295, 0.066888004, 0.057802908, 0.071704502, 0.051700276,
          0.051486707, 0.05714062, 0.066141141, 0.064929867, 0.060100323,
          0.069888872, 0.055837646, 0.051522241, 0.053899928, 0.066589438,
          0.063207734, 0.062729001, 0.060775715, 0.062897854, 0.051523237,
          0.052830285, 0.063792505, 0.067061135, 0.063643571, 0.056781831,
          0.068588375, 0.051638695, 0.051479626, 0.062650491, 0.065967602,
          0.065961096, 0.055428882, 0.072063718, 0.051999394, 0.051465073,
          0.056322302, 0.066126728, 0.063921633, 0.059361981, 0.069040408,
          0.055814227, 0.051441994, 0.053980066, 0.067164967, 0.063287334,
        ],
      },
      form: {
        name: "",
        group: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
      },
      model_list: [
        { key: "1", label: "机械臂传感器组模型1" },
        { key: "2", label: "机械臂传感器组模型使用loss" },
        { key: "3", label: "传送带传感器模型1" },
      ],
      selected_model: [],
      cnt: 0,
    };
  },
  methods: {
    onSubmit() {
      console.log("submit!");
      this.cnt = Cnt().then((res) => {
        this.cnt = res;
      });
    },
  },
};
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

