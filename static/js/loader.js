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

    let footerHtml = await fetch("/footer.html")
    let footerdata = await footerHtml.text()
    document.querySelector("footer").innerHTML = footerdata;

    const login_user = await getLoginUser();
    if (login_user) {
        const intro = document.getElementById("intro");
        intro.innerText = `${login_user.nickname}님 오셨군요!`;

        let navbarLeft = document.getElementById("navbar-left");
        let postLi = document.createElement("li");
        postLi.setAttribute("class", "nav-item");

        let postLink = document.createElement("a");
        postLink.setAttribute("href", "/articles/create_article.html");
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
function articleList(articles) {
    articles.forEach(async article => {
        const tBody = document.getElementById("article-list-kmj")
        const newTr = document.createElement("tr")
        newTr.setAttribute("onclick", `articleDetail(${article.pk})`)
        tBody.appendChild(newTr)

        const newThNo = document.createElement("th")
        newThNo.innerHTML = article.pk
        newTr.appendChild(newThNo)

        const newTdTitle = document.createElement("td")
        newTdTitle.innerHTML = article.title
        newTr.appendChild(newTdTitle)

        const newTdOwner = document.createElement("td")
        newTdOwner.innerHTML = article.nickname
        newTr.appendChild(newTdOwner)

        const newTdTime = document.createElement("td")
        newTdTime.innerHTML = article.created_at
        newTr.appendChild(newTdTime)
    })
}

// 메인 게시글 목록 UI
function mainArticleList(articles, list_div) {
    articles.forEach(async article => {
        const newCardBox = document.createElement("li")
        newCardBox.setAttribute("class", "card-box")

        const newCard = document.createElement("div");
        newCard.setAttribute("class", "card h-100");
        newCard.setAttribute("id", `article-${article.pk}`);
        newCardBox.appendChild(newCard);

        const articlePhoto = article.photos[0]?.file;
        const articleImage = document.createElement("img");
        articleImage.setAttribute("class", "card-img-top");
        if (articlePhoto) {
            articleImage.setAttribute("src", `${articlePhoto}`);
        } else {
            articleImage.setAttribute(
                "src",
                "https://cdn11.bigcommerce.com/s-1812kprzl2/images/stencil/original/products/426/5082/no-image__12882.1665668288.jpg?c=2"
            );
        }
        newCard.appendChild(articleImage);
        const newCardBody = document.createElement("div");
        newCardBody.setAttribute("class", "card-body");
        newCardBody.setAttribute("onclick", `articleDetail(${article.pk})`);
        newCard.appendChild(newCardBody);

        const newCardTile = document.createElement("h6");
        newCardTile.setAttribute("class", "card-title");
        newCardTile.innerText = article.title;
        newCardBody.appendChild(newCardTile);

        const newCardtime = document.createElement("p");
        newCardtime.setAttribute("class", "card-text");
        newCardtime.innerText = article.created_at;
        newCardBody.appendChild(newCardtime);

        const login_user = await getLoginUser();
        if (login_user) {
            if (login_user.id === article.owner) {
                const icon = document.createElement("i");
                icon.setAttribute("class", "fas fa-camera");
                icon.setAttribute("onclick", `uploadPhoto(${article.pk})`);
                newCard.appendChild(icon);
            }
        }

        list_div.appendChild(newCardBox);
    });
}

// 게시글 눌렀을 때 게시글 id 값을 가지고 상세페이지로 이동하는 함수
function articleDetail(article_id) {
    window.location.href = `${frontend_base_url}/articles/article_detail.html?article_id=${article_id}`;
}

// 댓글 목록 UI
function commentList(comments, list_div) {
    comments.forEach(async (comment) => {
        const newCardBox = document.createElement("li");
        newCardBox.setAttribute("class", "card-box");

        const newCard = document.createElement("div");
        newCard.setAttribute("class", "card h-100");
        newCard.setAttribute("id", `comment-${comment.id}`);
        newCardBox.appendChild(newCard);

        const post = await getArticle(comment.article);
        const articlePhoto = post.photos[0]?.file;
        const articleImage = document.createElement("img");
        articleImage.setAttribute("class", "card-img-top");
        if (articlePhoto) {
            articleImage.setAttribute("src", `${articlePhoto}`);
        } else {
            articleImage.setAttribute(
                "src",
                "https://cdn11.bigcommerce.com/s-1812kprzl2/images/stencil/original/products/426/5082/no-image__12882.1665668288.jpg?c=2"
            );
        }
        articleImage.setAttribute("onclick", `uploadPhoto(${comment.article})`);
        newCard.appendChild(articleImage);

        const newCardBody = document.createElement("div");
        newCardBody.setAttribute("class", "card-body");
        newCardBody.setAttribute("onclick", `articleDetail(${comment.article})`);
        newCard.appendChild(newCardBody);

        const newCardTile = document.createElement("h6");
        newCardTile.setAttribute("class", "card-title");
        newCardTile.innerText = comment.comment;
        newCardBody.appendChild(newCardTile);

        const newCardlike = document.createElement("p");
        newCardlike.setAttribute("class", "card-text");
        newCardlike.innerText = `좋아요 ${comment.like_count}개`;
        newCardBody.appendChild(newCardlike);

        list_div.appendChild(newCardBox);
    });
}
