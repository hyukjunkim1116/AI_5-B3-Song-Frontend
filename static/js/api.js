console.log("api.js 연결됨");

const frontend_base_url = "http://127.0.0.1:5500";
const backend_base_url = "http://127.0.0.1:8000";

// 로그인 상태에서 로그인, 회원가입 페이지 접속 시 홈으로 이동하는 함수
function checkLogin() {
	const payload = localStorage.getItem("payload");
	if (payload) {
		window.location.replace(`${frontend_base_url}/`);
	}
}

// 비로그인 상태에서 글쓰기 페이지 접속 시 홈으로 이동하는 함수
function checkNotLogin() {
	const payload = localStorage.getItem("payload");
	if (payload == null) {
		window.location.replace(`${frontend_base_url}/`);
	}
}

// 회원가입
async function handleSignin() {
	const email = document.getElementById("email").value;
	const password = document.getElementById("password").value;
	// const passwordCheck = document.getElementById("password-check").value
	const nickname = document.getElementById("nickname").value;
	const gender = document.getElementById("gender").value;
	const age = document.getElementById("age").value;

	const response = await fetch(`${backend_base_url}/api/users/signup/`, {
		headers: {
			"content-type": "application/json"
		},
		method: "POST",
		body: JSON.stringify({
			email: email,
			password: password,
			// "password2": passwordCheck,
			nickname: nickname,
			gender: gender,
			age: age
		})
	});

	return response;
}

// 로그인
async function handleLogin() {
	const email = document.getElementById("email").value;
	const password = document.getElementById("password").value;

	const response = await fetch(`${backend_base_url}/api/users/login/`, {
		headers: {
			"content-type": "application/json"
		},
		method: "POST",
		body: JSON.stringify({
			email: email,
			password: password
		})
	});

	return response;
}

// 로그아웃
function handleLogout() {
	localStorage.removeItem("access");
	localStorage.removeItem("refresh");
	localStorage.removeItem("payload");
	window.location.replace(`${frontend_base_url}/`);
}

// 유저 정보 조회
async function getUser() {
	const payload = localStorage.getItem("payload");
	const payload_parse = JSON.parse(payload);
	let token = localStorage.getItem("access");
	const response = await fetch(
		`${backend_base_url}/api/users/profile/${payload_parse.user_id}/`,
		{
			headers: {
				Authorization: `Bearer ${token}`
			},
			method: "GET"
		}
	);
	if (response.status == 200) {
		response_json = await response.json();
		return response_json;
	} else {
		alert(response.statusText);
	}
}

// 아티클 사진 백엔드로 업로드
async function createArticlePhoto(realFileURL, article_id) {
	const token = localStorage.getItem("access");
	const response = await fetch(
		`${backend_base_url}/api/articles/${article_id}/photos/`,
		{
			headers: {
				// "X-CSRFToken": Cookie.get("csrftoken") || "",
				Authorization: `Bearer ${token}`,
				"content-type": "application/json"
			},
			body: JSON.stringify({
				file: realFileURL
			}),
			method: "POST"
		}
	);
	window.location.replace(`${frontend_base_url}/`);
	return response;
}

//실제로 클라우드플레어에 업로드
async function uploadArticlePhoto(data, article_id) {
	const file = document.getElementById("file").files[0];
	const formData = new FormData();
	formData.append("file", file);
	const response = await fetch(`${data["uploadURL"]}`, {
		body: formData,
		method: "POST"
	});
	const results = await response.json();
	const realFileURL = results.result.variants[0];
	console.log(article_id);
	return createArticlePhoto(realFileURL, article_id);
}

// 1회용 URL얻기
async function getArticleUploadURL(article_id) {
	const response = await fetch(
		`${backend_base_url}/api/medias/photos/get-url/`,
		{
			headers: {
				// "X-CSRFToken": Cookie.get("csrftoken") || "",
				// Authorization: `Bearer ${token}`
			},
			method: "POST"
		}
	);
	const data = await response.json();
	console.log(data["uploadURL"]);
	return uploadArticlePhoto(data, article_id);
}

