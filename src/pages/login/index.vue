<script lang="ts" setup>
import { View, Text } from '@tarojs/components'
import { ref } from 'vue'

const msg = ref('Hello world')
const onClick = () => {
  console.log('[Navbar]: on click title')
}
</script>
<template>
  <View>
    <nut-navbar title="登录" safe-area-inset-top left-show @click-back="onClick"> </nut-navbar>
    <Text>{{ msg }}</Text>
  </View>
</template>
