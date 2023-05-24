console.log("loader.js 로드됨");
// navbar.html을 가져옴
// 로그인 되지 않은 상태에서는 글쓰기가 안 보이고, 로그인 된 상태라면 로그인이 안 보이고 로그아웃 버튼이 생김
async function injectNavbar() {
	fetch("/navbar.html")
		.then((response) => {
			return response.text();
		})
		.then((data) => {
			document.querySelector("header").innerHTML = data;
		});

	let navbarHtml = await fetch("/navbar.html");
	let data = await navbarHtml.text();
	document.querySelector("header").innerHTML = data;

	const payload = localStorage.getItem("payload");
	if (payload) {
		const login_user = await getUser();
		console.log(login_user);

		const intro = document.getElementById("intro");
		intro.innerText = `${login_user.nickname}님 오셨군요!`;

		let navbarLeft = document.getElementById("navbar-left");
		let postLi = document.createElement("li");
		postLi.setAttribute("class", "nav-item");

		let postLink = document.createElement("a");
		postLink.setAttribute("href", "articles/create_article.html");
		postLink.setAttribute("class", "nav-link");
		postLink.innerHTML = "글쓰기";

		postLi.appendChild(postLink);
		navbarLeft.appendChild(postLi);

		let navbarRight = document.getElementById("navbar-right");
		let newLi = document.createElement("li");
		newLi.setAttribute("class", "nav-item");

		let logoutBtn = document.createElement("button");
		logoutBtn.setAttribute("class", "nav-link btn");
		logoutBtn.innerText = "로그아웃";
		logoutBtn.setAttribute("onclick", "handleLogout()");

		newLi.appendChild(logoutBtn);

		navbarRight.appendChild(newLi);

		let loginButton = document.getElementById("login-button");
		loginButton.style.display = "none";
	}
}

injectNavbar();

// 게시글 목록 UI
function articleList(articles, list_div) {
    articles.forEach(article => {
        const newCol = document.createElement("div");
        newCol.setAttribute("class", "col")
        newCol.setAttribute("onclick", `articleDetail(${article.pk})`)

        const newCard = document.createElement("div")
        newCard.setAttribute("class", "card h-100")
        newCard.setAttribute("id", article.pk)
        newCol.appendChild(newCard)

        const articlePhoto = article.photos[0]?.file;
        const articleImage = document.createElement("img");
        articleImage.setAttribute("class", "card-img-top")
        if (articlePhoto) {
          articleImage.setAttribute("src", `${articlePhoto}`);
        } else {
          articleImage.setAttribute("src", "https://cdn11.bigcommerce.com/s-1812kprzl2/images/stencil/original/products/426/5082/no-image__12882.1665668288.jpg?c=2")
        }
          articleImage.setAttribute("onclick", `uploadPhoto(${article.pk})`);
        newCard.appendChild(articleImage)

        const newCardBody = document.createElement("div")
        newCardBody.setAttribute("class", "card-body")
        newCard.appendChild(newCardBody)

        const newCardTile = document.createElement("h5")
        newCardTile.setAttribute("class", "card-title")
        newCardTile.innerText = article.title
        newCardBody.appendChild(newCardTile)

        const newCardtime = document.createElement("p")
        newCardtime.setAttribute("class", "card-text")
        newCardtime.innerText = `생성시간 : ${article.created_at}`
        newCardBody.appendChild(newCardtime)

        list_div.appendChild(newCol)
    })
}

// 댓글 목록 UI
function commentList(comments, list_div) {
    comments.forEach(comment => {
        const newCol = document.createElement("div");
        newCol.setAttribute("class", "col")
        newCol.setAttribute("onclick", `articleDetail(${comment.pk})`)

        const newCard = document.createElement("div")
        newCard.setAttribute("class", "card h-100")
        newCard.setAttribute("id", comment.pk)
        newCol.appendChild(newCard)

        // 사진 가져오는 방식 알게 되면 추가함
        // const articlePhoto = document.createElement("img")
        // articlePhoto.setAttribute("class", "card-img-top")
        // if (article.image) {
        //     articlePhoto.setAttribute("src", `${backend_base_url}${article.image}`)
        // } else {
        //     articlePhoto.setAttribute("src", "https://cdn11.bigcommerce.com/s-1812kprzl2/images/stencil/original/products/426/5082/no-image__12882.1665668288.jpg?c=2")
        // }
        // newCard.appendChild(articlePhoto)

        const newCardBody = document.createElement("div")
        newCardBody.setAttribute("class", "card-body")
        newCard.appendChild(newCardBody)

        const newCardTile = document.createElement("h5")
        newCardTile.setAttribute("class", "card-title")
        newCardTile.innerText = comment.comment
        newCardBody.appendChild(newCardTile)

        const newCardlike = document.createElement("p")
        newCardlike.setAttribute("class", "card-text")
        newCardlike.innerText = `좋아요수 : ${comment.like_count}`
        newCardBody.appendChild(newCardlike)

        list_div.appendChild(newCol)
    })
}
