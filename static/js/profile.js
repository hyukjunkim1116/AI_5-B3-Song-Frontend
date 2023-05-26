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
		return response_json;
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


//프로필 페이지 유저 정보, 내가 쓴 글, 좋아요 한 댓글, 북마큰 한 글 가져오기
window.onload = async function () {
	const payload = localStorage.getItem("payload");
	const payload_parse = JSON.parse(payload);
    const user_id = payload_parse.user_id;

    const user = await getOtherUser(user_id)
    
    const profile_box = document.getElementById("profile_box")
    
    userProfile(user,profile_box)

    const myarticles = await getOtherUserArticles(user_id)
    
    const like_comments = await getOtherUserLikes(user_id)
    
    const bookmark_articles = await getOtherUserBookmarks(user_id)
    
    const article_list = document.getElementById("my_articles")
    userArticleList(myarticles, article_list)
    
    const comments_list = document.getElementById("like_comments")
    userCommentList(like_comments, comments_list)
    
    const bookmark_list = document.getElementById("bookmark_articles")
    userArticleList(bookmark_articles, bookmark_list)
}

