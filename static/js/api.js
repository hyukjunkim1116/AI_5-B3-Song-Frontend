console.log("api.js 연결됨")

const frontend_base_url = "http://127.0.0.1:5500"
const backend_base_url = "http://127.0.0.1:8000"

// 로그인 상태에서 로그인, 회원가입 페이지 접속 시 홈으로 이동하는 함수
function checkLogin() {
    const payload = localStorage.getItem("payload")
    if (payload) {
        window.location.replace(`${frontend_base_url}/`)
    }
}

// 비로그인 상태에서 글쓰기 페이지 접속 시 홈으로 이동하는 함수
function checkNotLogin() {
    const payload = localStorage.getItem("payload")
    if (payload == null) {
        window.location.replace(`${frontend_base_url}/`)
    }
}

// 회원가입
async function handleSignin() {
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    // const passwordCheck = document.getElementById("password-check").value
    const nickname = document.getElementById("nickname").value
    const gender = document.getElementById("gender").value
    const age = document.getElementById("age").value

    const response = await fetch(`${backend_base_url}/api/users/signup/`, {
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            "email": email,
            "password": password,
            // "password2": passwordCheck,
            "nickname": nickname,
            "gender": gender,
            "age": age,
        })
    })

    return response
}

// 로그인
async function handleLogin() {
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value

    const response = await fetch(`${backend_base_url}/api/users/login/`, {
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            "email": email,
            "password": password
        })
    })

    return response
}

// 로그아웃
function handleLogout() {
    localStorage.removeItem("access")
    localStorage.removeItem("refresh")
    localStorage.removeItem("payload")
    window.location.replace(`${frontend_base_url}/`)
}

// 유저 정보 조회
async function getUser() {
    const payload = localStorage.getItem("payload")
    const payload_parse = JSON.parse(payload)
    let token = localStorage.getItem("access")
    const response = await fetch(`${backend_base_url}/api/users/profile/${payload_parse.user_id}/`, {
        headers: {
            "Authorization": `Bearer ${token}`
        },
        method: "GET",
    })

    if (response.status == 200) {
        response_json = await response.json()
        console.log(response_json)
        return response_json
    } else {
        alert(response.statusText)
    }
}