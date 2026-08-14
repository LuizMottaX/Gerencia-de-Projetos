<template>
  <div id="container">
    <AppHeader />
    <main>
      <RouterView />
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
import AppHeader from './components/AppHeader.vue';
import AppFooter from './components/AppFooter.vue';
</script>
