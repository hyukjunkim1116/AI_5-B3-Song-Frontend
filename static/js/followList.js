console.log("follow_list 로드됨")


// 팔로잉 페이지네이션
async function paginationView_following(following) {
    const contents = document.getElementById("article-list-myo");
    const buttons = document.getElementById("buttons-myo");

    const numOfContent = following.length;
    const maxContent = 5;
    const maxButton = 5;
    const maxPage = Math.ceil(numOfContent / maxContent);
    let page = 1;
    const makeContent = (id) => {
        if (!following[id].avatar){
            following[id].avatar = "../static/image/free-icon-music-6599985.png"
        }
        const content_myo = document.createElement("tr");
        content_myo.setAttribute("onclick", `goProfile(${following[id].id})`);
        content_myo.innerHTML = `
            <th><img class="profile_img" style="background-image: url(${following[id].avatar});"></th>
            <td><text>${following[id].nickname}</text></td>
            <td><text>${following[id].articles}</text></td>
            <td><text>${following[id].followings.length}</text></td>
            <td><text>${following[id].followers.length}</text></td>
        `;
        return content_myo;
    };

    const makeButton = (id) => {
        const button_myo = document.createElement("button");
        button_myo.classList.add("button_kmj");
        button_myo.dataset.num = id;
        button_myo.innerText = id;
        button_myo.addEventListener("click", (e) => {
            Array.prototype.forEach.call(buttons.children, (button) => {
                if (button.dataset.num) button.classList.remove("active");
            });
            e.target.classList.add("active");
            renderContent(parseInt(e.target.dataset.num));
        });
        return button_myo;
    }

    const renderContent = (page) => {
        // 목록 리스트 초기화
        while (contents.hasChildNodes()) {
            contents.removeChild(contents.lastChild);
        }
        // 글의 최대 개수를 넘지 않는 선에서, 화면에 최대 10개의 글 생성
        for (let id = (page - 1) * maxContent + 1; id <= page * maxContent && id <= numOfContent; id++) {
            contents.appendChild(makeContent(id - 1));
        }
    };

    const goPrevPage = () => {
        page -= maxButton;
        render(page);
    };

    const goNextPage = () => {
        page += maxButton;
        render(page);
    };

    const prev = document.createElement("button");
    prev.classList.add("button_myo", "prev");
    prev.innerHTML = `<ion-icon name="chevron-back-outline"></ion-icon>`;
    prev.addEventListener("click", goPrevPage);

    const next = document.createElement("button");
    next.classList.add("button_myo", "next");
    next.innerHTML = `<ion-icon name="chevron-forward-outline"></ion-icon>`;
    next.addEventListener("click", goNextPage);

    const renderButton = (page) => {
        // 버튼 리스트 초기화
        while (buttons.hasChildNodes()) {
            buttons.removeChild(buttons.lastChild);
        }
        // 화면에 최대 10개의 페이지 버튼 생성
        for (let id = page; id < page + maxButton && id <= maxPage; id++) {
            buttons.appendChild(makeButton(id));
        }
        // 첫 버튼 활성화(class="active")
        buttons.children[0].classList.add("active");

        buttons.prepend(prev);
        buttons.appendChild(next);

        // 이전, 다음 페이지 버튼이 필요한지 체크
        if (page - maxButton < 1) buttons.removeChild(prev);
        if (page + maxButton > maxPage) buttons.removeChild(next);
    };

    const render = (page) => {
        renderContent(page);
        renderButton(page);
    };
    render(page);
}


