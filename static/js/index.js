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
window.onload = async function loadArticles() {
	articles = await getArticles();
	const article_list = document.getElementById("articles");

	articles.forEach((article) => {
		const articlePhoto = article.photos[0]?.file;
		// console.log(articlePhoto["file"]);
		const newArticle = document.createElement("div");
		const articleImage = document.createElement("img");
		articleImage.setAttribute("src", `${articlePhoto}`);
		articleImage.setAttribute("onclick", `uploadPhoto(${article.pk})`);
		newArticle.setAttribute("id", article.pk);
		newArticle.innerText = article.title;
		// newArticle.setAttribute("onclick", "articleDetail(this.id)");
		newArticle.appendChild(articleImage);
		article_list.appendChild(newArticle);
	});
};
