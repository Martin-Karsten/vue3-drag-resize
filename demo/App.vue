<script setup lang="ts">
import MoveResizeContainer from "../src/components/MoveResizeContainer/MoveResizeContainer.vue";
</script>

<template>
  <main>
    <h1>Welcome to your your sandbox environment</h1>
  </main>

  <MoveResizeContainer :parentWidth="250" :parentHeight="250">
    Resize Me
  </MoveResizeContainer>
</template>

<style lang="scss" scoped></style>
