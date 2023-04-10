<template>
    <div class="h-full w-full bg-green-800">
        <img src="https://image.tmdb.org/t/p/original/7kzMdMTGJWIIw9CHh4gqqZmD4uI.jpg" alt="请刷新后重试">
        <div class="absolute left-[60%] top-[20%] z-10">
            <button class="h-10 w-10 rounded-full opacity-0 hover:opacity-100 bg-black/50 transition-opacity duration-500 ease-in-out"
            @click="click_btn"></button>
        </div>
    </div>
</template>

<script setup>
import Swal from 'sweetalert2';
import {after_sale_voyage_check_result} from "@/utils/backend"
import {Toast} from "@/utils/sweetalert"
import {voyage_progress} from "@/utils/voyage"

async function click_btn(){
    let result = await Swal.fire({
        input: 'text',
    });
    Swal.fire({
      icon:"warning",
      text: `正在检查是否通关，请稍后`,
      didOpen: ()=>{Swal.showLoading();},
      allowOutsideClick: () => !Swal.isLoading()
    });
    result = await after_sale_voyage_check_result({
      level: 2,
      result: result.value,
    });
    if (result.status_code !== 0) {
        await Swal.fire({
            icon: 'error',
            text: `检查结果失败，原因：${result.status_message}`
        });
        return;
    }else if (result.data !== undefined) {
        if (!result.data.pass) {
            await Swal.fire({
                icon: 'warning',
                text: result.data.fail_reason
            });
        } else {
            await Toast.fire({
                icon: 'success',
                text: `结果检查通过，通往下一关按钮将出现`
            });
            voyage_progress.show_next_btn = true;
        }
    }
}
</script>

<style scoped>
</style>