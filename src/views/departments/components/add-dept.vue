<template>
  <el-dialog :title="showTitle" :visible="showDialog" @close="btnCancel">
    <!-- 表单数据 -->
    <el-form ref="deptForm" label-width="120px" :model="formDate" :rules="rules">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formDate.name" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formDate.code" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="formDate.manager" style="width:80%" placeholder="请选择" @focus="getEmployeeSimple">
          <!-- 遍历选项 -->
          <el-option v-for="item in peoples" :key="item.id" :label="item.username" :value="item.username" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="formDate.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <!-- 确定和消息 -->
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" @click="btnCancel">取消</el-button>
        <el-button type="primary" size="small" @click="btnOK">确定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getDepartments, addDepartments, getDepartDetail, updateDepartments } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    treeNode: {
      type: Object,
      default: null
    }
  },
  data() {
    const checkNameRepeat = async(rule, value, callback) => {
      const { depts } = await getDepartments()
      let isRepeats = false
      if (this.formDate.id) {
        // 编辑模式
        isRepeats = depts.filter(item => item.pid === this.treeNode.pid && item.id !== this.treeNode.id).some(item => item.name === value)
      } else {
        // 新增模式
        isRepeats = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
      }
      isRepeats ? callback(new Error(`同级部门下已经存在${value}部门了`)) : callback()
    }
    const checkCodeRepeat = async(rule, value, callback) => {
      const { depts } = await getDepartments()
      let isRepeats = false
      if (this.formDate.id) {
        // 编辑模式
        isRepeats = depts.filter(item => item.id !== this.treeNode.id).some(item => item.code === value && value)
      } else {
        // 新增模式
        isRepeats = depts.some(item => item.code === value && value)
      }
      isRepeats ? callback(new Error(`组织架构下已经存在${value}这个编码了`)) : callback()
    }
    return {
      formDate: {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      },
      rules: {
        name: [{ required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '长度为1-50个字符', trigger: 'blur' },
          { trigger: 'blur', validator: checkNameRepeat }],
        code: [{ required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '长度为1-50个字符', trigger: 'blur' },
          { trigger: 'blur', validator: checkCodeRepeat }],
        manager: [{ required: true, message: '部门负责人不能为空', trigger: 'blur' }],
        introduce: [{ required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { min: 1, max: 300, message: '长度为1-300个字符', trigger: 'blur' }]
      },
      peoples: []
    }
  },
  computed: {
    showTitle() {
      return this.formDate.id ? '编辑部门' : '新增部门'
    }
  },
  methods: {
    async getEmployeeSimple() {
      this.peoples = await getEmployeeSimple()
    },
    async getDepartDetail(id) {
      this.formDate = await getDepartDetail(id)
    },
    btnOK() {
      this.$refs.deptForm.validate(async isOK => {
        if (isOK) {
          if (this.formDate.id) {
            await updateDepartments(this.formDate)
          } else {
            await addDepartments({ ...this.formDate, pid: this.treeNode.id })
          }
          this.$emit('addDepts')
          this.$emit('update:showDialog', false)
        }
      })
    },
    btnCancel() {
      this.formDate = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
      this.$emit('update:showDialog', false)
      // 可以重置数据 但只能重置在定义中的数据
      this.$refs.deptForm.resetFields()
    }
  }
}
</script>

<style>

</style>
