<template>
    <div class="h-full  w-full bg-green-800">
        <div class="h-full w-full flex flex-col justify-center items-center text-white font-mono text-7xl" v-if="show_btn">
            <button @click="start_show">开始</button>
        </div>
        <div id='text' class="text-white font-mono text-7xl absolute" v-show="current_num !== undefined">{{ current_num }}
        </div>
    </div>
</template>

<script setup>
import { voyage_progress } from "@/utils/voyage";
import { wasm } from "@/utils/wasm";
import { ref } from 'vue';
import Swal from 'sweetalert2';
import { after_sale_voyage_check_result } from '@/utils/backend'
import { Toast } from '@/utils/sweetalert'
import { useRouter } from "vue-router";

const show_btn = ref(true);
const current_num = ref(undefined);
const router = useRouter();

async function sleep(millionseconds) {
    return new Promise(resolve => setTimeout(resolve, millionseconds));
}

async function start_show() {
    show_btn.value = false;
    let r_num = wasm.random(voyage_progress.seed, 100);
    for (let i = 0; i < r_num.size(); i++) {
        render_number(r_num.get(i));
        await sleep(1000);
    }
    render_number(undefined);
    let result = await Swal.fire({
        text: "也许你需要输入些什么",
        input: 'text',
        preConfirm: async (value) => {
            if (!Number.isInteger(parseInt(value))) {
                Swal.showValidationMessage("需要输入数字");
            }
        },
    });

    Swal.fire({
        icon: "warning",
        text: `正在检查答案是否正确，请稍后`,
        didOpen: () => { Swal.showLoading(); },
        allowOutsideClick: () => !Swal.isLoading()
    });

    let r = await after_sale_voyage_check_result({
        level: 3,
        result: result.value,
    });
    if (r.status_code !== 0) {
        await Swal.fire({
            icon: 'error',
            text: `检查结果失败，原因：${r.status_message}`
        });
    } else if (r.data !== undefined) {
        if (r.data.started_over) {
            await Swal.fire({
                icon: 'warning',
                text: `结果不正确，探索已重新开始`,
                timer: 10000,
                timerProgressBar: true,
            });
        }
        else if (r.data.pass) {
            await Toast.fire({
                icon: 'success',
                text: `结果检查通过，将返回首页，留言界面也将为您打开`,
            });
        } else {
            await Swal.fire({
                icon: 'warning',
                text: r.data.fail_reason,
            });
        }
        window.location.reload();
    }
}

function render_number(num) {
    if (num === undefined) {
        current_num.value = num;
        return;
    }
    current_num.value = num;
    let max_width = document.body.clientWidth;
    let max_height = document.body.clientHeight;
    let t = document.getElementById('text');
    t.style.left = `${Math.floor(Math.random() * (max_width - t.getBoundingClientRect().width))}px`;
    t.style.top = `${Math.floor(Math.random() * (max_height - t.getBoundingClientRect().height))}px`;
}

</script>

<style scoped></style>