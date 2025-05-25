<template>
    <div class="container mt-4">
        <div class="row">
            <div class="col-md-6 offset-md-3">
                <div class="card">
                    <div class="card-body text-center">
                        <h5 class="card-title">Sélectionner une date</h5>
                        <div class="form-group">
                            <label for="datePicker">Date :</label>
                            <input
                                type="date"
                                id="datePicker"
                                class="form-control"
                                v-model="selectedDate"
                                @input="updateDate"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        initialDate: String
    },
    emits: ["update-date"],
    data() {
        return {
            selectedDate: this.initialDate
        };
    },
    watch: {
        initialDate(newValue) {
            this.selectedDate = newValue;
        }
    },
    methods: {
        updateDate() {
            this.$emit("update-date", this.selectedDate);
        }
    }
};
</script>

<style>
</style>
