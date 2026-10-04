<script setup>
defineProps({
  modelValue: {
    type: [String, Number],
    default: null,
  },
  options: {
    type: Array,
    required: true,
  },
  ariaLabel: {
    type: String,
    default: 'Tool mode',
  },
})

const emit = defineEmits(['update:modelValue'])

function select(id) {
  emit('update:modelValue', id)
}
</script>

<template>
  <div class="math-segment" role="group" :aria-label="ariaLabel">
    <button
      v-for="item in options"
      :key="item.id"
      type="button"
      class="math-segment__btn"
      :class="{ 'math-segment__btn--active': modelValue === item.id }"
      :title="item.title || item.label"
      @click="select(item.id)"
    >
      <slot name="option" :option="item">
        {{ item.label }}
      </slot>
    </button>
  </div>
</template>
