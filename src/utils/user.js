import {reactive} from "vue";
import default_profile from "@/assets/img/default_profile.png";

export const user_info = reactive({
    login: false,
    user_id: 0,
    nick_name: "",
    profile: default_profile,
});

update_user_info();

export function get_cookie(name){
    let match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
}

function parse_jwt (token) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

export function update_user_info(){
    let token = get_cookie("token");
    if(token){
        let payload = parse_jwt(token)
        if(payload.exp < Math.floor(Date.now() / 1000)){
            user_info.login = false;
            user_info.user_id = 0;
            user_info.profile = default_profile;
        }else{
            user_info.login = true;
            user_info.user_id=payload.user_id;
        }
    }else{
        user_info.login = false;
        user_info.user_id = 0;
        user_info.profile = default_profile;
    }
}