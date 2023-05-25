console.log("articleDetail.js 로드됨");
let article_id = new URLSearchParams(window.location.search).get("article_id");
const token = localStorage.getItem("access");

// 글 수정 페이지 이동
function articleUpdate(article_id) {
	window.location.href = `${frontend_base_url}/articles/update_article.html?article_id=${article_id}`;
}

// 게시글 상세보기 페이지가 로드될 때 실행되는 함수
window.onload = async function () {
	const login_user = await getUser();
	// 게시글 받아오기
	const article = await getArticle(article_id);

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
