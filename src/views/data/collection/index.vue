<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column align="center" label="传感器组ID" width="400">
        <template slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="创建时间">
        <template slot-scope="{ row }">
          <span>{{ row.timestamp | parseTime("{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="传感器组名">
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="传感器组状态" width="110">
        <template slot-scope="{ row }">
          <el-tag :type="row.status">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column min-width="300px" label="组内传感器列表">
        <template slot-scope="{ row }">
          <span>{{ row.sensor_list }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Actions" width="120">
        <template slot-scope="{ row }">
          <el-button
            v-if="row.edit"
            type="success"
            size="small"
            icon="el-icon-circle-check-outline"
            @click="confirmEdit(row)"
          >
            Ok
          </el-button>
          <el-button
            v-else
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="row.edit = !row.edit"
          >
            Edit
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
    <el-divider />
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>连接传感器</span>
          </div>
          <el-form ref="form" :model="form" label-width="160px">
            <el-form-item label="传感器ID">
              <el-input v-model="form.id" />
            </el-form-item>
            <el-form-item label="传感器名">
              <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item label="请选择连接方式">
              <el-radio-group v-model="form.connector">
                <el-radio label="CSV" />
                <el-radio label="Modbus" />
              </el-radio-group>
            </el-form-item>
            <el-form-item v-show="form.connector === 'CSV'" label="上传数据集">
              <el-upload
                class="upload-demo"
                action="https://jsonplaceholder.typicode.com/posts/"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :before-remove="beforeRemove"
                multiple
                :limit="1"
                :on-exceed="handleExceed"
                :file-list="fileList"
              >
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传csv文件</div>
              </el-upload>
            </el-form-item>
            <div v-show="form.connector === 'Modbus'">
              <el-form-item label="协议类型">
                <el-select
                  v-model="form.modbusMeta.com"
                  placeholder="请选择通讯端口"
                >
                  <el-option label="COM1" value="1" />
                  <el-option label="COM2" value="2" />
                  <el-option label="COM3" value="3" />
                  <el-option label="COM4" value="4" />
                </el-select>
              </el-form-item>
              <el-form-item label="波特率">
                <el-select
                  v-model="form.modbusMeta.baud"
                  placeholder="请选择波特率"
                >
                  <el-option label="9600" value="9600" />
                  <el-option label="115200" value="115200" />
                </el-select>
              </el-form-item>
              <el-form-item label="从机地址" style="width: 300px">
                <el-input v-model="form.modbusMeta.addr" />
              </el-form-item>
              <el-form-item label="命令" style="width: 300px">
                <el-input v-model="form.modbusMeta.cmd" />
              </el-form-item>
              <el-form-item label="数据长度" style="width: 300px">
                <el-input v-model="form.modbusMeta.length" />
              </el-form-item>
            </div>
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
            <span>生成传感器组</span>
          </div>
          <div style="text-align: center">
            <el-transfer
              v-model="selected_sensor"
              style="text-align: left; display: inline-block"
              :titles="['未分组传感器', '选中的传感器']"
              :button-texts="['删除', '添加']"
              :data="sensor_list"
            />
          </div>
          <el-divider />
          <div style="text-align: center">
            <el-input
              v-model="new_sensor_group_name"
              placeholder="请输入内容"
              style="width: 300px"
            >
              <template slot="prepend">传感器组名:</template>
            </el-input>
            <el-button
              type="primary"
              @click="onSelectedModel"
            >添加传感器组</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<style>
.el-transfer-panel {
  width: 200px;
  height: 300px;
}
.el-transfer-panel__list.is-filterable {
  height: 200px;
}
</style>
<script>
import { sensorGroupList } from '@/api/sensor'
import Pagination from '@/components/Pagination'

export default {
  name: 'InlineEditTable',
  components: { Pagination },
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
  data() {
    return {
      total: 10,
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      },
      form: {
        id: '',
        name: '',
        connector: '',
        modbusMeta: {
          com: '',
          baud: '',
          addr: '',
          cmd: '',
          length: ''
        },
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      sensor_list: [
        { key: 'CO报警3', label: 'CO报警3' },
        { key: '电位计3', label: '电位计3' },
        { key: '电位计5', label: '电位计5' },
        { key: '机械臂1', label: '机械臂1' },
        { key: '机械臂2', label: '机械臂2' },
        { key: '传送带1', label: '传送带1' }
      ],
      selected_sensor: [],
      new_sensor_group_name: ''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      const { data } = await sensorGroupList(this.listQuery)
      const items = data.items
      this.list = items.map((v) => {
        this.$set(v, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html
        v.originalTitle = v.title //  will be used when user click the cancel botton
        return v
      })
      this.listLoading = false
    },
    cancelEdit(row) {
      row.title = row.originalTitle
      row.edit = false
      this.$message({
        message: 'The title has been restored to the original value',
        type: 'warning'
      })
    },
    confirmEdit(row) {
      row.edit = false
      row.originalTitle = row.title
      this.$message({
        message: 'The title has been edited',
        type: 'success'
      })
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
