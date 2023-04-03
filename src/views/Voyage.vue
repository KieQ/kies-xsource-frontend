<template>
    <div>
        <TransitionGroup name="bounce">
            <div v-if="current_page === 0">
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
                            @click="start_or_continue_trip" v-if="user_info.login && voyage_progress.valid">
                            {{ voyage_progress.progress === 0 ? "开启冒险" : "继续冒险" }}
                        </button>
                        <button
                            class="text-white w-40 h-20 opacity-0 hover:opacity-100 transition-opacity duration-500	ease-in-out bg-black/50 rounded-lg"
                            @click="start_over" v-if="voyage_progress.valid && voyage_progress.progress !== 0">
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
            <div v-if="current_page === 1">
                <div class="h-screen w-screen">
                    <FlappyBirdGame></FlappyBirdGame>
                </div>
            </div>
            <div v-if="current_page === 2">
                <div class="h-screen w-screen bg-green-100">
                    Hello
                </div>
            </div>
            <div v-if="current_page === 3">
                <div class="h-screen w-screen bg-green-100">
                    Hello
                </div>
            </div>
            <div v-if="current_page === 4">
                <div class="h-screen w-screen bg-green-100">
                    Hello
                </div>
            </div>
            <div v-if="current_page === 5">
                <div class="h-screen w-screen bg-green-100">
                    Hello
                </div>
            </div>
        </TransitionGroup>
    </div>
</template>

<script setup>
import VideoBackground from 'vue-responsive-video-background-player';
import background_video from "@/assets/video/mountain.mp4";
import background_poster from "@/assets/img/mountain.jpeg";
import { user_logout, after_sale_voyage_check_progress, after_sale_voyage_start_or_continue_trip, after_sale_voyage_start_over} from "@/utils/backend";
import { user_info } from '../utils/user';
import { useRouter } from "vue-router";
import { Toast } from "@/utils/sweetalert";
import Swal from "sweetalert2"
import { onMounted, reactive, ref } from 'vue';
import FlappyBirdGame from "@/components/flappy_bird/FlappyBirdGame.vue"

const router = useRouter();

const voyage_progress = reactive({
    level: 0,
    progress: 0,
    valid: false,
});

const current_page = ref(0);

onMounted(async () => {
    if (user_info.login) {
        let result = await after_sale_voyage_check_progress(user_info.user_id)
        if (result.status_code !== 0) {
            Toast.fire({
                icon: 'error',
                text: `检查进度失败，${result.status_message}`
            })
        } else {
            if (result.data !== undefined) {
                voyage_progress.level = result.data.level;
                voyage_progress.progress = result.data.progress;
                voyage_progress.valid = true;
            }
        }
    }
});


async function start_or_continue_trip() {
    let result = await after_sale_voyage_start_or_continue_trip(voyage_progress.level)
    if (result.status_code !== 0) {
        Toast.fire({
            icon: 'error',
            text: `开启探索失败，${result.status_message}`
        })
    } else {
        if (result.data !== undefined) {
            if (result.data.passed) {
                await Swal.fire({
                    text: '您已经通关，是否进入终点。',
                    icon: 'question',
                    confirmButtonText: '好的',
                    showDenyButton: true,
                    denyButtonText: "不用"
                });
            } else {
                current_page.value = result.data.level;
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
    if(result.isDismissed){
        return;
    }
    result = await after_sale_voyage_start_over(voyage_progress.level);
    if(result.status_code !== 0){
        Swal.fire({
            icon: 'warning',
            text: `重启探索失败，失败原因：${result.status_message}`,
        });
    }
    if(result.data !== undefined){
        current_page.value = result.data.level;
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
}</style>