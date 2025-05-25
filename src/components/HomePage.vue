<template>
    <div class="home-container">
        <div class="header">
            <img src="/national_league.png" alt="Logo du hockey suisse" class="logo" />
            <h1>National League</h1>
        </div>
        <p class="description">Bienvenue sur le meilleur site de hockey suisse.</p>
        <div class="buttons">
            <router-link to="/calendrier" class="btn btn-dark btn-rounded">Calendrier</router-link>
            <router-link to="/classement" class="btn btn-dark btn-rounded">Classement</router-link>
            <router-link to="/teams" class="btn btn-dark btn-rounded">Statistiques des équipes</router-link>
        </div>
        <div class="match-jour">
            <MatchsCalendar :show-date-picker="false" :show-title="false" :show-season="false" />
        </div>
    </div>
</template>

<script>
import MatchsCalendar from "./MatchsCalendar.vue";

export default {
    data() {
        return {};
    },
    components: { MatchsCalendar }
};
</script>

<style scoped>
.home-container {
    margin-top: 90px;
    text-align: center;
    padding: 20px;
}

.header {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.logo {
    max-width: 100px;
    max-height: 100px;
}

h1 {
    font-size: 2em;
    margin-top: 10px;
}

.description {
    font-size: 1.2em;
    margin-top: 20px;
}

.buttons {
    margin-top: 30px;
}

.btn {
    display: inline-block;
    padding: 10px 20px;
    margin: 5px;
    font-size: 1.1em;
    color: #fff;
    text-decoration: none;
    border-radius: 5px;
    transition: background-color 0.3s ease;
}
.match-jour {
    padding: 0px;
    background-color: #f2f2f2;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-top: 10px;
}
</style>
