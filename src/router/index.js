import { createRouter, createWebHashHistory } from "vue-router";
import CalendrierView from "@/views/CalendrierView.vue";
import ClassementView from "@/views/ClassementView.vue";
import TeamsStats from "@/views/TeamsStats.vue";
import MatchDetailsView from "@/views/MatchDetailsView.vue";
import HomePage from "@/views/HomeView.vue";
const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "/home",
            component: HomePage
        },
        {
            path: "/matchdetails/:id",
            name: "matchDetails",
            component: MatchDetailsView
        },
        {
            path: "/calendrier",
            name: "calendrier",
            component: CalendrierView
        },
        {
            path: "/classement",
            name: "classement",
            component: ClassementView
        },
        {
            path: "/teams",
            name: "teamsstats",
            component: TeamsStats
        }
    ]
});

export default router;
