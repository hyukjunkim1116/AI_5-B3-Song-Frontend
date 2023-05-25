console.log("articleDetail.js 로드됨");
let article_id = new URLSearchParams(window.location.search).get("article_id");
const token = localStorage.getItem("access");

//아티클 업데이트 하기
async function updateArticle() {
	const token = localStorage.getItem("access");
	const title = document.getElementById("article_title").value;
	const content = document.getElementById("article_content").value;

	const formdata = new FormData();

	formdata.append("title", title);
	formdata.append("content", content);

	const response = await fetch(
		`${backend_base_url}/api/articles/${article_id}/`,
		{
			headers: {
				Authorization: `Bearer ${token}`
			},
			body: formdata,
			method: "PUT"
		}
	);

	if (response.status == 200) {
		alert("글 수정 완료!");
		window.location.replace(`${frontend_base_url}/`);
	} else {
		alert("글 수정 실패!");
		window.location.replace(`${frontend_base_url}/`);
	}
}
// 글 수정 페이지 이동
function articleUpdate(article_id) {
	window.location.href = `${frontend_base_url}/articles/update_article.html?article_id=${article_id}`;
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
// 게시글 삭제
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

window.onload = async function () {
	const login_user = await getUser();
	// 게시글 받아오기
	const article = await getArticle(article_id);
	console.log(article);

	// 내용 가져오기
	document.getElementById("detail-title").innerText = article.title;
	document.getElementById("detail-user").innerText = article.owner.nickname;
	document.getElementById("detail-time").innerText = article.created_at.substr(
		0,
		10
	);
	document.getElementById("detail-content").innerText = article.content;

	const imageBox = document.createElement("img");
	imageBox.setAttribute("class", "img-box");
	const articlePhoto = article.photos[0]?.file;
	// 이미지 가져오기
	if (articlePhoto) {
		imageBox.setAttribute("src", `${articlePhoto}`);
	} else {
		imageBox.setAttribute(
			"src",
			"https://cdn11.bigcommerce.com/s-1812kprzl2/images/stencil/original/products/426/5082/no-image__12882.1665668288.jpg?c=2"
		);
	}
	document.getElementById("detail-img").append(imageBox);
	console.log(login_user.id, article.owner.id);
	if (login_user.id === article.owner.id) {
		const articleButtons = document.getElementById("btns");
		const updateButton = document.createElement("button");
		const deleteButton = document.createElement("button");
		const updatePhotoButton = document.createElement("button");
		updateButton.setAttribute("class", "btn");
		updateButton.setAttribute("type", "button");
		updateButton.innerText = "수정하기";
		updateButton.setAttribute("onclick", `articleUpdate(article_id)`);
		deleteButton.setAttribute("class", "btn");
		deleteButton.setAttribute("type", "button");
		deleteButton.innerText = "삭제하기";
		deleteButton.setAttribute("onclick", `articleDelete(article_id)`);
		updatePhotoButton.setAttribute("class", "btn");
		updatePhotoButton.setAttribute("type", "button");
		updatePhotoButton.innerText = "사진 삭제하기";
		updatePhotoButton.setAttribute(
			"onclick",
			`articlePhotoDelete(${article.photos[0]?.pk})`
		);
		articleButtons.appendChild(updateButton);
		articleButtons.appendChild(deleteButton);
		articleButtons.appendChild(updatePhotoButton);
	}
};
