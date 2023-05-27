console.log("articles_list 연결됨")

// 페이지네이션
async function paginationView(follows) {
    const contents = document.getElementById("article-list-kmj");
    const buttons = document.getElementById("buttons-kmj");

    const numOfContent = follows.length;
    const maxContent = 10;
    const maxButton = 5;
    const maxPage = Math.ceil(numOfContent / maxContent);
    let page = 1;


    const makeContent = (id) => {
        // 프로필이미지 없다면 기본이미지로 대체
        if (!follows[id].avatar){
            follows[id].avatar= 'https://cdn11.bigcommerce.com/s-1812kprzl2/images/stencil/original/products/426/5082/no-image__12882.1665668288.jpg?c=2';
        }
        // 선호장르 없다면 공란으로 표기
        if (!follows[id].genre){
            follows[id].genre= '-';
        }
        const content_kmj = document.createElement("tr");
        content_kmj.setAttribute("onclick", `goProfile(${follows[id].id})`);
        content_kmj.innerHTML = `
            <td><img class="profile_img" style='background-image: url(${follows[id].avatar});'></td>
            <td>${follows[id].nickname}</td>
            <td>${follows[id].genre}</td>
            <td>${follows[id].followings}(미완)</td>
            <td>${follows[id].following}(미완)</td>
            <td>${follows[id].following}(미완)</td>
            <td>${follows[id].followings.length}</td>
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
    if (user_id) {
        follows = await getFollowing(user_id)
        follows.sort((x, y) => y.pk - x.pk)
    }
    paginationView(follows)
}

