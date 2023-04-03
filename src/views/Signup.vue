<template>
    <div class="h-screen w-screen">
        <section class="grow h-full bg-gray-50 dark:bg-gray-900 bg-gradient-to-br from-purple-200 to-indigo-400">
            <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto h-full lg:py-0">
                <a href="/" class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                    <img class="w-20 h-20 rounded-lg" src="../assets/img/logo.png" alt="logo">
                </a>
                <div
                    class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div class="p-6 space-y-3 md:space-y-4 sm:p-8">
                        <h1
                            class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            注册
                        </h1>
                        <div class="space-y-2 md:space-y-3">
                            <div>
                                <label for="account"
                                    class="block text-sm font-medium text-gray-900 dark:text-white">邮箱</label>
                                <input type="email" name="email" id="email"
                                    class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="xxxxxx@xxx.com" required="">
                            </div>
                            <div>
                                <label for="password"
                                    class="block text-sm font-medium text-gray-900 dark:text-white">密码</label>
                                <input type="password" name="password" id="password" placeholder="••••••••"
                                    class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    required="">
                            </div>
                            <div>
                                <label for="password_confirm"
                                    class="block text-sm font-medium text-gray-900 dark:text-white">密码（再次确认）</label>
                                <input type="password" name="password_confirm" id="password_confirm" placeholder="••••••••"
                                    class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    required="">
                            </div>
                            <div>
                                <label for="nick_name"
                                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">用户昵称</label>
                                <input type="text" name="nick_name" id="nick_name"
                                    class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="xsource" required="">
                            </div>
                            <div class="flex items-start" :class="{ shake: shake_running }">
                                <div class="flex items-center h-5">
                                    <input id="terms" type="checkbox"
                                        class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
                                        required="">
                                </div>
                                <div class="ml-3 text-sm">
                                    <label for="terms" class="font-light text-gray-500 dark:text-gray-300">我接受 <a
                                            class="font-medium text-blue-600 hover:underline dark:text-blue-500"
                                            href="#">服务条款</a></label>
                                </div>
                            </div>
                            <button type="button" @click="sign_up"
                                class="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">创建账户</button>
                            <p class="text-sm font-light text-gray-500 dark:text-gray-400">已有账户？
                                <a href="/login"
                                    class="font-medium text-blue-600 hover:underline dark:text-blue-500">点击登录</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>
  
<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import {user_signup} from "@/utils/backend";
import Swal from 'sweetalert2'


const shake_running = ref(false);
const router = useRouter();

async function sign_up() {
    let terms = document.getElementById("terms");
    if (!terms.checked) {
        shake_running.value = true;
        setTimeout(() => { shake_running.value = false }, 1000);
        return;
    }

    for (let e of document.querySelectorAll('input')) {
        let ok = e.reportValidity();
        if (!ok) {
            return;
        }
    };

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let password_confirm = document.getElementById("password_confirm").value;
    let nick_name = document.getElementById("nick_name").value;
    if (password === "" || password_confirm === "" || email === "" || nick_name === "") {
        return;
    }

    if (password_confirm !== password) {
        Swal.fire({
            text: '两次输入的密码不同，请重新输入。',
            icon: 'error',
            confirmButtonText: '好的',
        });
        return;
    }

    let result = await user_signup({
        email, password, nick_name
    });
    if(result.status_code !== 0){
        Swal.fire({
            text: `注册失败，失败原因：${result.status_message}`,
            icon: 'error',
            confirmButtonText: '好的',
        })
    }else{
        let result = await Swal.fire({
            text: "注册成功，您可进入登陆界面进行登录。",
            icon: "success",
            confirmButtonText: "好的",
            showCancelButton: true,
            cancelButtonText: "取消",
            timer: 7000,
            timerProgressBar: true,
        });
        if(result.isConfirmed || result.dismiss === Swal.DismissReason.timer){
            router.push("/login");
            return;
        }
    }
}

</script>
  
<style scoped>
.shake {
    animation: shake 0.82s cubic-bezier(.36, .07, .19, .97) both;
    transform: translate3d(0, 0, 0);
}

@keyframes shake {

    10%,
    90% {
        transform: translate3d(-1px, 0, 0);
    }

    20%,
    80% {
        transform: translate3d(2px, 0, 0);
    }

    30%,
    50%,
    70% {
        transform: translate3d(-4px, 0, 0);
    }

    40%,
    60% {
        transform: translate3d(4px, 0, 0);
    }
}
</style>