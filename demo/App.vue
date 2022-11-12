<script setup lang="ts">
import ResizeContainer from "../src/components/ResizeContainer/ResizeContainer.vue";
</script>

<template>
  <main>
    <h1>Welcome to your your sandbox environment</h1>
  </main>

  <ResizeContainer :parentWidth="250" :parentHeight="250">
    Resize Me
  </ResizeContainer>
</template>

<style lang="scss" scoped></style>
