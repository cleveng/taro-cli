<script setup lang="ts">
import { ref } from 'vue'

const msg = ref('Hello world')
</script>

<template>
  <view class="home">
    <text>{{ msg }}</text>
  </view>
</template>
