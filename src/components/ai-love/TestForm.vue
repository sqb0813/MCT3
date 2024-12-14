<template>
  <el-form
    ref="formRef"
    :model="formData[personType]"
    label-width="120px"
    class="test-form"
  >
    <el-form-item label="姓名">
      <el-input
        v-model="formData[personType].name"
        placeholder="请输入姓名(选填)"
      />
    </el-form-item>

    <el-form-item
      label="年龄"
      :rules="[{ required: true, message: '请输入年龄', trigger: 'blur' }]"
    >
      <el-input-number
        v-model="formData[personType].age"
        :min="18"
        :max="100"
      />
    </el-form-item>

    <el-form-item
      label="性别"
      :rules="[{ required: true, message: '请选择性别', trigger: 'change' }]"
    >
      <el-radio-group v-model="formData[personType].gender">
        <el-radio label="male">男</el-radio>
        <el-radio label="female">女</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item label="职业">
      <el-input
        v-model="formData[personType].occupation"
        placeholder="请输入职业(选填)"
      />
    </el-form-item>

    <el-form-item
      label="性格特征"
      :rules="[
        { required: true, message: '请选择性格特征', trigger: 'change' },
      ]"
    >
      <el-select
        v-model="formData[personType].personality"
        multiple
        placeholder="请选择性格特征"
      >
        <el-option
          v-for="item in PERSONALITY_OPTIONS"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="兴趣爱好">
      <el-select
        v-model="formData[personType].hobbies"
        multiple
        placeholder="请选择兴趣爱好(选填)"
      >
        <el-option
          v-for="item in HOBBY_OPTIONS"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item
      label="感情观"
      :rules="[{ required: true, message: '请选择感情观', trigger: 'change' }]"
    >
      <el-select
        v-model="formData[personType].values"
        placeholder="请选择感情观"
      >
        <el-option
          v-for="item in VALUES_OPTIONS"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item>
      <el-button v-if="personType === 'person2'" @click="handlePrevStep"
        >上一步</el-button
      >
      <el-button type="primary" @click="handleNextStep">{{
        personType === "person1" ? "下一步" : "开始分析"
      }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref } from "vue";
import {
  PERSONALITY_OPTIONS,
  HOBBY_OPTIONS,
  VALUES_OPTIONS,
} from "@/constants/ai-love";

const props = defineProps({
  personType: {
    type: String,
    required: true,
  },
  formData: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["next-step", "prev-step"]);

const formRef = ref(null);

const handleNextStep = async () => {
  if (!formRef.value) return;

  await formRef.value.validate((valid) => {
    if (valid) {
      emit("next-step");
    }
  });
};

const handlePrevStep = () => {
  emit("prev-step");
};
</script>

<style scoped>
.test-form {
  margin-top: 20px;
}
</style>
