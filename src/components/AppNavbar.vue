<template>
    <nav class="navbar bg-dark navbar-expand-lg bg-body-tertiary fixed-top" data-bs-theme="dark">
        <div class="container-fluid">
            <div v-if="favouriteTeam">
                <a class="navbar-brand" href="#"><img :src="favouriteTeam.logo" alt="logo équipe favorite" /></a>
            </div>
            <div v-else>
                <a class="navbar-brand" href="#">National League</a>
            </div>
            <ul class="navbar-nav me-auto">
                <li>
                    <router-link to="/calendrier" class="nav-link" aria-current="page">Calendrier</router-link>
                </li>
                <li>
                    <router-link to="/classement" class="nav-link" aria-current="page">Classement</router-link>
                </li>
                <li>
                    <router-link to="/teams" class="nav-link" aria-current="page">Statistiques des équipes</router-link>
                </li>
            </ul>
        </div>
    </nav>
</template>

<script>
import { ref, onMounted, onUnmounted } from "vue";

export default {
    setup() {
        const favouriteTeam = ref("");
        const loadFavouriteTeam = () => {
            const key = "favouriteTeam";
            const cachedData = localStorage.getItem(key);

            if (cachedData) {
                favouriteTeam.value = JSON.parse(cachedData);
            }
        };

        {
            onMounted(() => {
                loadFavouriteTeam();
                window.addEventListener("favourite-team-updated", loadFavouriteTeam);
            });

            onUnmounted(() => {
                window.removeEventListener("favourite-team-updated", loadFavouriteTeam);
            });

            return {
                favouriteTeam
            };
        }
    }
};
</script>

<style>
img {
    max-width: 45px;
    max-height: 45px;
}
ul.navbar-nav.me-auto {
    display: flex;
    flex-direction: row;
    align-items: center;
}

ul.navbar-nav.me-auto li .nav-link {
    white-space: nowrap;
    margin-right: 20px;
}
</style>
