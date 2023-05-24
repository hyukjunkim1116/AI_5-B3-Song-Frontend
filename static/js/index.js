// 로그인 되어있다면(localstorage에 kakao토큰이 있다면) if문에서 아무일도 없음.
// 토큰이 없고, url에 파라미터가 있다면, 해당 값을 가지고 getKakaoToken()으로
if (localStorage.getItem("payload")) {
} else if (location.href.split("=")[1]) {
    const kakao_code = location.href.split("=")[1];
    getKakaoToken(kakao_code);
}

// url의 코드를 백엔드로 보내서 userdata를 확인
// 해당 유저가 이미 있다면 토큰만 , 없다면 유저를 생성 후 토큰 발급
// 해당 토큰을 로컬 스토리지에 저장
async function getKakaoToken(code) {
    const response = await fetch(`${backend_base_url}/api/users/kakao/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ code: code })
    });
    response_json = await response.json();
    if (response.status === 200) {
        localStorage.setItem("access", response_json.access);
        localStorage.setItem("refresh", response_json.refresh);

        const base64Url = response_json.access.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map(function (c) {
                    return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join("")
        );

        localStorage.setItem("payload", jsonPayload);
        window.location.reload();
    } else {
        alert(response_json["error"]);
        window.history.back();
    }
}
function uploadPhoto(article_id) {
    window.location.href = `${frontend_base_url}/upload_photo.html?article_id=${article_id}`;
}

//메인페이지 좋아요순 댓글, 최신순 게시글 가져오기
window.onload = async function () {
    const like_comments = await getComments()
    like_comments.sort((x, y) => y.like_count - x.like_count)

    const recently_articles = await getArticles()

    const comments_list = document.getElementById("most-like-comment")
    commentList(like_comments.slice(0, 10), comments_list)

    const article_list = document.getElementById("recently-article")
    articleList(recently_articles.slice(0, 10), article_list)
}
