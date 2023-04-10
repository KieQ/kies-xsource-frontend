<template>
    <div>
        <TransitionGroup name="bounce">
            <div v-if="voyage_progress.level === 0">
                <VideoBackground :src="background_video" :poster="background_poster" class="h-screen">
                    <div class="flex w-screen z-10 flex-row-reverse	pr-2 pt-1">
                        <button
                            class="text-white w-28 h-10 opacity-0 hover:opacity-100 transition-opacity duration-500	ease-in-out bg-black/50 rounded-lg"
                            @click="logout" v-if="user_info.login">
                            退出登陆
                        </button>
                    </div>
                    <div class="flex flex-row h-screen w-screen justify-center items-center space-x-2">
                        <button
                            class="text-white w-40 h-20 opacity-0 hover:opacity-100 transition-opacity duration-500	ease-in-out bg-black/50 rounded-lg"
                            @click="start_or_continue_trip" v-if="user_info.login && button_control.valid && button_control.progress === 0">
                            开启冒险
                        </button>
                        <button
                            class="text-white w-40 h-20 opacity-0 hover:opacity-100 transition-opacity duration-500	ease-in-out bg-black/50 rounded-lg"
                            @click="start_or_continue_trip" v-if="user_info.login && button_control.valid && button_control.progress === 1">
                            继续冒险
                        </button>
                        <button
                            class="text-white w-40 h-20 opacity-0 hover:opacity-100 transition-opacity duration-500	ease-in-out bg-black/50 rounded-lg"
                             v-if="user_info.login && button_control.valid && button_control.progress === 2">
                            查看留言
                        </button>
                        <button
                            class="text-white w-40 h-20 opacity-0 hover:opacity-100 transition-opacity duration-500	ease-in-out bg-black/50 rounded-lg"
                            @click="start_over" v-if="button_control.valid && button_control.progress !== 0">
                            重启冒险
                        </button>

                        <button
                            class="text-white w-40 h-20 opacity-0 hover:opacity-100 transition-opacity duration-500	ease-in-out bg-black/50 rounded-lg"
                            @click="to_login" v-if="!user_info.login">
                            登录
                        </button>
                    </div>
                </VideoBackground>
            </div>
            <div v-if="voyage_progress.level === 1">
                <div class="h-screen w-screen">
                    <FlappyBirdGame></FlappyBirdGame>
                </div>
            </div>
            <div v-if="voyage_progress.level === 2">
                <div class="h-screen w-screen">
                    <MoneyHeist></MoneyHeist>
                </div>
            </div>
            <div v-if="voyage_progress.level === 3">
                <div class="h-screen w-screen">
                    <PrimeNumber></PrimeNumber>
                </div>
            </div>
        </TransitionGroup>
        <Transition name="fade">
            <button class="text-white w-20 h-20 absolute -ml-10 left-1/2 bottom-5 bg-black/50 rounded-full z-10 flex justify-center items-center select-none" @click="to_next"
                v-if="voyage_progress.show_next_btn">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                    class="bi bi-arrow-bar-down w-7 h-7" viewBox="0 0 16 16">
                    <path fill-rule="evenodd"
                        d="M1 3.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13a.5.5 0 0 1-.5-.5zM8 6a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 0 1 .708-.708L7.5 12.293V6.5A.5.5 0 0 1 8 6z" />
                </svg>
            </button>
        </Transition>
    </div>
</template>

<script setup>
import VideoBackground from 'vue-responsive-video-background-player';
import background_video from "@/assets/video/mountain.mp4";
import background_poster from "@/assets/img/mountain.jpeg";
import { user_logout, after_sale_voyage_next_step, after_sale_voyage_check_progress, after_sale_voyage_start_or_continue_trip, after_sale_voyage_start_over } from "@/utils/backend";
import { user_info } from '../utils/user';
import { useRouter } from "vue-router";
import { Toast } from "@/utils/sweetalert";
import Swal from "sweetalert2"
import { onMounted, reactive, ref } from 'vue';
import FlappyBirdGame from "@/components/voyage/flappy_bird/FlappyBirdGame.vue"
import MoneyHeist from '../components/voyage/money_heist/MoneyHeist.vue';
import { voyage_progress } from "@/utils/voyage"
import PrimeNumber from '../components/voyage/prime_number/PrimeNumber.vue';

const router = useRouter();

const button_control = reactive({
    level: 0,
    progress: 0,
    valid: false,
});

onMounted(async () => {
    if (user_info.login) {
        let result = await after_sale_voyage_check_progress(user_info.user_id)
        if (result.status_code !== 0) {
            Toast.fire({
                icon: 'error',
                text: `检查进度失败，原因：${result.status_message}`
            })
        } else {
            if (result.data !== undefined) {
                button_control.level = result.data.level;
                button_control.progress = result.data.progress;
                button_control.valid = true;
            }
        }
    }
});



async function start_or_continue_trip() {
    let result = await after_sale_voyage_start_or_continue_trip(button_control.level)
    if (result.status_code !== 0) {
        Toast.fire({
            icon: 'error',
            text: `开启探索失败，${result.status_message}`
        })
    } else {
        if (result.data !== undefined) {
            if (result.data.cleared) {
                await Swal.fire({
                    text: '您已经通关，是否进入终点。',
                    icon: 'question',
                    confirmButtonText: '好的',
                    showDenyButton: true,
                    denyButtonText: "不用"
                });
            } else {
                voyage_progress.level = result.data.level;
                voyage_progress.seed = result.data.seed;
            }
        }
    }
}

async function logout() {
    let result = await user_logout();
    if (result.status_code !== 0) {
        await Toast.fire({
            icon: 'warning',
            text: `退出登录失败，失败原因：${result.status_message}`,
        });
    } else {
        await Toast.fire({
            icon: 'success',
            text: "退出登录成功",
        });
    }
}

function to_login() {
    router.push("/login");
}

async function start_over() {
    let result = await Swal.fire({
        text: "重启冒险会丢失当前进度，确定继续？",
        icon: "question",
        showCancelButton: true,
        cancelButtonText: "取消",
        confirmButtonText: "确定",
    });
    if (result.isDismissed) {
        return;
    }
    result = await after_sale_voyage_start_over(button_control.level);
    if (result.status_code !== 0) {
        Swal.fire({
            icon: 'warning',
            text: `重启探索失败，失败原因：${result.status_message}`,
        });
    } else {
        if (result.data !== undefined) {
            voyage_progress.level = result.data.level;
            voyage_progress.seed = result.data.seed;
        }
    }
}

async function to_next() {
    let result = await after_sale_voyage_next_step(voyage_progress.level);
    if (result.status_code !== 0) {
        Swal.fire({
            icon: 'warning',
            text: `开启下一步失败，失败原因：${result.status_message}`,
        });
    } else {
        if (result.data !== undefined) {
            if (result.data.cleared) {
                await Swal.fire({
                    icon: "success",
                    text: "已通关",
                });
            } else {
                voyage_progress.level = result.data.level;
                voyage_progress.seed = result.data.seed;
                voyage_progress.show_next_btn = false;
            }
        }
    }
}

</script>

<style scoped>
.bounce-enter-active {
    animation: bounce-in 0.5s;
}

.bounce-leave-active {
    animation: bounce-in 0.5s reverse;
}

@keyframes bounce-in {
    0% {
        transform: scale(0);
    }

    50% {
        transform: scale(1.25);
    }

    100% {
        transform: scale(1);
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>