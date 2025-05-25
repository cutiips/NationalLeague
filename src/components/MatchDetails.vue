<template>
    <div>
        <div v-if="matchDetails">
            <div class="match-info">
                <div class="box-match">
                    <div class="team">
                        <img
                            :src="getTeamLogo(matchDetails.teams.home.name)"
                            alt="Logo équipe domicile"
                            class="team-logo"
                        />
                        contre
                        <img
                            :src="getTeamLogo(matchDetails.teams.away.name)"
                            alt="Logo équipe extérieure"
                            class="team-logo"
                        />
                    </div>
                    <div class="time">{{ matchDetails.time }}</div>
                </div>
                <div class="status">{{ matchDetails.status.long }}</div>
                <div class="scores">
                    {{ matchDetails.teams.home.name }} {{ matchDetails.scores.home }} -
                    {{ matchDetails.scores.away }}
                    {{ matchDetails.teams.away.name }}
                </div>
                <div class="periods">
                    <div>1st Period: {{ matchDetails.periods.first }}</div>
                    <div>2nd Period: {{ matchDetails.periods.second }}</div>
                    <div>3rd Period: {{ matchDetails.periods.third }}</div>
                    <div>Overtime: {{ matchDetails.periods.overtime }}</div>
                </div>
            </div>
        </div>
        <div v-else>
            <p>Loading match details...</p>
        </div>
    </div>
</template>

<script>
import axios from "axios";

export default {
    props: {
        matchId: Number
    },
    data() {
        return {
            matchDetails: null
        };
    },
    mounted() {
        if (!isNaN(this.matchId) && this.matchId > 0) {
            this.loadMatchDetails(this.matchId);
        } else {
            console.error("ID de match invalide");
        }
    },
    methods: {
        async loadMatchDetails(matchId) {
            const apiUrl = `https://api-hockey.p.rapidapi.com/games?id=${matchId}`;

            const options = {
                method: "GET",
                url: apiUrl,
                headers: {
                    "X-RapidAPI-Key": import.meta.env.VITE_API_KEY,
                    "X-RapidAPI-Host": "api-hockey.p.rapidapi.com"
                }
            };

            try {
                const response = await axios.request(options);
                this.matchDetails = response.data.response[0];
            } catch (error) {
                console.error("Erreur lors de la récupération des détails du match depuis l'API", error);
            }
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
                Rapperswil: "https://media.api-sports.io/hockey/teams/553.png",
                "EHC Kloten": "https://media.api-sports.io/hockey/teams/561.png",
                Ajoie: "https://media.api-sports.io/hockey/teams/558.png"
            };

            if (teamName in teamLogos) {
                return teamLogos[teamName];
            }

            return "ça ne fonctionne pas :(";
        }
    }
};
</script>

<style>
.box-match {
    margin-top: 90px;
}
.match-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    background-color: #f4f4f4;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    text-align: center;
}

.team {
    display: flex;
    align-items: center;
    font-size: 24px;
    margin-bottom: 10px;
}

.team-logo {
    max-width: 50px;
    margin: 0 10px;
}

.time {
    font-size: 20px;
    color: #333;
    margin-top: 10px;
}

.status,
.scores,
.periods {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    text-align: center;
    font-size: 20px;
    color: #666;
    margin-top: 10px;
}

.status {
    font-weight: bold;
    margin-top: 20px;
    color: #ff0000;
}

.scores {
    font-weight: bold;
}
</style>
