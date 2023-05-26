console.log("articles_list 연결됨")

// 페이지네이션
async function paginationView(articles) {
    const contents = document.getElementById("article-list-kmj");
    const buttons = document.getElementById("buttons-kmj");

    const numOfContent = articles.length;
    console.log(numOfContent)
    const maxContent = 10;
    const maxButton = 3;
    const maxPage = Math.ceil(numOfContent / maxContent);
    let page = 1;

    const makeContent = (id) => {
        const content_kmj = document.createElement("tr");
        content_kmj.setAttribute("onclick", `articleDetail(${articles[id].pk})`);
        content_kmj.innerHTML = `
            <th>${articles[id].pk}</th>
            <td>${articles[id].title}</td>
            <td>${articles[id].nickname}</td>
            <td>${articles[id].created_at}</td>
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
            contents.appendChild(makeContent(id));
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
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get("query");

    if (query) {
        q_articles = await getQueryArticles(query)
        if (q_articles.status == 200) {
            articles = await q_articles.json();
        } else if (q_articles.status == 204) {
            alert("해당 검색어가 포함된 게시글을 찾을 수 없습니다!")
            articles = await getArticles()
        }
    } else {
        articles = await getArticles()
    }
    articles.sort((x, y) => y.pk - x.pk)

    // articleList(articles)
    paginationView(articles)
}