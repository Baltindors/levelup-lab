<script setup>
defineProps({
  selected: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: 'button',
  },
})
</script>

<template>
  <button
    :type="type"
    class="math-chip"
    :class="{ 'math-chip--active': selected }"
  >
    <slot />
  </button>
</template>
