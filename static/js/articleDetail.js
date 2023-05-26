console.log("articleDetail.js 로드됨");
let article_id = new URLSearchParams(window.location.search).get("article_id");
const token = localStorage.getItem("access");

// 글 수정 페이지 이동
function articleUpdate(article_id) {
	window.location.href = `${frontend_base_url}/articles/update_article.html?article_id=${article_id}`;
}

async function loadComments(article_id) {
	const response = await getArticleComments(article_id);
	const payload = JSON.parse(localStorage.getItem("payload"));
	if (payload) {
		currentUserId = payload.nickname;
	} else {
		currentUserId = null;
	}
	const commentsList = document.getElementById("comments-list");
	commentsList.innerHTML = "";

	// 댓글안에 링크찾아다가 하이퍼링크로 바꿔주기
	function linkify(text) {
		const urlRegex = /(((https?:\/\/)|www\.)[^\s]+(\([^\s]+\)|[^\s.,!?:;\"'<>()\[\]\\/]|\/))/gi;
		return text.replace(urlRegex, function (url) {
			const href = url.startsWith("http") ? url : "http://" + url;
			const linkName = "🔗";
			return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="custom-link">${linkName}</a>`;
		});
	}

	response.forEach(async (comment) => {
		let buttons = '';

		// 프로필 사진 넣기 위한 부분(있으면 그대로 넣고 없으면 대체 이미지)
		const comment_user = await getOtherUser(comment.user_id)
		if (comment_user.avatar) {
			comment_user_avatar = comment_user.avatar
		} else {
			comment_user_avatar = "../static/image/free-icon-music-6599985.png"
		}

		// 로그인 한 유저와 댓글 작성자가 같으면 수정, 삭제 버튼 보이게 하기
		if (currentUserId === comment.user) {
			buttons = `
            <div class="col d-grid gap-2 d-md-flex justify-content-end p-2 text-nowrap ">
                <button type="button" class="btn btn-outline-secondary btn-sm" onclick="modifyComment(${comment.id}, '${comment.comment}')">수정</button>
                <button type="button" class="btn btn-outline-secondary btn-sm" onclick="deleteComment(${comment.id})">삭제</button>
            </div>
            `;
		}
		commentsList.innerHTML += `
        <li class="media d-flex align-items-center mt-2 mb-2 mr-2 border border-dark rounded">
		<img class="img-thumbnail rounded-circle" src=${comment_user_avatar} alt="profile img" width="50" height"50">
		<div class="media-body">
			<h6 class="mt-1 mb-1 ms-1 me-1">${comment.user}</h6>
			<span class="mt-1 mb-1 ms-1 me-1" style="word-break: break-all; white-space: pre-line;">${linkify(comment.comment)}</span> <!-- 이 부분을 수정하여 링크 변환을 반영 -->
		</div>
            ${buttons}
        </li >
			`;
	});
}

// 게시글 상세보기 페이지가 로드될 때 실행되는 함수
window.onload = async function () {
	const login_user = await getLoginUser();
	// 게시글 받아오기
	const article = await getArticle(article_id);

	// 내용 가져오기
	document.getElementById("detail-title").innerText = "제목 " + article.title;
	document.getElementById("detail-user").innerText = "작성자 " + article.owner.nickname;
	document.getElementById("detail-time").innerText = "작성일 " + article.created_at.substr(
		0,
		10
	);
	document.getElementById("detail-content").innerText = article.content;

	const imageBox = document.createElement("img");
	imageBox.setAttribute("class", "img-box");
	const articlePhoto = article.photos[0]?.file;
	// 이미지 가져오기
	if (articlePhoto) {
		imageBox.setAttribute("src", `${articlePhoto} `);
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
		updateButton.setAttribute("class", "btn");
		updateButton.setAttribute("type", "button");
		updateButton.innerText = "수정하기";
		updateButton.setAttribute("onclick", `articleUpdate(article_id)`);
		deleteButton.setAttribute("class", "btn p-0");
		deleteButton.setAttribute("type", "button");
		deleteButton.innerText = "삭제하기";
		deleteButton.setAttribute("onclick", `articleDelete(article_id)`);
		articleButtons.appendChild(updateButton);
		articleButtons.appendChild(deleteButton);
	}

	// 댓글을 화면에 표시하기
	await loadComments(article_id);
};

// 댓글 등록 버튼
async function submitComment() {
	const urlParams = new URLSearchParams(window.location.search);
	const article_id = urlParams.get("article_id");
	const commentElement = document.getElementById("new-comment")
	const newComment = commentElement.value
	await createComment(article_id, newComment)
	commentElement.value = ""

	loadComments(article_id)
}