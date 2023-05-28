console.log("api.js 연결됨");

const frontend_base_url = "http://127.0.0.1:5500";
const backend_base_url = "http://13.209.68.214:8000";

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
	const passwordCheck = document.getElementById("password-check").value;
	const nickname = document.getElementById("nickname").value;
	const gender = document.getElementById("gender").value;
	const age = document.getElementById("age").value;
	// 비밀번호 일치 판별
	if (password === passwordCheck) {
		const response = await fetch(`${backend_base_url}/api/users/signup/`, {
			headers: {
				"content-type": "application/json"
			},
			method: "POST",
			body: JSON.stringify({
				email: email,
				password: password,
				nickname: nickname,
				gender: gender,
				age: age
			})
		});
		return response;
	} else {
		alert("비밀번호가 일치하지 않습니다.");
	}
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

// 전체 유저 정보 조회 - 관리자용 (아직 권한제한 미구현)
async function getAllUser() {
	const response = await fetch(`${backend_base_url}/api/users/`, {
		method: "GET"
	});
	if (response.status == 200) {
		response_json = await response.json();
		console.log(response_json);
		return response_json;
	} else {
		alert(response.statusText);
	}
}

// 특정 유저 정보 조회
async function getOtherUser(user_id) {
	const response = await fetch(
		`${backend_base_url}/api/users/profile/${user_id}/`,
		{
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

// 로그인 한 로그인 한 유저 정보 조회
async function getLoginUser() {
	const payload = localStorage.getItem("payload");
	if (payload) {
		const payload_parse = JSON.parse(payload);
		const response = await fetch(
			`${backend_base_url}/api/users/profile/${payload_parse.user_id}/`,
			{
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
}

// 특정 유저 팔로잉 목록보기
async function getFollowing(user_id) {
	const response = await fetch(
		`${backend_base_url}/api/users/follow/${user_id}/`,
		{
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

// 특정 유저 팔로잉하기
async function follow() {
	let token = localStorage.getItem("access");
	let getParams = window.location.search;
	let userParams = getParams.split("=")[1];
	const user_id = userParams;

	const response = await fetch(
		`${backend_base_url}/api/users/follow/${user_id}/`,
		{
			headers: {
				Authorization: `Bearer ${token}`
			},
			method: "POST"
		}
	);
	response_json = await response.json();

	// 팔로우 버튼 변경
	if (response_json == "follow") {
		const followBtn = document.getElementById("followBtn");
		followBtn.innerText.replace("팔로우 »", "언팔로우 »");
		window.location.reload();
	} else if (response_json == "unfollow") {
		const followBtn = document.getElementById("followBtn");
		followBtn.innerText.replace("언팔로우 »", "팔로우 »");
		window.location.reload();
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
	if (response.status == 200) {
		response_json = await response.json();
		return response_json;
	} else if (response.status == 404) {
		window.location.replace("/page_not_found.html");
	} else {
		alert(response.statusText);
	}
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

// 특정 댓글 불러오기
async function getComment(comment_id) {
	const response = await fetch(
		`${backend_base_url}/api/articles/comments/${comment_id}/`,
		{
			method: "GET"
		}
	);
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
async function getArticleComments(article_id) {
	const response = await fetch(
		`${backend_base_url}/api/articles/${article_id}/comments/`,
		{
			method: "GET"
		}
	);
	response_json = await response.json();
	return response_json;
}

// 댓글 작성
async function createComment(article_id, comment) {
	const token = localStorage.getItem("access");
	const formdata = new FormData();

	formdata.append("comment", comment);
	const response = await fetch(
		`${backend_base_url}/api/articles/${article_id}/comments/`,
		{
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`
			},
			body: formdata
		}
	);

	if (response.status == 200) {
		return await response.json();
	} else {
		throw new Error(`Failed to create comment: ${await response.text()}`);
	}
}

// 댓글 수정
async function modifyComment(comment_id, currentComment) {
	let newComment = prompt("수정할 댓글을 입력하세요.", currentComment); // 수행할 댓글 수정 내용을 입력 받고, 기존 댓글 내용을 보여줍니다.

	if (newComment !== null) {
		// 수정 내용이 null 이 아닌 경우
		let token = localStorage.getItem("access");

		const response = await fetch(
			`${backend_base_url}/api/articles/comments/${comment_id}/`,
			{
				method: "PUT",
				headers: {
					"content-type": "application/json",
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify({
					comment: newComment
				})
			}
		);

		if (response.status == 200) {
			alert("댓글 수정이 완료되었습니다!");
			loadComments(article_id); // 댓글 목록을 다시 로드합니다.
		} else {
			alert(response.statusText);
		}
	} else {
		// 수정 내용이 null 인 경우
		loadComments(article_id);
	}
}

//댓글 삭제
async function deleteComment(comment_id) {
	if (confirm("정말 삭제하시겠습니까?")) {
		let token = localStorage.getItem("access");

		const response = await fetch(
			`${backend_base_url}/api/articles/comments/${comment_id}/`,
			{
				method: "DELETE",
				headers: {
					"content-type": "application/json",
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify({
					id: comment_id
				})
			}
		);

		if (response.status == 204) {
			alert("댓글 삭제 완료!");
			loadComments(article_id);
		} else {
			alert(response.statusText);
		}
	} else {
		loadComments(article_id);
	}
}

// 좋아요 누르기
async function likeClick(comment_id) {
	const comment = await getComment(comment_id);

	let token = localStorage.getItem("access");
	let clickLike = document.getElementById(`like-${comment_id}`);
	let clickDislike = document.getElementById(`dislike-${comment_id}`);

	const response = await fetch(
		`${backend_base_url}/api/articles/like/${comment_id}/`,
		{
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`
			}
		}
	);
	if (response.status == 401) {
		alert("로그인한 사용자만 좋아요를 누를 수 있습니다");
	}
	const response_json = await response.json();

	//좋아요 하트 색 및 개수 변경
	if (response_json == "like") {
		clickLike.setAttribute("style", "display:flex;");
		clickDislike.setAttribute("style", "display:none;");
	} else if (response_json == "dislike") {
		clickLike.setAttribute("style", "display:none;");
		clickDislike.setAttribute("style", "display:flex;");
	}
}

// 북마크 누르기
async function bookmarkClick(article_id) {
	const article = await getArticle(article_id);

	let token = localStorage.getItem("access");
	let clickBookmark = document.getElementById(`bookmark-${article_id}`);
	let clickUnbookmark = document.getElementById(`unbookmark-${article_id}`);

	const response = await fetch(
		`${backend_base_url}/api/articles/bookmark/${article_id}/`,
		{
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`
			}
		}
	);
	if (response.status == 401) {
		alert("로그인한 사용자만 북마크 할 수 있습니다");
	}
	const response_json = await response.json();

	// 북마크 버튼 변경
	if (response_json == "bookmark") {
		clickUnbookmark.setAttribute("style", "display:flex;");
		clickBookmark.setAttribute("style", "display:none;");
	} else if (response_json == "unbookmark") {
		clickUnbookmark.setAttribute("style", "display:none;");
		clickBookmark.setAttribute("style", "display:flex;");
	}
}

/* 썸네일 미리보기 함수 */
function setThumbnail(event) {
	let reader = new FileReader();

	reader.onload = function (event) {
		let img = document.createElement("img");
		img.setAttribute("src", event.target.result);

		// 썸네일 크기 조절
		img.setAttribute("style", "max-height: 300px;"); // 높이 제한 300px
		img.style.width = "80px"; // 너비 200px로 설정
		img.style.height = "auto"; // 높이 자동 설정
		// 썸네일 리셋 후 미리보기 보여주기
		document.querySelector("div#image_container").innerHTML = "";
		document.querySelector("div#image_container").appendChild(img);
	};

	reader.readAsDataURL(event.target.files[0]);
}

