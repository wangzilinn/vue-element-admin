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

const ModelNameList = [];
for (let i = 1; i < 10; i++) {
  ModelNameList.push("机械臂HTM loss" + i);
  ModelNameList.push("机械臂offline" + i);
  ModelNameList.push("传送带HTM cdfk" + i);
  ModelNameList.push("传送带all sensor" + i);
  ModelNameList.push("安检仪selected sensor" + i);
  ModelNameList.push("安检仪HTM cdfK" + i);
}

module.exports = [
  // sensor list
  {
    url: "/vue-element-admin/log/list",
    type: "get",
    response: (_) => {
      return {
        code: 20000,
        data: {
          total: 20,
          "items|20": [
            {
              id: "@increment",
              timestamp: "@increment(2)",
              "model|1": ModelNameList,
              value: "@float(0.1,0.9)",
              "status|1": ["正常", "正常", "正常", "异常"],
            },
          ],
        },
      };
    },
  },
];
