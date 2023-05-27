console.log("loader.js 로드됨");
// navbar.html을 가져옴
// 로그인 되지 않은 상태에서는 글쓰기가 안 보이고, 로그인 된 상태라면 로그인이 안 보이고 로그아웃 버튼이 생김
async function injectNavbar() {
    let headerHtml = await fetch("/header.html");
    let headerdata = await headerHtml.text();
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
    </div>
    <div id="updateBtn">
    </div>
    `
    // 장르가 있다면 추가로 생성
    if (user.genre) {
        const genreBox = document.getElementById("genre")
        const newDiv = document.createElement("div")
        newDiv.setAttribute("class", "genre")
        newDiv.innerText = user.genre
        genreBox.appendChild(newDiv)
    }
    const payload = localStorage.getItem("payload");
    const payload_parse = JSON.parse(payload);
    user_id = payload_parse.user_id;

    // 자신의 프로필이라면 프로필 수정버튼 보이기
    if (user.id === user_id){
        const update_box = document.getElementById("updateBtn")
        const newdiv = document.createElement("div")
        newdiv.setAttribute("class", "btn btn-secondary")
        newdiv.setAttribute("style", "margin:15% 30% 0 35%;")
        newdiv.setAttribute("onclick", "userUpdate()")
        newdiv.innerText = "프로필 수정 »"
        update_box.appendChild(newdiv)
    }

}

// 로그인 한 유저 정보 수정
async function putUser() {
	// 프로필 수정완료버튼 확인창 뜨기
    msg = confirm("프로필을 수정하시겠습니까?");
    const payload = localStorage.getItem("payload");
    const payload_parse = JSON.parse(payload);
    if (msg === true) {
		let token = localStorage.getItem("access");

		update_body={}

		const password = document.getElementById("password_update").value;
		const passwordCheck = document.getElementById("password-check_update").value
		const nickname = document.getElementById("nickname_update").value;
		const gender = document.getElementById("gender_update").value;
		const age = document.getElementById("age_update").value;
		// 변경사항이 있을 경우에만 추가
		if (password & password === passwordCheck ){update_body["password"] = password;}
		if (nickname){update_body["nickname"] = nickname;}
		if (gender){update_body["gender"] = gender;}
		if (age){update_body["age"] = age;}

		const response = await fetch(
			`${backend_base_url}/api/users/profile/${payload_parse.user_id}/`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
                    "content-type": "application/json",
				},
				method: "PUT",
				body: JSON.stringify(update_body),
			}
		);
		if (response.status == 200) {
			response_json = await response.json();
            window.location = `${frontend_base_url}/users/profile.html?user_id=${payload_parse.user_id}`
		} else {
			alert(response.statusText);
		}
	}else{
		window.location = `${frontend_base_url}/users/profile.html?user_id=${payload_parse.user_id}`
	}
}

// 유저 프로필 정보 수정하기 - 미완성
function userProfileUpdate(user,list_div) {
    // 프로필이미지가 없다면 기본 이미지로
    if (user.avatar) {
        user.avatar=user.avatar
    } else {
        user.avatar="https://cdn11.bigcommerce.com/s-1812kprzl2/images/stencil/original/products/426/5082/no-image__12882.1665668288.jpg?c=2"
    }
    
    list_div.innerHTML = ""
    list_div.innerHTML += `
    <div id="image_container"></div>
    <input onchange="setThumbnail(event);" name="file" type="file" class="form-control" id="file" aria-describedby="inputGroupFileAddon03" aria-label="Upload">
    <div class="mb-3">
                    <label for="Password" class="form-label">비밀번호</label>
                    <input type="password" class="form-control" name="password" id="password_update" placeholder="비밀번호">
                </div>
                <div class="mb-3">
                    <label for="Password-check" class="form-label">비밀번호 확인</label>
                    <input type="password" class="form-control" name="password-check" id="password-check_update"
                        placeholder="비밀번호 확인">
                </div>
                <div class="mb-3">
                    <label for="Nickname" class="form-label">닉네임</label>
                    <input type="text" class="form-control" name="nickname" id="nickname_update" placeholder="닉네임">
                </div>
                <div class="mb-3">
                    <label for="Gender" class="form-label">성별</label>
                    <select class="form-select" name="gender" id="gender_update">
                        <option value="" disabled selected>성별을 선택하세요</option>
                        <option value="M">남자</option>
                        <option value="F">여자</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label for="Age" class="form-label">나이</label>
                    <input type="number" class="form-control" name="age" id="age_update" placeholder="나이">
                </div>
                <div id="updateBtn">
                </div>`
    
    const update_box = document.getElementById("updateBtn")
    const newdiv = document.createElement("div")
    newdiv.setAttribute("class", "btn btn-secondary")
    newdiv.setAttribute("style", "margin: 0 30% 0 35%;")
    newdiv.setAttribute("onclick", "putUser()")
    newdiv.innerText = "프로필 수정 »"
    update_box.appendChild(newdiv)
    
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


async function goProfile(user_id){
    // 인자값이 존재한다면 해당 인자값의 유저 프로필로 이동
    if (user_id){
        user_id = user_id
        window.location.href = `${frontend_base_url}/users/profile.html?user_id=${user_id}`;
    }else{
        // 인자값이 없다면 현재 로그인한 유저의 프로필로 이동
        const payload = localStorage.getItem("payload");
        const payload_parse = JSON.parse(payload);
        user_id = payload_parse.user_id;
        window.location.href = `${frontend_base_url}/users/profile.html?user_id=${user_id}`;
    }

}

// 게시글 눌렀을 때 게시글 id 값을 가지고 상세페이지로 이동하는 함수
function articleDetail(article_id) {
    window.location.href = `${frontend_base_url}/articles/article_detail.html?article_id=${article_id}`;
}