const Mock = require("mockjs");

const NameList = [];
const count = 100;

for (let i = 0; i < count; i++) {
  NameList.push(
    Mock.mock({
      name: "@first",
    })
  );
}
NameList.push({ name: "mock-Pan" });

const sensorGroupNameList = [];
for (let i = 1; i < 10; i++) {
  sensorGroupNameList.push("机械臂" + i + "组");
  sensorGroupNameList.push("传送带" + i + "组");
  sensorGroupNameList.push("安检仪" + i + "组");
}

const sensorList = [];
for (let i = 1; i < 10; i++) {
  sensorList.push("电压传感器" + i);
  sensorList.push("电流传感器" + i);
  sensorList.push("压力传感器" + i);
  sensorList.push("电位计" + i);
  sensorList.push("CO报警" + i);
  sensorList.push("三相平衡报警" + i);
}

const recentDate = [];
var dottedBase = +new Date();
for (var i = 30; i > 0; i--) {
  var date = new Date((dottedBase -= 1000 * 3600 * 24));
  recentDate.push(
    [date.getFullYear(), date.getMonth() + 1, date.getDate()].join("-")
  );
}

Mock.Random.extend({
  constellations: sensorList,
  //自定义占位符名字为newArr
  newArr: function () {
    // 随机选8到12个
    return this.pick(this.constellations, 3, 6);
  },
});

Mock.Random.extend({
  recentDateArray: recentDate,
  //自定义占位符名字为recentDate
  recentDate: function () {
    return this.pick(this.recentDateArray);
  },
});

module.exports = [
  // sensor list
  {
    url: "/vue-element-admin/sensor/list",
    type: "get",
    response: (_) => {
      return {
        code: 20000,
        data: {
          total: 20,
          "items|20": [
            {
              order_no: "@guid()",
              timestamp: +Mock.Random.date("T"),
              username: "@name()",
              value: "@float(0, 1000, 0, 2)",
              "status|1": ["正常", "正常", "正常", "正常", "异常"],
            },
          ],
        },
      };
    },
  },

  {
    url: "/vue-element-admin/sensor/grouplist",
    type: "get",
    response: (_) => {
      return {
        code: 20000,
        data: {
          total: 10,
          "items|10": [
            {
              id: "@guid()",
              timestamp: "@recentDate",
              "name|1": sensorGroupNameList,
              "status|1": ["检测中", "训练中"],
              sensor_list: "@newArr",
            },
          ],
        },
      };
    },
  },
];
