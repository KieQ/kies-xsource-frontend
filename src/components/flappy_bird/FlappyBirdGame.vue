<template>
    <div class="h-full w-full bg-green-800">
        <TransitionGroup name="fade">
            <HomePage @to_game="to_game" v-if="!show_game_page"></HomePage>
            <GamePage @to_home="to_next" v-if="show_game_page"></GamePage>
        </TransitionGroup>
    </div>
</template>

<script setup>
import HomePage from './HomePage.vue';
import GamePage from './GamePage.vue';
import {ref} from "vue";

const show_game_page = ref(false);

function to_next(){
    
}

function to_game(){
    show_game_page.value = true;
}

</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>