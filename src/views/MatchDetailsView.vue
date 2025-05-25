<template>
    <MatchDetails :matchId="$route.params.id" />
</template>
<script>
import MatchDetails from "../components/MatchDetails.vue";

export default { components: { MatchDetails } };
</script>
