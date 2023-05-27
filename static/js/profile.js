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
		console.log(response_json);
		return response_json;
	} else if (response.status == 404) {
		window.location.replace("/page_not_found.html")
	}
	else {
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
		return (response_json);
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
	const user = await getOtherUser(user_id)
	const profile_box = document.getElementById("profile_box")

	userProfileUpdate(user, profile_box)
}


// // 사진 업로드 버튼 누르면 1회용 URL얻는 함수 실행
// const handleArticlePhotoUploadBtn = () => {
// 	let getParams = window.location.search;
// 	let articleParams = getParams.split("=")[1];
// 	getArticleUploadURL(articleParams);
// };
// function uploadPhoto(article_id) {
// 	window.location.href = `${frontend_base_url}/upload_photo.html?article_id=${article_id}`;
// }



window.onload = async function () {
	let getParams = window.location.search;
	let userParams = getParams.split("=")[1];
	const user_id = userParams;

	const user = await getOtherUser(user_id)

	const profile_box = document.getElementById("profile_box")

	userProfile(user, profile_box)

	const myarticles = await getOtherUserArticles(user_id)
	// 내 게시글 최신순 나열 - 백엔드 수정 후 update_at으로 변경해야함
	myarticles.sort((x, y) => new Date(y.created_at) - new Date(x.created_at));

	const like_comments = await getOtherUserLikes(user_id)
	// 좋아요 댓글 최신순 나열 - 백엔드 수정 후 update_at으로 변경해야함
	like_comments.sort((x, y) => new Date(y.created_at) - new Date(x.created_at));

	const bookmark_articles = await getOtherUserBookmarks(user_id)
	// 북마크 게시글 최신순 나열 - 백엔드 수정 후 update_at으로 변경해야함
	bookmark_articles.sort((x, y) => new Date(y.created_at) - new Date(x.created_at));

	const article_list = document.getElementById("my_articles")
	userArticleList(myarticles, article_list)

	const comments_list = document.getElementById("like_comments")
	userCommentList(like_comments, comments_list)

	const bookmark_list = document.getElementById("bookmark_articles")
	userArticleList(bookmark_articles, bookmark_list)

}
