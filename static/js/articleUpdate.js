//아티클 업데이트 하기
console.log("articleUpdate.js 로드됨");

const urlParams = new URLSearchParams(window.location.search);
const articleId = urlParams.get("article_id");

window.onload = async function loadUpdatePost() {
	// 수정창에 기존 내용 보이게

	const exist_post = await getArticle(articleId);
	const updateTitle = document.getElementById("article_title");
	updateTitle.value = exist_post.title;

	const updateContent = document.getElementById("article_content");
	updateContent.value = exist_post.content;
};

// 아티클 사진 삭제
async function articlePhotoDelete() {
	const exist_post = await getArticle(articleId);
	if (exist_post.photos[0]) {
		const response = await fetch(
			`${backend_base_url}/api/medias/photos/${exist_post.photos[0]?.pk}`,
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
	} else {
		alert("등록된 사진이 없습니다!");
	}
	location.reload();
}

//아티클 업데이트 페이지 들어가면 실행되는 함수. file input은 설정 불가

async function articleUpdate() {
	const updateBtn = document.getElementById("submit-btn");
	updateBtn.innerText = "";
	const span = document.createElement("span");
	span.setAttribute("id", "spinner-span");
	span.setAttribute("class", "spinner-border spinner-border-sm");
	span.setAttribute("role", "status");
	span.setAttribute("aria-hidden", "true");
	updateBtn.appendChild(span);

	const exist_post = await getArticle(articleId);
	const title = document.getElementById("article_title").value;
	const content = document.getElementById("article_content").value;
	const file = document.getElementById("file").files[0];

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

	if (file) {
		const responseURL = await fetch(
			`${backend_base_url}/api/medias/photos/get-url/`,
			{
				method: "POST"
			}
		);
		const dataURL = await responseURL.json();

		//실제로 클라우드플레어에 업로드
		const formData = new FormData();
		formData.append("file", file);
		const responseRealURL = await fetch(`${dataURL["uploadURL"]}`, {
			body: formData,
			method: "POST"
		});
		const results = await responseRealURL.json();
		const realFileURL = results.result.variants[0];

		// 아티클 사진 백엔드로 업로드
		if (exist_post.photos[0]) {
			const responseUpload = await fetch(
				`${backend_base_url}/api/medias/photos/${exist_post.photos[0].pk}/`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
						"content-type": "application/json"
					},
					body: JSON.stringify({
						file: realFileURL
					}),
					method: "PUT"
				}
			);
		} else {
			// 아티클 사진 백엔드로 업로드
			const response = await fetch(
				`${backend_base_url}/api/articles/${article_id}/photos/`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
						"content-type": "application/json"
					},
					body: JSON.stringify({
						file: realFileURL
					}),
					method: "POST"
				}
			);
		}
	}
	if (response.status == 200) {
		alert("글 수정 완료!");
	} else {
		alert("글 수정 실패!");
	}
	history.back();
}
