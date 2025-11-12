<template>
    <div class="container-fluid">
        <div class="display-container">
            <h2 class="mb-4" v-if="showTitle">Calendrier</h2>
            <h3 v-if="showSeason">Saison 2023-2024</h3>
            <CalendrierComponent v-if="showDatePicker" :initial-date="selectedDate" @update-date="updateDate" />
            <div class="date" v-if="selectedDate">
                <h2>{{ formatFullDate(selectedDate) }}</h2>
            </div>
            <div class="details-container">
                <div class="match-box" v-if="details.length > 0">
                    <div class="details-box" v-for="match in details" :key="match.id">
                        <div class="match-info">
                            <div class="team">
                                <img
                                    :src="getTeamLogo(match.teams.home.name)"
                                    alt="Logo équipe domicile"
                                    class="team-logo"
                                />
                                contre
                                <img
                                    :src="getTeamLogo(match.teams.away.name)"
                                    alt="Logo équipe extérieure"
                                    class="team-logo"
                                />
                            </div>
                            <div class="scores">{{ match.scores.home }} - {{ match.scores.away }}</div>
                            <div class="time">{{ match.time }}</div>
                            <div class="button">
                                <router-link :to="'/matchdetails/' + match.id">
                                    <button class="btn btn-dark btn-rounded">Gamecenter</button>
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else>
                    <p>Aucun match n'a lieu à cette date.</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import CalendrierComponent from "./CalendrierComponent.vue";

export default {
    //TEST
    props: {
        showDatePicker: {
            type: Boolean,
            default: true
        },
        showTitle: {
            type: Boolean,
            default: true
        },
        showSeason: {
            type: Boolean,
            default: true
        }
    },
    components: {
        CalendrierComponent
    },
    data() {
        return {
            details: [],
            selectedDate: null
        };
    },
    mounted() {
        this.loadDataFromAPI();

        const dateFromUrl = this.$route.query.date;

        if (dateFromUrl) {
            this.selectedDate = dateFromUrl;
            this.fetchDataForSelectedDate();
        } else {
            this.selectedDate = this.getCurrentDate();
            this.loadDataFromAPI();
        }
    },

    methods: {
        cacheData(data) {
            localStorage.setItem("matchDetails", JSON.stringify({ data, timestamp: Date.now() }));
        },
        async loadDataFromAPI() {
            const cacheKey = "matchDetails";
            const cachedData = localStorage.getItem(cacheKey);
            const api_Url = import.meta.env.VITE_API_URL;
            const api_Key = import.meta.env.VITE_API_KEY;

            if (cachedData) {
                const { data, timestamp } = JSON.parse(cachedData);

                if (Date.now() - timestamp < 5 * 60 * 1000) {
                    this.details = data;
                    return;
                }
            }

            const options = {
                method: "GET",
                url: "https://api-hockey.p.rapidapi.com/games",
                params: {
                    league: "51",
                    date: this.getCurrentDate(),
                    season: "2025"
                },
                headers: {
                    "X-RapidAPI-Key": api_Key,
                    "X-RapidAPI-Host": api_Url
                }
            };

            try {
                const response = await axios.request(options);
                this.details = response.data.response;
                this.cacheData(response.data.response);
            } catch (error) {
                console.error("Erreur lors de la récupération des données depuis l'API", error);
            }
            localStorage.setItem(cacheKey, JSON.stringify({ data: this.details, timestamp: Date.now() }));
        },

        async fetchDataForSelectedDate() {
            const options = {
                method: "GET",
                url: "https://api-hockey.p.rapidapi.com/games",
                params: {
                    league: "51",
                    date: this.selectedDate || this.getCurrentDate(),
                    season: "2025"
                },
                headers: {
                    "X-RapidAPI-Key": import.meta.env.VITE_API_KEY,
                    "X-RapidAPI-Host": "api-hockey.p.rapidapi.com"
                }
            };

            try {
                const response = await axios.request(options);
                this.details = response.data.response;
                this.cacheData(response.data.response);
            } catch (error) {
                console.error("Erreur lors de la récupération des données depuis l'API", error);
            }
        },

        updateDate(newDate) {
            this.selectedDate = newDate;
            this.fetchDataForSelectedDate();

            this.$router.push({ query: { date: newDate } });
        },

        formatTeamName(name) {
            const teamMapping = {
                Fribourg: "HCFR",
                Rapperswil: "SCRJ",
                Zurich: "ZSC",
                Servette: "GSHC",
                Lausanne: "LHC",
                Lugano: "HCL",
                Biel: "EHC",
                Bern: "SCB",
                Davos: "HCD",
                Ajoie: "HCA",
                "Langnau Tigers": "SCLT",
                "Ambri-Piotta": "HCAP",
                "EHC Kloten": "EHCK",
                Zug: "EVZ"
            };
            if (name in teamMapping) {
                return teamMapping[name];
            }

            return name;
        },
        getCurrentDate() {
            const today = new Date();
            const year = today.getFullYear();
            const month = (today.getMonth() + 1).toString().padStart(2, "0");
            const day = today.getDate().toString().padStart(2, "0");
            return `${year}-${month}-${day}`;
        },
        formatFullDate(dateStr) {
            const options = { year: "numeric", month: "long", day: "numeric" };
            return new Date(dateStr).toLocaleDateString(undefined, options);
        },
        getTeamLogo(teamName) {
            const teamLogos = {
                Zurich: "https://media.api-sports.io/hockey/teams/556.png",
                Fribourg: "https://media.api-sports.io/hockey/teams/549.png",
                Zug: "https://media.api-sports.io/hockey/teams/555.png",
                Lausanne: "https://media.api-sports.io/hockey/teams/551.png",
                Bern: "https://media.api-sports.io/hockey/teams/546.png",
                Servette: "https://media.api-sports.io/hockey/teams/554.png",
                Davos: "https://media.api-sports.io/hockey/teams/548.png",
                Lugano: "https://media.api-sports.io/hockey/teams/552.png",
                "Ambri-Piotta": "https://media.api-sports.io/hockey/teams/545.png",
                Biel: "https://media.api-sports.io/hockey/teams/547.png",
                "Langnau Tigers": "https://media.api-sports.io/hockey/teams/550.png",
                "Rapperswil-Jona": "https://media.api-sports.io/hockey/teams/553.png",
                "EHC Kloten": "https://media.api-sports.io/hockey/teams/561.png",
                Ajoie: "https://media.api-sports.io/hockey/teams/558.png"
            };

            if (teamName in teamLogos) {
                return teamLogos[teamName];
            }
            return "https://via.placeholder.com/50";
        }
    }
};
</script>

<style>
.display-container {
    margin-top: 90px;
}
.match-box {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}
.date {
    font-size: 120px;
    margin-bottom: 20px;
    text-align: center;
}

.details-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}

.details-box {
    margin: 5px;
    padding: 10px;
    box-sizing: border-box;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: end;
    border-radius: 10px;
}

.match-info {
    flex-grow: 1;
}

.team {
    margin: 0;
    padding: 5px;
}

.team-logo {
    max-width: 50px;
    margin-bottom: 5px;
}

.time {
    margin: 0;
    padding: 5px;
}

.no-details-message {
    font-style: italic;
    color: #888;
}

h2 {
    padding: 20px;
}

h3 {
    padding-left: 20px;
    padding-bottom: 10px;
}
</style>
