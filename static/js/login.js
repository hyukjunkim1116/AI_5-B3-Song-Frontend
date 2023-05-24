console.log("login.js 연결됨")

async function handleLoginBtn() {
    const response = await handleLogin();

    if (response.status == 200) {
        const response_json = await response.json()

        localStorage.setItem("access", response_json.access);
        localStorage.setItem("refresh", response_json.refresh);

        const base64Url = response_json.access.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        localStorage.setItem("payload", jsonPayload)
        alert("환영합니다!")
        window.location.replace(`${frontend_base_url}/`)
    } else {
        alert("회원정보가 일치하지 않습니다!")
    }
}

checkLogin();

// 카카오 로그인 버튼 클릭 시 kakao auth에 코드 요청
async function kakaoLoginBtn() {
    const response = await fetch(`${backend_base_url}/api/users/kakao/`, { method: 'GET' })
    kakao_id = await response.json()
    const redirect_uri = `${frontend_base_url}/index.html`
    window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${kakao_id}&redirect_uri=${redirect_uri}&response_type=code&scope=profile_nickname,profile_image,account_email,gender`
}




