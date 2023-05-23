console.log("loader.js 로드됨")
// navbar.html을 가져옴
// 로그인 되지 않은 상태에서는 글쓰기가 안 보이고, 로그인 된 상태라면 로그인이 안 보이고 로그아웃 버튼이 생김
async function injectNavbar() {
    fetch("/navbar.html").then(response => {
        return response.text()
    })
        .then(data => {
            document.querySelector("header").innerHTML = data;
        })

    let navbarHtml = await fetch("/navbar.html")
    let data = await navbarHtml.text()
    document.querySelector("header").innerHTML = data;

    const payload = localStorage.getItem("payload")
    if (payload) {
        const login_user = await getUser();
        console.log(login_user)

        const intro = document.getElementById("intro")
        intro.innerText = `${login_user.nickname}님 오셨군요!`

        let navbarLeft = document.getElementById("navbar-left")
        let postLi = document.createElement("li")
        postLi.setAttribute("class", "nav-item")

        let postLink = document.createElement("a")
        postLink.setAttribute("href", "/create_article.html")
        postLink.setAttribute("class", "nav-link")
        postLink.innerHTML = "글쓰기"

        postLi.appendChild(postLink)
        navbarLeft.appendChild(postLi)

        let navbarRight = document.getElementById("navbar-right")
        let newLi = document.createElement("li")
        newLi.setAttribute("class", "nav-item")

        let logoutBtn = document.createElement("button")
        logoutBtn.setAttribute("class", "nav-link btn")
        logoutBtn.innerText = "로그아웃"
        logoutBtn.setAttribute("onclick", "handleLogout()")

        newLi.appendChild(logoutBtn)

        navbarRight.appendChild(newLi)

        let loginButton = document.getElementById("login-button")
        loginButton.style.display = "none"
    }
}

injectNavbar();