<template>
    <app-navbar></app-navbar>
    <router-view></router-view>
</template>

<script>

import AppNavbar from "@/components/AppNavbar.vue";

export default {
    components: {
        AppNavbar
    },

    data() {
        return {};
    }
};
</script>

<style></style>
