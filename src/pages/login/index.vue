<script lang="ts" setup>
import { View, Text } from '@tarojs/components'
import { ref } from 'vue'

const msg = ref('Hello world')
</script>
<template>
  <View>
    <Text>{{ msg }}</Text>
  </View>
</template>
