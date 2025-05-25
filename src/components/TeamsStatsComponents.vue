<template>
    <div class="container-fluid">
        <div class="display-container">
            <h2 class="mb-4">Statistiques des équipes</h2>
            <div style="overflow: auto">
                <div v-if="details.length > 0">
                    <div id="upperPage" class="d-flex mb-4 gap-5">
                        <label for="teamSelector" class="form-label">Sélectionnez une équipe :</label>
                        <select id="teamSelector" v-model="selectedTeam" @change="refreshData" class="form-select">
                            <option value="Toutes" selected>Toutes les équipes</option>
                            <option v-for="team in details" :key="team.team.id" :value="team.team.id">
                                {{ team.team.name }}
                            </option>
                        </select>
                        <button @click="resetSelection" class="btn btn-dark btn-rounded">
                            Réinitialiser la sélection
                        </button>
                    </div>
                    <table class="table table-responsive">
                        <thead>
                            <tr>
                                <th scope="col">
                                    <button @click="sortByPos" class="btn btn-dark btn-rounded">Pos.</button>
                                </th>
                                <th scope="col">
                                    <button @click="sortByTeamName" class="btn btn-dark btn-rounded">Équipe</button>
                                </th>
                                <th scope="col">
                                    <button @click="sortByGamesPlayed" class="btn btn-dark btn-rounded">
                                        Matchs joués
                                    </button>
                                </th>
                                <th scope="col">
                                    <button @click="sortByPoints" class="btn btn-dark btn-rounded">Points</button>
                                </th>
                                <th scope="col">
                                    <button @click="sortByVictories" class="btn btn-dark btn-rounded">Victoires</button>
                                </th>
                                <th scope="col">
                                    <button @click="sortByDefeats" class="btn btn-dark btn-rounded">Défaites</button>
                                </th>
                                <th scope="col">
                                    <button @click="sortByGoalsScored" class="btn btn-dark btn-rounded">
                                        Buts marqués
                                    </button>
                                </th>
                                <th scope="col">
                                    <button @click="sortByGoalsConceded" class="btn btn-dark btn-rounded">
                                        Buts encaissés
                                    </button>
                                </th>
                                <th scope="col">
                                    <button @click="sortByDifferential" class="btn btn-dark btn-rounded">
                                        Différentiel
                                    </button>
                                </th>
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
                                <td>{{ row.games.win.total + row.games.win_overtime.total }}</td>
                                <td>{{ row.games.lose.total + row.games.lose_overtime.total }}</td>
                                <td>{{ row.goals.for }}</td>
                                <td>{{ row.goals.against }}</td>
                                <td>{{ row.goals.for - row.goals.against }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div v-else>
                    <p>Aucun détail de classement disponible pour le moment.</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";

export default {
    data() {
        return {
            details: [],
            selectedTeam: null
        };
    },
    mounted() {
        this.loadDataFromAPI();
    },

    methods: {
        async loadDataFromAPI() {
            const cacheKey = "teamsDetails";
            const cachedData = localStorage.getItem(cacheKey);

            if (cachedData) {
                const { data, timestamp } = JSON.parse(cachedData);

                if (Date.now() - timestamp < 40 * 60 * 1000) {
                    this.details = data;
                    return;
                }
            }

            const options = {
                method: "GET",
                url: "https://api-hockey.p.rapidapi.com/standings",
                params: {
                    league: "51",
                    season: "2024"
                },
                headers: {
                    "X-RapidAPI-Key": import.meta.env.VITE_API_KEY,
                    "X-RapidAPI-Host": "api-hockey.p.rapidapi.com"
                }
            };

            try {
                const response = await axios.request(options);
                this.details = response.data.response[0];
                this.cacheData(response.data.response[0]);
            } catch (error) {
                console.error("Erreur lors de la récupération des données depuis l'API", error);
            }
            localStorage.setItem(cacheKey, JSON.stringify({ data: this.details, timestamp: Date.now() }));
        },
        cacheData(data) {
            localStorage.setItem("teamsDetails", JSON.stringify({ data, timestamp: Date.now() }));
        },

        refreshData() {
            if (this.selectedTeam === "Toutes") {
                this.loadDataFromAPI();
            } else {
                const selectedTeamDetails = this.details.filter((team) => team.team.id === this.selectedTeam);
                this.details = selectedTeamDetails;
            }
        },

        resetSelection() {
            this.selectedTeam = "Toutes";
            this.loadDataFromAPI();
        },

        sortByPos() {
            this.details.sort((a, b) => a.position - b.position);
        },

        sortByTeamName() {
            this.details.sort((a, b) => a.team.name.localeCompare(b.team.name));
        },

        sortByGamesPlayed() {
            this.details.sort((a, b) => b.games.played - a.games.played);
        },

        sortByPoints() {
            this.details.sort((a, b) => b.points - a.points);
        },

        sortByVictories() {
            this.details.sort(
                (a, b) =>
                    b.games.win.total + b.games.win_overtime.total - (a.games.win.total + a.games.win_overtime.total)
            );
        },

        sortByDefeats() {
            this.details.sort(
                (a, b) =>
                    b.games.lose.total +
                    b.games.lose_overtime.total -
                    (a.games.lose.total + a.games.lose_overtime.total)
            );
        },

        sortByGoalsScored() {
            this.details.sort((a, b) => b.goals.for - a.goals.for);
        },

        sortByGoalsConceded() {
            this.details.sort((a, b) => b.goals.against - a.goals.against);
        },

        sortByDifferential() {
            this.details.sort((a, b) => b.goals.for - b.goals.against - (a.goals.for - a.goals.against));
        },

        getSelectedTeam() {
            return this.details.find((team) => team.team.id === this.selectedTeam);
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
.team {
    margin: 0;
    padding: 5px;
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

.btn-rounded {
    border-radius: 0.25rem;
    border: 1px solid #000;
}

#upperPage {
    padding: 20px;
    font-weight: bold;
    display: flex;
    flex-direction: nowrap;
}
</style>
