<template>
    <div class="container-fluid">
        <div class="display-container">
            <h2 class="mb-4">Classement National League</h2>
            <h3>Saison 2025-2026</h3>
            <div v-if="details.length > 0">
                <table class="table w-100">
                    <thead>
                        <tr>
                            <th scope="col">Pos.</th>
                            <th scope="col">Équipe</th>
                            <th scope="col">Matchs joués</th>
                            <th scope="col">Points</th>
                            <th scope="col">Équipe favorite</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="row in details" :key="row.team.id">
                            <th scope="row">{{ row.position }}</th>
                            <td>
                                <div class="team-info">
                                    <img :src="row.team.logo" alt="logo de l'équipe" class="team-logo" />
                                    <span class="team-name">{{ row.team.name }}</span>
                                </div>
                            </td>
                            <td>{{ row.games.played }}</td>
                            <td>{{ row.points }}</td>
                            <td>
                                <button @click="setFavouriteTeam(row.team)" class="btn btn-dark btn-rounded">
                                    Mon équipe favorite
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div v-else>
                <p>Aucun détail de classement disponible pour le moment.</p>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";

export default {
    data() {
        return {
            details: []
        };
    },
    mounted() {
        this.loadDataFromAPI();
    },

    methods: {
        normalizeLogos(data) {
            const SPECIAL_ID = 558;
            const FIXED_LOGO = "https://upload.wikimedia.org/wikipedia/fr/3/3a/HC_Ajoie_logo.jpeg?20210813090436";
            if (!Array.isArray(data)) return data;
            return data.map(row => {
                const clonedRow = { ...row, team: { ...(row.team || {}) } };
                const team = clonedRow.team;
                if (team) {
                    const idNum = Number(team.id);
                    const logoVal = team.logo;
                    if (idNum === SPECIAL_ID || String(logoVal) === String(SPECIAL_ID)) {
                        team.logo = FIXED_LOGO;
                    }
                }
                return clonedRow;
            });
        },

        async loadDataFromAPI() {
            const cacheKey = "classementDetails";
            const api_Url = import.meta.env.VITE_API_URL;
            const api_Key = import.meta.env.VITE_API_KEY;
            const cachedData = localStorage.getItem(cacheKey);

            if (cachedData) {
                try {
                    const { data, timestamp } = JSON.parse(cachedData);
                    if (Date.now() - timestamp < 40 * 60 * 1000 && Array.isArray(data) && data.length > 0) {
                        this.details = this.normalizeLogos(data);
                        return;
                    }
                } catch (e) {
                    console.warn("Cache corrompu, on l'ignore.", e);
                }
            }

            const options = {
                method: "GET",
                url: "https://api-hockey.p.rapidapi.com/standings/",
                params: {
                    league: "51",
                    season: "2025"
                },
                headers: {
                    "X-RapidAPI-Key": api_Key,
                    "X-RapidAPI-Host": api_Url
                }
            };

            try {
                const response = await axios.request(options);
                const raw = response.data.response[0];
                this.details = this.normalizeLogos(raw);
                this.cacheData(this.details);
            } catch (error) {
                console.error("Erreur lors de la récupération des données depuis l'API", error);
            }
        },
        cacheData(data) {
            localStorage.setItem("classementDetails", JSON.stringify({ data, timestamp: Date.now() }));
        },
        setFavouriteTeam(teamData) {
            localStorage.setItem("favouriteTeam", JSON.stringify(teamData));
            window.dispatchEvent(new Event("favourite-team-updated"));
        }
    }
};
</script>

<style>
.display-container {
    margin-top: 90px;
}
.team-logo {
    max-width: 30px;
    max-height: 30px;
    margin-right: 10px;
}

.team-info {
    font-weight: bold;
    text-transform: uppercase;
    text-align: left;
}

tbody {
    text-align: center;
}

thead {
    text-align: center;
}

h2 {
    padding: 20px;
}

h3 {
    padding-left: 20px;
    padding-bottom: 10px;
}
</style>
