<template>
  <div class="h-screen w-screen">
    <div
      class="grow flex flex-row justify-center items-center h-full w-full text-gray-800 bg-gradient-to-br from-purple-200 to-indigo-400">
      <div class="flex flex-col md:flex-row justify-center md:justify-around items-center flex-wrap h-full g-6">
        <div class="grow-0 shrink-1 md:shrink-0 basis-auto xl:w-6/12 lg:w-6/12 md:w-9/12 mb-12 md:mb-0">
          <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp" class="w-full"
            alt="Login Page" />
        </div>
        <div class="xl:ml-20 xl:w-5/12 lg:w-5/12 md:w-8/12 mb-12 md:mb-0">
          <form>
            <!-- email input -->
            <div class="mb-6">
              <input type="email" name="email" id="email"
                class="border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="邮箱" required="">
            </div>

            <!-- Password input -->
            <div class="mb-6">
              <input type="password" name="password" id="password"
                class="border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="密码" required="">
            </div>

            <div class="flex justify-between space-x-4 items-center mb-6">
              <div>
                <input type="checkbox"
                  class="h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                  id="remember_me" />
                <label class="inline-block text-gray-800" for="rememberMeInput">记住我</label>
              </div>
              <a href="#" class="text-gray-800">忘记密码？</a>
            </div>

            <div class="text-center lg:text-left">
              <button type="button" @click="login"
                class="inline-block px-7 py-3 bg-blue-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out">
                登录
              </button>
              <p class="text-sm  mt-2 pt-1 mb-0">
                没有账户？
                <a href="/signup"
                  class="text-red-600 hover:text-red-700 focus:text-red-700 transition duration-200 ease-in-out">注册</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script setup>
import { useRouter } from "vue-router";
import { user_login } from "@/utils/backend";
import { user_info } from "@/utils/user";
import Swal from "sweetalert2";
const router = useRouter();

async function login() {
  for (let e of document.querySelectorAll('input')) {
    let ok = e.reportValidity();
    if (!ok) {
      return;
    }
  };

  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  let remember_me = document.getElementById("remember_me").checked;

  let result = await user_login(email, password, remember_me);
  if (result.status_code !== 0) {
    Swal.fire({
      text: `登陆失败，失败原因：${result.status_message}`,
      icon: 'error',
      confirmButtonText: '好的',
    });
    return;
  }

  if (result.data !== undefined) {
    user_info.nick_name = result.data.nick_name;
    if (result.data.profile !== "") {
      user_info.profile = result.data.profile
    }
  }

  await Swal.fire({
    text: "登陆成功",
    icon: "success",
    confirmButtonText: "好的",
    timer: 5000,
    timerProgressBar: true,
  });
  
  router.push("/");
}


</script>
  
<style scoped></style>