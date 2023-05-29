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
	} else if (response.status == 404) {
		window.location.replace("/page_not_found.html");
	} else {
		alert(response.statusText);
	}
}

// 특정 유저 작성글 조회
async function getOtherUserArticles(user_id) {
	const response = await fetch(
		`${backend_base_url}/api/users/profile/${user_id}/myarticles/`,
		{
			method: "GET"
		}
	);
	if (response.status == 200) {
		response_json = await response.json();
		return [response_json, response_json.length];
	} else {
		alert(response.statusText);
	}
}

// 특정 유저 좋아요 댓글 조회
async function getOtherUserLikes(user_id) {
	const response = await fetch(
		`${backend_base_url}/api/users/profile/${user_id}/likes/`,
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

// 특정 유저 북마크 게시글 조회
async function getOtherUserBookmarks(user_id) {
	const response = await fetch(
		`${backend_base_url}/api/users/profile/${user_id}/bookmarks/`,
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

// 프로필 수정 버튼 누르면 수정용 HTML로 변형
async function userUpdate() {
	let getParams = window.location.search;
	let userParams = getParams.split("=")[1];
	const user_id = userParams;
	const user = await getOtherUser(user_id);
	const profile_box = document.getElementById("profile_box");

	userProfileUpdate(user, profile_box);
}

window.onload = async function () {
	forceLogout();  // 로그아웃은 안 했지만 토큰이 만료된 경우 강제 로그아웃

	let getParams = window.location.search;
	let userParams = getParams.split("=")[1];
	const user_id = userParams;

	const user = await getOtherUser(user_id);

	const profile_box = document.getElementById("profile_box");

	userProfile(user, profile_box);

	// 내 게시글 업데이트순 나열 - 백엔드에서 처리함
	const myarticles = await getOtherUserArticles(user_id);

	// 좋아요 댓글 업데이트순 나열 - 백엔드에서 처리함
	const like_comments = await getOtherUserLikes(user_id);

	// 북마크 게시글 업데이트순 나열 - 백엔드에서 처리함
	const bookmark_articles = await getOtherUserBookmarks(user_id);

	const article_list = document.getElementById("my_articles");
	userArticleList(myarticles[0], article_list);

	const comments_list = document.getElementById("like_comments");
	userCommentList(like_comments, comments_list);

	const bookmark_list = document.getElementById("bookmark_articles");
	userArticleList(bookmark_articles, bookmark_list);
};
