console.log("loader.js 로드됨");
// navbar.html을 가져옴
// 로그인 되지 않은 상태에서는 글쓰기가 안 보이고, 로그인 된 상태라면 로그인이 안 보이고 로그아웃 버튼이 생김
async function injectNavbar() {
    let navbarHtml = await fetch("/navbar.html");
    let headerdata = await navbarHtml.text();
    document.querySelector("header").innerHTML = headerdata;

    let footerHtml = await fetch("/footer.html");
    let footerdata = await footerHtml.text();
    document.querySelector("footer").innerHTML = footerdata;

    const login_user = await getLoginUser();
    if (login_user) {
        const intro = document.getElementById("intro");
        intro.innerText = `${login_user.nickname}님 오셨군요!`;

        const loginswitch = document.getElementById("login-switch");
        loginswitch.innerText = "로그아웃";
        loginswitch.setAttribute("onclick", "handleLogout()");

        let loginOnlyElements = document.querySelectorAll(".hd-login-only");
        loginOnlyElements.forEach((element) => {
            element.classList.remove("hd-login-only");
        });
    }
}

injectNavbar();


// 유저 프로필 정보 UI
function userProfile(user, list_div) {
    // 프로필이미지가 없다면 기본 이미지로
    if (user.avatar) {
        user.avatar = user.avatar
    } else {
        user.avatar = "https://cdn11.bigcommerce.com/s-1812kprzl2/images/stencil/original/products/426/5082/no-image__12882.1665668288.jpg?c=2"
    }

    list_div.innerHTML = ""
    list_div.innerHTML += `<img class="profile_img" src="${user.avatar}" alt="profile">
    <div class="profile_text" id="profile_nickname">${user.nickname}</div>
    <div class="profile_text">
        <div id="following">팔로잉 ${user.followings.length}명</div>
        <div id="follower">팔로워 N명</div>
    </div>
    <div class="profile_text" id="genre">
    </div>`
    // 장르가 있다면 추가로 생성
    if (user.genre) {
        const genreBox = document.getElementById("genre")
        user.genre.forEach(async genre => {
            const newDiv = document.createElement("div")
            newDiv.setAttribute("class", "genre")
            genreBox.appendChild(newDiv)
        }
        )
    }
}


// 유저 게시글 목록 UI
function userArticleList(articles, list_div) {
    list_div.innerHTML = ""
    const newCardBox = document.createElement("div")
    newCardBox.setAttribute("class", "card-box")
    articles.forEach(async article => {
        const newCard = document.createElement("div")
        newCard.setAttribute("class", "card")
        newCard.setAttribute("id", article.pk)
        newCardBox.appendChild(newCard)

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
        newCardBody.setAttribute("onclick", `articleDetail(${article.pk})`)
        newCard.appendChild(newCardBody)

        const newCardTile = document.createElement("h6")
        newCardTile.setAttribute("class", "card-title")
        newCardTile.innerText = article.title
        newCardBody.appendChild(newCardTile)

        const newCardtime = document.createElement("p")
        newCardtime.setAttribute("class", "card-text")
        newCardtime.innerText = article.created_at
        newCardBody.appendChild(newCardtime)

        list_div.appendChild(newCardBox)
    })
}


// 유저 댓글 목록 UI
function userCommentList(comments, list_div) {
    list_div.innerHTML = ""
    const newCardBox = document.createElement("div")
    newCardBox.setAttribute("class", "card-box")
    comments.forEach(async comment => {
        const newCard = document.createElement("div");
        newCard.setAttribute("class", "card");
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
    })
}