import {update_user_info, user_info} from "@/utils/user";

const api = "/api"

//TODO Debug code, delete later
// const api = "http://localhost:8080"

async function do_fetch(url, option){
    //TODO Debug code, delete later
    // option = Object.assign(option||{}, {credentials:"include"})

    let result = await fetch(`${api}${url}`, option)
    if(result.status !== 200){
        throw Error(result.statusText);
    }
    update_user_info();
    return await result.json();
}

export async function user_signup(user_info){
    return await do_fetch("/user/signup", {
        method: "POST",
        body: JSON.stringify(user_info)
    });
}

export async function user_login(email, password, remember_me){
    return await do_fetch("/user/login", {
        method: "POST",
        body: JSON.stringify({email, password, remember_me})
    });
}

export async function user_logout(){
    if(!user_info.login) return;
    let user_id = user_info.user_id;
    return await do_fetch("/user/logout", {
        method: "POST",
        body: JSON.stringify({user_id})
    });
}

export async function user_update(user_id, update_data){
    return await do_fetch("/user/update", {
        method: "POST",
        body: JSON.stringify({
            user_id,
            ...update_data
        })
    })
}

export async function user_list(page, size){
    return await do_fetch("/user/list?" + new URLSearchParams({
        page, size
    }));
}


export async function user_detail(user_id){
    return await do_fetch("/user/detail?" + new URLSearchParams({
        user_id
    }));
}


export async function after_sale_voyage_check_progress(user_id) {
    return await do_fetch("/after_sale/voyage/check_progress?" + new URLSearchParams({
        user_id
    }));
}

export async function after_sale_voyage_start_or_continue_trip(level) {
    return await do_fetch("/after_sale/voyage/start_or_continue_trip", {
        method: "POST",
        body: JSON.stringify({level})
    });
}

export async function after_sale_voyage_start_over(level) {
    return await do_fetch("/after_sale/voyage/start_over", {
        method: "POST",
        body: JSON.stringify({level})
    });
}

