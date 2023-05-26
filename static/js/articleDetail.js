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
    console.log(payload);
    const commentsList = document.getElementById("comments-list");
    commentsList.innerHTML = "";

	// 댓글안에 링크찾아다가 하이퍼링크로 바꿔주기
    function linkify(text) {
        const urlRegex = /(((https?:\/\/)|www\.)[^\s]+(\([^\s]+\)|[^\s.,!?:;\"'<>()\[\]\\/]|\/))/gi;
        return text.replace(urlRegex, function (url) {
            const href = url.startsWith("http") ? url : "http://" + url;
            return `<a href="${href}" target="_blank" rel="noopener noreferrer">${url}</a>`;
        });
    }

    response.forEach((comment) => {
        let buttons = '';
        console.log(comment.user);
        console.log(currentUserId);
		console.log(comment.id)
		console.log(comment)
        if (currentUserId === comment.user) {
            buttons = `
            <div class="col d-grid gap-2 d-md-flex justify-content-end p-2">
                <button type="button" class="btn btn-primary" onclick="modifyComment(${comment.id}, '${comment.comment}')">수정</button>
                <button type="button" class="btn btn-primary" onclick="deleteComment(${comment.id})">삭제</button>
            </div>
            `;
        }

        commentsList.innerHTML += `
        <li class="media d-flex mt-2 mb-2 mr-2 border border-dark">
            <img class="img-thumbnail" src="https://img.freepik.com/free-photo/cute-ai-generated-cartoon-bunny_23-2150288879.jpg" alt="profile img" width="50" height"50">
            <div class="media-body">
                <h6 class="mt-1 mb-1 ms-1 me-1">${comment.user}</h6>
                <span class="mt-1 mb-1 ms-1 me-1">${linkify(comment.comment)}</span> <!-- 이 부분을 수정하여 링크 변환을 반영 -->
            </div>
            ${buttons}
        </li>
        `;
    });
}

// 게시글 상세보기 페이지가 로드될 때 실행되는 함수
window.onload = async function () {
	const login_user = await getLoginUser();
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

	// 댓글을 화면에 표시하기
	const comments = await loadComments(article_id);
};

// 댓글 등록 버튼
async function submitComment() {
    const urlParams = new URLSearchParams(window.location.search);
    const article_id = urlParams.get("article_id");
    const commentElement = document.getElementById("new-comment")
    const newComment = commentElement.value
    console.log(`댓글 내용: ${newComment}`)
    const response = await createComment(article_id, newComment)
    commentElement.value = ""

    loadComments(article_id)
}