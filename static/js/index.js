// 로그인 되어있다면(localstorage에 토큰이 있다면) 로그인 되어있으므로 pass
// 토큰이 없고, url에 파라미터가 있다면, 해당 값을 판별해서 해당하는 함수를 호출합니다
if (localStorage.getItem("payload")) { }
else if (location.href.split('=')[1]) {
    let code = new URLSearchParams(window.location.search).get('code');
    let state = new URLSearchParams(window.location.search).get('state');
    if (code) {
        if (state) { getNaverToken(code, state); }
        else { getKakaoToken(code); }
    }
    else {
        let hashParams = new URLSearchParams(window.location.hash.substr(1));
        let google_token = hashParams.get("access_token");
        getGoogleToken(google_token);
    }
}

// 받아온 토큰을 로컬 스토리지에 저장
// 에러 발생 시, 에러 문구를 띄워주고 이전 페이지(로그인페이지)로 돌아갑니다
function setLocalStorage(response) {
    if (response.status === 200) {
        localStorage.setItem("access", response_json.access);
        localStorage.setItem("refresh", response_json.refresh);
        const base64Url = response_json.access.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        localStorage.setItem("payload", jsonPayload);
        window.location.reload();
    } else {
        alert(response_json['error']);
        window.history.back();
    }
}

// 각각 해당하는 url로 데이터를 실어서 요청을 보내고 액세스 토큰을 받아오는 함수
async function getKakaoToken(kakao_code) {
    const response = await fetch(`${backend_base_url}/api/users/kakao/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ code: kakao_code })
    });
    response_json = await response.json();
    setLocalStorage(response);
}

async function getGoogleToken(google_token) {
    const response = await fetch(`${backend_base_url}/api/users/google/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "access_token": google_token }),
    })
    response_json = await response.json();
    setLocalStorage(response);
}

async function getNaverToken(naver_code, state) {
    const response = await fetch(`${backend_base_url}/api/users/naver/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "naver_code": naver_code, "state": state }),
    })
    response_json = await response.json();
    setLocalStorage(response);
}


function uploadPhoto(article_id) {
    window.location.href = `${frontend_base_url}/upload_photo.html?article_id=${article_id}`;
}

//메인페이지 좋아요순 댓글, 최신순 게시글 가져오기
window.onload = async function () {
	const like_comments = await getComments();
	like_comments.sort((x, y) => y.like_count - x.like_count);

	const recently_articles = await getArticles();

	const comments_list = document.getElementById("most-like-comment");
	commentList(like_comments.slice(0, 9), comments_list);

	const article_list = document.getElementById("recently-article");
	articleList(recently_articles.slice(0, 9), article_list);
};
