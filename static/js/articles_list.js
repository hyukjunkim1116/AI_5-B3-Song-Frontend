console.log("articles_list 연결됨")

// 글 목록 가져오기
window.onload = async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get("query");

    if (query) {
        articles = await getQueryArticles(query)
        if (articles.status == 200) {
            articles = await articles.json();
        } else if (articles.status == 204) {
            alert("해당 검색어가 포함된 게시글을 찾을 수 없습니다!")
        }
        articles = await getArticles()
    } else {
        articles = await getArticles()
    }
    articles.sort((x, y) => y.pk - x.pk)
    articleList(articles)
}