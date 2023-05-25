console.log("login.js 연결됨")

checkLogin();

// 로그인 폼 다 쓰고 로그인 눌렀을 때 실행되는 함수
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


// 로그인 버튼 클릭 시 해당 auth에 코드 요청, redirect_uri로 URL 파라미터와 함께 이동
async function kakaoLoginBtn() {
    const response = await fetch(`${backend_base_url}/api/users/kakao/`, { method: 'GET' })
    const kakao_id = await response.json()
    const redirect_uri = `${frontend_base_url}/index.html`
    const scope = 'profile_nickname,profile_image,account_email,gender'
    window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${kakao_id}&redirect_uri=${redirect_uri}&response_type=code&scope=${scope}`
}

async function googleLoginBtn() {
    console.log("google")
    const response = await fetch(`${backend_base_url}/api/users/google/`, { method: 'GET' })
    const google_id = await response.json()
    const redirect_uri = `${frontend_base_url}/index.html`
    const scope = 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'
    const param = `scope=${scope}&include_granted_scopes=true&response_type=token&state=pass-through value&prompt=consent&client_id=${google_id}&redirect_uri=${redirect_uri}`
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${param}`
}

async function naverLoginBtn() {
    const response = await fetch(`${backend_base_url}/api/users/naver/`, { method: 'GET' });
    const naver_id = await response.json();
    console.log(naver_id)
    const redirect_uri = `${frontend_base_url}/index.html`;
    const state = new Date().getTime().toString(36);
    window.location.href = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${naver_id}&redirect_uri=${redirect_uri}&state=${state}`;
}