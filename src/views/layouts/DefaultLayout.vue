<script setup>
import { RouterView } from 'vue-router'
import HeaderView from './HeaderView.vue'
import NavView from './NavView.vue'
</script>

<template>
	<HeaderView />
	<NavView />
	<div class="page-wrapper">
		<RouterView />
	</div>
</template>