// 팔로워 페이지네이션
async function paginationView_follower(follower) {
    const contents = document.getElementById("article-list-kmj");
    const buttons = document.getElementById("buttons-kmj");

    const numOfContent = follower.length;
    const maxContent = 5;
    const maxButton = 5;
    const maxPage = Math.ceil(numOfContent / maxContent);
    let page = 1;

    const makeContent = (id) => {
        if (!follower[id].avatar){
            follower[id].avatar = "../static/image/free-icon-music-6599985.png"
        }
        const content_kmj = document.createElement("tr");
        content_kmj.setAttribute("onclick", `goProfile(${follower[id].id})`);
        content_kmj.innerHTML = `
            <th><img class="profile_img" style="background-image: url(${follower[id].avatar});"></th>
            <td><text>${follower[id].nickname}</text></td>
            <td><text>${follower[id].articles}</text></td>
            <td><text>${follower[id].followings.length}</text></td>
            <td><text>${follower[id].followers.length}</text></td>
        `;
        return content_kmj;
    };

    const makeButton = (id) => {
        const button_kmj = document.createElement("button");
        button_kmj.classList.add("button_kmj");
        button_kmj.dataset.num = id;
        button_kmj.innerText = id;
        button_kmj.addEventListener("click", (e) => {
            Array.prototype.forEach.call(buttons.children, (button) => {
                if (button.dataset.num) button.classList.remove("active");
            });
            e.target.classList.add("active");
            renderContent(parseInt(e.target.dataset.num));
        });
        return button_kmj;
    }

    const renderContent = (page) => {
        // 목록 리스트 초기화
        while (contents.hasChildNodes()) {
            contents.removeChild(contents.lastChild);
        }
        // 글의 최대 개수를 넘지 않는 선에서, 화면에 최대 10개의 글 생성
        for (let id = (page - 1) * maxContent + 1; id <= page * maxContent && id <= numOfContent; id++) {
            contents.appendChild(makeContent(id - 1));
        }
    };

    const goPrevPage = () => {
        page -= maxButton;
        render(page);
    };

    const goNextPage = () => {
        page += maxButton;
        render(page);
    };

    const prev = document.createElement("button");
    prev.classList.add("button_kmj", "prev");
    prev.innerHTML = `<ion-icon name="chevron-back-outline"></ion-icon>`;
    prev.addEventListener("click", goPrevPage);

    const next = document.createElement("button");
    next.classList.add("button_kmj", "next");
    next.innerHTML = `<ion-icon name="chevron-forward-outline"></ion-icon>`;
    next.addEventListener("click", goNextPage);

    const renderButton = (page) => {
        // 버튼 리스트 초기화
        while (buttons.hasChildNodes()) {
            buttons.removeChild(buttons.lastChild);
        }
        // 화면에 최대 10개의 페이지 버튼 생성
        for (let id = page; id < page + maxButton && id <= maxPage; id++) {
            buttons.appendChild(makeButton(id));
        }
        // 첫 버튼 활성화(class="active")
        buttons.children[0].classList.add("active");

        buttons.prepend(prev);
        buttons.appendChild(next);

        // 이전, 다음 페이지 버튼이 필요한지 체크
        if (page - maxButton < 1) buttons.removeChild(prev);
        if (page + maxButton > maxPage) buttons.removeChild(next);
    };

    const render = (page) => {
        renderContent(page);
        renderButton(page);
    };
    render(page);
}

// 글 목록 가져오기
// 글목록 버튼을 누른 경우랑 검색 버튼을 누른 경우 결과값을 다르게 가져옴
window.onload = async function () {
    let getParams = window.location.search;
	let userParams = getParams.split("=")[1];
    const user_id = userParams;
    let user = await getOtherUser(user_id)
    following = user.followings;
    follower = user.followers;

    console.log("확인하자",user)
    document.getElementById("user_myo")

    // 팔로잉 Json 배열로 만들기
    let following_users = [];
    for (let i = 0; i < following.length; i++) {
        user = await getOtherUser(following[i]);
        following_users.push(user);
    }
    
    // 팔로워 Json 배열로 만들기
    let follower_users = [];
    for (let i = 0; i < follower.length; i++) {
        user = await getOtherUser(follower[i]);
        follower_users.push(user);
    }

    paginationView_following(following_users)
    paginationView_follower(follower_users)
}
