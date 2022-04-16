<template>
  <el-table :data="list" style="width: 100%; padding-top: 15px">
    <el-table-column label="传感器ID" min-width="200">
      <template slot-scope="scope">
        {{ scope.row.order_no | orderNoFilter }}
      </template>
    </el-table-column>
    <el-table-column label="传感器值" width="195" align="center">
      <template slot-scope="scope"> {{ scope.row.value }} </template>
    </el-table-column>
    <el-table-column label="传感器状态" width="100" align="center">
      <template slot-scope="{ row }">
        <el-tag :type="row.status === '正常' ? 'success' : 'danger'">
          {{ row.status }}
        </el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { sensorList } from '@/api/sensor'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: 'success',
        pending: 'danger'
      }
      return statusMap[status]
    },
    orderNoFilter(str) {
      return str.substring(0, 30)
    }
  },
  data() {
    return {
      list: null
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      sensorList().then((response) => {
        console.log('test')
        this.list = response.data.items.slice(0, 8)
      })
    }
  }
}
</script>
