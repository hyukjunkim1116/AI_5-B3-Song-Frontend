//아티클 업데이트 하기
console.log("articleUpdate.js 로드됨");

window.onload = async function loadUpdatePost() {
	const urlParams = new URLSearchParams(window.location.search);
	const articleId = urlParams.get("article_id");
	const exist_post = await getArticle(articleId);
	// 수정창에 기존 내용 보이게
	const updateTitle = document.getElementById("article_title");
	updateTitle.value = exist_post.title;

	const updateContent = document.getElementById("article_content");
	updateContent.value = exist_post.content;
};
async function articleUpdate() {
	const urlParams = new URLSearchParams(window.location.search);
	const articleId = urlParams.get("article_id");
	const exist_post = await getArticle(articleId);
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
	const file = document.getElementById("file").files[0];
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
						// "X-CSRFToken": Cookie.get("csrftoken") || "",
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
		}
	}
	if (response.status == 200) {
		alert("글 수정 완료!");
		window.location.replace(`${frontend_base_url}/`);
	} else {
		alert("글 수정 실패!");
		window.location.replace(`${frontend_base_url}/`);
	}
}
