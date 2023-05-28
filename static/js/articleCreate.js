//아티클 생성하기
async function postArticle() {
	const updateBtn = document.getElementById("submit-btn");
	updateBtn.innerText = "";
	const span = document.createElement("span");
	span.setAttribute("id", "spinner-span");
	span.setAttribute("class", "spinner-border spinner-border-sm");
	span.setAttribute("role", "status");
	span.setAttribute("aria-hidden", "true");
	updateBtn.appendChild(span);
	const token = localStorage.getItem("access");
	const title = document.getElementById("article_title").value;
	const content = document.getElementById("article_content").value;
	const file = document.getElementById("file").files[0];

	const formdata = new FormData();
	formdata.append("title", title);
	formdata.append("content", content);

	const response = await fetch(`${backend_base_url}/api/articles/`, {
		headers: {
			Authorization: `Bearer ${token}`
		},
		body: formdata,
		method: "POST"
	});
	const responseData = await response.json();

	if (file) {
		const responseURL = await fetch(
			`${backend_base_url}/api/medias/photos/get-url/`,
			{
				method: "POST"
			}
		);
		const dataURL = await responseURL.json();
		console.log(dataURL["uploadURL"]);

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
		const responseUpload = await fetch(
			`${backend_base_url}/api/articles/${responseData.id}/photos/`,
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
	if (response.status === 200) {
		alert("작성 완료!");
		window.location.replace(
			`${frontend_base_url}/articles/article_detail.html?article_id=${responseData.id}`
		);
	} else {
		alert("작성 실패!");
		window.location.replace(`${frontend_base_url}/`);
	}
}


window.onload = async function () {
	checkNotLogin(); // 로그인 한 사용자만 게시글 작성 가능
	forceLogout();  // 로그아웃은 안 했지만 토큰이 만료된 경우 강제 로그아웃
}