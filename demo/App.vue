<script setup lang="ts">
import MoveAndResizeContainer from "../src/components/MoveAndResizeContainer/MoveAndResizeContainer.vue";
</script>

<template>
  <main>
    <h1>Welcome to your your sandbox environment</h1>
  </main>

  <MoveAndResizeContainer :parentWidth="250" :parentHeight="250">
    Resize Me
  </MoveAndResizeContainer>
</template>

<style lang="scss" scoped></style>
