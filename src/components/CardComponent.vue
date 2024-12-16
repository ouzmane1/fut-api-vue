<template>
  <div class="card bg-white rounded-lg shadow-lg overflow-hidden">
    <!-- Image -->
    <img :src="imageSrc" :alt="imageAlt" class="w-[250px] h-[200px] " />

    <!-- Card Content -->
    <div class="p-4 text-center">
      <h3 class="text-lg font-semibold mb-2">{{ title }}</h3>
      <p class="text-lg mb-4">{{ prix }}</p>

      <!-- Button -->
      <button
        @click="onButtonClick"
        class="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
      >
        {{ buttonText }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "CardComponent",
  props: {
    imageSrc: {
      type: String,
      required: true,
    },
    imageAlt: {
      type: String,
      default: "Card image",
    },
    title: {
      type: String,
      required: true,
    },
    prix: {
      type: String,
      required: true,
    },
    buttonText: {
      type: String,
      default: "Click me",
    },
  },
  methods: {
    onButtonClick() {
      this.$emit("button-click");
    },
  },
};
</script>
