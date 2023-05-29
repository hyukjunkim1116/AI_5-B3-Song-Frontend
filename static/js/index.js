// 로그인 되어있다면(localstorage에 토큰이 있다면) 로그인 되어있으므로 pass
// 토큰이 없고, url에 파라미터가 있다면, 해당 값을 판별해서 해당하는 함수를 호출
if (localStorage.getItem("payload")) {
} else if (location.href.split("=")[1]) {
	let code = new URLSearchParams(window.location.search).get("code");
	let state = new URLSearchParams(window.location.search).get("state");
	let hashParams = new URLSearchParams(window.location.hash.substr(1));
	let google_token = hashParams.get("access_token");
	if (code) {
		if (state) {
			getNaverToken(code, state);
		} else {
			getKakaoToken(code);
		}
	} else if (google_token) {
		getGoogleToken(google_token);
	}
}

// 받아온 토큰을 로컬 스토리지에 저장
// 에러 발생 시, 에러 문구를 띄워주고 이전 페이지(로그인페이지)로
function setLocalStorage(response) {
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
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ access_token: google_token })
	});
	response_json = await response.json();
	setLocalStorage(response);
}

async function getNaverToken(naver_code, state) {
	const response = await fetch(`${backend_base_url}/api/users/naver/`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ naver_code: naver_code, state: state })
	});
	response_json = await response.json();
	setLocalStorage(response);
}

// 사진 아이콘 클릭 시 해당 게시글 id를 가지고 사진 업로드 페이지로 이동하는 함수
// function uploadPhoto(article_id) {
//     window.location.href = `${frontend_base_url}/upload_photo.html?article_id=${article_id}`;
// }

function handleSearchBtn(event) {
	if (event.keyCode == 13) {
		event.preventDefault();
		handleSearch();
	}
}

// 검색 버튼 클릭 시 검색어를 가지고 게시글 목록으로 이동하는 함수
async function handleSearch() {
	const query = document.getElementById("query").value;
	if (query) {
		window.location.href = `${frontend_base_url}/articles/articles_list.html?query=${query}`;
	} else {
		alert("검색어를 입력해 주세요!");
	}
}

// 메인 게시글 목록 UI
function mainArticleList(articles, list_div) {
	articles.forEach(async (article) => {
		const newCardBox = document.createElement("li");
		newCardBox.setAttribute("class", "card-box");

		const newCard = document.createElement("div");
		newCard.setAttribute("class", "card h-100");
		newCard.setAttribute("id", `article-${article.pk}`);
		newCard.setAttribute("onclick", `articleDetail(${article.pk})`);
		newCard.style.cursor = "pointer";
		newCardBox.appendChild(newCard);

		const articlePhoto = article.photos[0]?.file;
		const articleImage = document.createElement("img");
		articleImage.setAttribute("class", "card-img-top");
		if (articlePhoto) {
			articleImage.setAttribute("src", `${articlePhoto}`);
		} else {
			articleImage.setAttribute(
				"src",
				"https://cdn11.bigcommerce.com/s-1812kprzl2/images/stencil/original/products/426/5082/no-image__12882.1665668288.jpg?c=2"
			);
		}
		newCard.appendChild(articleImage);
		const newCardBody = document.createElement("div");
		newCardBody.setAttribute("class", "card-body");

		newCard.appendChild(newCardBody);

		const newCardTitle = document.createElement("h6");
		newCardTitle.setAttribute("class", "card-title");
		const newStrong = document.createElement("strong");
		if (article.title.length > 10) {
			newStrong.innerText = `${article.title.substr(0, 10)} ···`;
		} else {
			newStrong.innerText = article.title;
		}
		newCardTitle.appendChild(newStrong);
		newCardBody.appendChild(newCardTitle);

		const newCardtime = document.createElement("p");
		newCardtime.setAttribute("class", "card-text");
		newCardtime.innerText = article.created_at;
		newCardBody.appendChild(newCardtime);
		list_div.appendChild(newCardBox);
	});
}

// 게시글 눌렀을 때 게시글 id 값을 가지고 상세페이지로 이동하는 함수
function articleDetail(article_id) {
	window.location.href = `${frontend_base_url}/articles/article_detail.html?article_id=${article_id}`;
}

// 메인 댓글 목록 UI
async function commentList(comments, list_div) {
	for (const comment of comments) {
		const newCardBox = document.createElement("li");
		newCardBox.setAttribute("class", "card-box");

		const newCard = document.createElement("div");
		newCard.setAttribute("class", "card h-100");
		newCard.setAttribute("id", `comment-${comment.id}`);
		newCard.setAttribute(
			"onclick",
			`location.href='${frontend_base_url}/articles/article_detail.html?article_id=${comment.article}#comment-${comment.id}'`
		);
		newCard.style.cursor = "pointer";
		newCardBox.appendChild(newCard);

		const post = await getArticle(comment.article);
		const articlePhoto = post.photos[0]?.file;
		const articleImage = document.createElement("img");
		articleImage.setAttribute("class", "card-img-top");
		if (articlePhoto) {
			articleImage.setAttribute("src", `${articlePhoto}`);
		} else {
			articleImage.setAttribute(
				"src",
				"https://cdn11.bigcommerce.com/s-1812kprzl2/images/stencil/original/products/426/5082/no-image__12882.1665668288.jpg?c=2"
			);
		}
		newCard.appendChild(articleImage);

		const newCardBody = document.createElement("div");
		newCardBody.setAttribute("class", "card-body");
		newCard.appendChild(newCardBody);

		const newCardTitle = document.createElement("h6");
		newCardTitle.setAttribute("class", "card-title");
		if (comment.comment.length > 10) {
			newCardTitle.innerText = `${comment.comment.substr(0, 10)} ···`;
		} else {
			newCardTitle.innerText = comment.comment;
		}
		newCardBody.appendChild(newCardTitle);

		const newCardlike = document.createElement("p");
		newCardlike.setAttribute("class", "card-text");
		const newStrong = document.createElement("strong");
		newStrong.innerText = `좋아요 ${comment.like_count}개`;
		newCardlike.appendChild(newStrong);
		newCardBody.appendChild(newCardlike);

		list_div.appendChild(newCardBox);
	};
}

//메인페이지 좋아요순 댓글, 최신순 게시글 가져오기
window.onload = async function () {
	forceLogout();  // 로그아웃은 안 했지만 토큰이 만료된 경우 강제 로그아웃

	const like_comments = await getComments();
	like_comments.sort((x, y) => y.like_count - x.like_count);

	const recently_articles = await getArticles();

	const comments_list = document.getElementById("most-like-comment");
	commentList(like_comments.slice(0, 9), comments_list);

	const article_list = document.getElementById("recently-article");
	mainArticleList(recently_articles.slice(0, 9), article_list);
};
