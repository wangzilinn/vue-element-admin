<template>
  <el-table :data="list" border fit highlight-current-row style="width: 100%">
    <el-table-column
      v-loading="loading"
      align="center"
      label="ID"
      width="65"
      element-loading-text="请给我点时间！"
    >
      <template slot-scope="scope">
        <span>{{ scope.row.id }}</span>
      </template>
    </el-table-column>

    <el-table-column align="center" label="注册时间">
      <template slot-scope="scope">
        <span>{{
          scope.row.timestamp | parseTime("{y}-{m}-{d} {h}:{i}")
        }}</span>
      </template>
    </el-table-column>

    <el-table-column align="center" label="用户名">
      <template slot-scope="scope">
        <span>{{ scope.row.author }}</span>
      </template>
    </el-table-column>

    <el-table-column label="所属区域">
      <template slot-scope="scope">
        <span>{{ scope.row.unit }}</span>
      </template>
    </el-table-column>

    <el-table-column class-name="status-col" label="用户状态">
      <template slot-scope="{ row }">
        <el-tag :type="row.status === '正常' ? 'success' : 'danger'">
          {{ row.status }}
        </el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { fetchUserList } from '@/api/user'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  props: {
    type: {
      type: String,
      default: 'CN'
    }
  },
  data() {
    return {
      list: null,
      listQuery: {
        page: 1,
        limit: 5,
        type: this.type,
        sort: '+id'
      },
      loading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      this.$emit('create') // for test
      fetchUserList(this.listQuery).then((response) => {
        console.log(this.listQuery)
        this.list = response.data.items
        console.log(this.list)
        this.loading = false
      })
    }
  }
}
</script>

