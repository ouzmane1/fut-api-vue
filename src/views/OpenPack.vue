<template>

  <div class="bg-gray-100 min-h-screen flex flex-col items-center justify-start">
    <!-- titre  -->
    <div class="w-full text-center py-8">
      <h1 class="text-2xl font-bold uppercase tracking-wider">Ouvrir des Packs</h1>
    </div>
    <!-- Conteneur des cartes -->
    <div class="flex flex-wrap justify-center gap-6 mt-10">
      <!-- Première carte -->
      <CardComponent
        imageSrc="./img/bronze-bg.png"
        imageAlt="First Card"
        title="Pack Bronze"
        prix="1200"
        buttonText="Acheter"
        @button-click="handleCardClick('PackBronze')"
      />

      <!-- Deuxième carte -->
      <CardComponent
        imageSrc="./img/silver.png"
        imageAlt="Second Card"
        title="Pack Argent"
        prix="1200"
        buttonText="Acheter"
        @button-click="handleCardClick('PackArgent')"
      />

      <!-- Troisième carte -->
      <CardComponent
        imageSrc="./img/gold-bg.png"
        imageAlt="Third Card"
        title="Pack Or"
        prix="1200"
        buttonText="Acheter"
        @button-click="handleCardClick('PackOr')"
      />

      <!-- Quatieme carte -->
      <CardComponent
        imageSrc="./img/icon.png"
        imageAlt="Third Card"
        title="Pack Icone"
        prix="1200"
        buttonText="Acheter"
        @button-click="handleCardClick('PackIcone')"
      />
    </div>
  </div>
</template>

<script>
import CardComponent from '@/components/CardComponent.vue';

export default {
  name: "OpenPack",
  components: {
    CardComponent,
  },
  methods: {
    handleCardClick(PackBronze) {
      // Redirige vers la page des détails du pack
      this.$router.push({ name: 'PackDetails', params: { title: PackBronze } });
    },
  },
};
</script>