// 사진 업로드 버튼 누르면 1회용 URL얻는 함수 실행
const handleArticlePhotoUploadBtn = () => {
	let getParams = window.location.search;
	let articleParams = getParams.split("=")[1];
	getArticleUploadURL(articleParams);
};
function uploadPhoto(article_id) {
	window.location.href = `${frontend_base_url}/upload_photo.html?article_id=${article_id}`;
}

// 모든 게시글 불러오기
async function getArticles() {
	const response = await fetch(`${backend_base_url}/api/articles`, {
		method: "GET"
	});
	response_json = await response.json();
	return response_json;
}

// 특정 게시글 불러오기
async function getArticle(article_id) {
	const response = await fetch(
		`${backend_base_url}/api/articles/${article_id}/`,
		{
			method: "GET"
		}
	);
	response_json = await response.json();
	return response_json;
}

//아티클 생성하기
async function postArticle() {
	const token = localStorage.getItem("access");
	const title = document.getElementById("article_title").value;
	const content = document.getElementById("article_content").value;

	const formdata = new FormData();

	formdata.append("title", title);
	formdata.append("content", content);

	const response = await fetch(`${backend_base_url}/api/articles/`, {
		headers: {
			Authorization: `Bearer ${token}`
		},
		body: formdata,
		method: "POST"
	});
	const responseData = await response.json();
	console.log(responseData.id);
	const responseURL = await fetch(
		`${backend_base_url}/api/medias/photos/get-url/`,
		{
			headers: {
				// "X-CSRFToken": Cookie.get("csrftoken") || "",
				// Authorization: `Bearer ${token}`
			},
			method: "POST"
		}
	);
	const dataURL = await responseURL.json();
	console.log(dataURL["uploadURL"]);
	//실제로 클라우드플레어에 업로드
	const file = document.getElementById("file").files[0];
	const formData = new FormData();
	formData.append("file", file);
	const responseRealURL = await fetch(`${dataURL["uploadURL"]}`, {
		body: formData,
		method: "POST"
	});
	const results = await responseRealURL.json();
	const realFileURL = results.result.variants[0];
	// 아티클 사진 백엔드로 업로드
	const responseUpload = await fetch(
		`${backend_base_url}/api/articles/${responseData.id}/photos/`,
		{
			headers: {
				// "X-CSRFToken": Cookie.get("csrftoken") || "",
				Authorization: `Bearer ${token}`,
				"content-type": "application/json"
			},
			body: JSON.stringify({
				file: realFileURL
			}),
			method: "POST"
		}
	);
	window.location.replace(`${frontend_base_url}/`);
}

// 아티클 사진 삭제
async function articlePhotoDelete(photo_id) {
	console.log(photo_id);
	const response = await fetch(
		`${backend_base_url}/api/medias/photos/${photo_id}`,
		{
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${token}`
			}
		}
	);
	if (response.status == 200) {
		alert("사진이 삭제되었습니다!");
	} else {
		alert("사진 삭제 권한이 없습니다.");
	}
	location.reload();
}

// 아티클 삭제
async function articleDelete(article_id) {
	const response = await fetch(
		`${backend_base_url}/api/articles/${article_id}/`,
		{
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${token}`
			}
		}
	);
	if (response.status == 204) {
		alert("게시글이 삭제되었습니다!");
	} else {
		alert("게시글 삭제 권한이 없습니다.");
	}
	window.location.replace("/");
}

// 댓글 전체 목록 불러오기
async function getComments() {
	const response = await fetch(`${backend_base_url}/api/articles/comments/`, {
		method: "GET"
	});
	response_json = await response.json();
	return response_json;
}

// 검색 결과물 백엔드에서 가져오기
async function getQueryArticles(query) {
	const response = await fetch(
		`${backend_base_url}/api/articles/search/${query}/`,
		{
			method: "GET"
		}
	);

	return response;
}
