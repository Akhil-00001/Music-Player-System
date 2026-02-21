const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

const LANG = {
    en: {
        welcome: "Welcome",
        song: "Song",
        favorites: "Favorites",
        recent: "Recently Played",
        login: "Login",
        logout: "Logout",
        sangeet: "Sangeet",
    },
    hi: {
        welcome: "स्वागत है",
        song: "गीत",
        favorites: "पसंदीदा",
        recent: "हाल ही में सुना",
        login: "लॉगिन",
        logout: "लॉगआउट",
        sangeet: "संगीत",
    },
    jp: {
        welcome: "ようこそ",
        song: "曲",
        favorites: "お気に入り",
        recent: "最近再生",
        login: "ログイン",
        logout: "ログアウト",
        sangeet: "音楽",
    }
};
let songs = [];

let index = 0;

let curraudio = "";

let foldr;

let audio = new Audio();

let sliderflag = true;

const ICONS = {
    play: "SVGS/play.svg",
    pause: "SVGS/pause.svg",
    next: "SVGS/next.svg",
    prev: "SVGS/prev.svg",
    stop: "SVGS/stop.svg",
    logo: "SVGS/logo.svg",
    menu: "Images/hamburger.png",
    close: "SVGS/cross.svg",
    gr: "SVGS/gr.svg",
    lr: "SVGS/lr.svg"
};


play.src = "SVGS/play.svg";

let arrayoflis = [];

let arr = ["Romance", "Peace", "Party", "J pop"];

play.addEventListener("click", () => {
    if (!curraudio || arrayoflis.length === 0) return;
    if (audio.paused) {
        audio.play();
        play.src = ICONS.pause;
    } else {
        audio.pause();
        play.src = ICONS.play;
    }
});

next.addEventListener("click", () => {
    if (!curraudio || arrayoflis.length === 0) return;
    index = (index + 1) % arrayoflis.length;
    curraudio = arrayoflis[index].dataset.url;
    playaudio(curraudio);
});

prev.addEventListener("click", () => {
    if (!curraudio || arrayoflis.length === 0) return;

    index = (index - 1 + arrayoflis.length) % arrayoflis.length;
    curraudio = arrayoflis[index].dataset.url;
    playaudio(curraudio);
});

audio.addEventListener("ended", () => {
    if (!curraudio || arrayoflis.length === 0) return;
    index = (index + 1) % arrayoflis.length;
    curraudio = arrayoflis[index].dataset.url;
    playaudio(curraudio);
});


audio.addEventListener('timeupdate', () => {
    timing.innerHTML = mintosec(audio.currentTime) + '/' + mintosec(audio.duration);
    seekbar();
})
bar.addEventListener("click", (e) => {
    if (!curraudio || arrayoflis.length === 0) return;
    circle.style.left = `${e.offsetX}px`;
    audio.currentTime = (e.offsetX / e.target.getBoundingClientRect().width) * audio.duration;
    audio.play();
    play.src = ICONS.pause;

})


function applyLanguage(lang) {
    const t = LANG[lang] || LANG.en;


    const user = JSON.parse(localStorage.getItem("user"));
    const welcomeEl = document.getElementById("welcomeUser");
    if (welcomeEl) {
        if (user) {
            welcomeEl.innerText = `${t.welcome}, ${user.name} 🎵`;
        } else {
            welcomeEl.innerText = `${t.welcome} 🎵`;
        }
    }
    sngt.innerText = t.sangeet;
    lib.innerText = t.song;

    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (t[key]) el.innerText = t[key];
    });


    const btn = document.getElementById("authBtn");
    if (btn) {
        if (localStorage.getItem("token")) {
            btn.innerText = t.logout;
        } else {
            btn.innerText = t.login;
        }
    }


    const favTitle = document.querySelector(".card.favCard .title");
    if (favTitle) favTitle.innerText = t.favorites;

    const recTitle = document.querySelector(".card.recCard .title");
    if (recTitle) recTitle.innerText = t.recent;
}



function seekbar() {
    if (!curraudio || !audio.duration) return;

    let ratio = audio.currentTime / audio.duration;
    let ln = document.querySelector(".bar").offsetWidth;
    circle.style.left = `${ln * ratio}px`;
}

var value = 0.5;
function playaudio(url) {
    audio.src = url;
    document.querySelector("#volume").innerHTML = `<label for="volume-slider">Volume:</label>
<input id="volume1" type="range" min="0" max="1" step="0.1" value="${value}">`;
    volume1.addEventListener("input", () => {
        audio.volume = volume1.value;
        value = audio.volume;
    });
    audio.load();
    audio.play();
    audio.volume = volume1.value;
    play.src = ICONS.pause;
    circle.style.left = "0px";
    document.querySelector(".content").innerHTML = arrayoflis[index].innerText;
    const title = arrayoflis[index].childNodes[0].textContent.trim();
    addToRecent(arrayoflis[index].dataset.id, title, arrayoflis[index].dataset.url);
}

const user = JSON.parse(localStorage.getItem("user"));

if (user) {
    document.getElementById("welcomeUser").innerText =
        `Welcome, ${user.name} 🎵`;
}

function playthis() {
    arrayoflis = Array.from(document.querySelectorAll("div>ul>li"));

    arrayoflis.forEach((e, i) => {
        e.addEventListener("click", () => {
            curraudio = e.dataset.url;
            index = i;
            playaudio(curraudio);
        });
    });
}


function mintosec(time) {
    if (isNaN(time)) return "0:00";

    let min = Math.floor(time / 60);
    let sec = Math.floor(time % 60);

    if (sec < 10) sec = "0" + sec;

    return `${min}:${sec}`;
}


function setupAuthButton() {
    const token = localStorage.getItem("token");
    const btn = document.getElementById("authBtn");

    if (token) {
        btn.innerText = "Logout";
        btn.onclick = () => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "login.html";
        };
    } else {
        btn.innerText = "Login";
        btn.onclick = () => {
            window.location.href = "login.html";
        };
    }
}

async function loadFolderSongs(folder) {
    foldr = folder;

    let res = await fetch(`/api/songs/${folder}`);
    let data = await res.json();

    renderSongList(data);
}

function renderSongList(data) {
    let ele = document.querySelector("div>ul");
    ele.innerHTML = "";

    let likedIds = (window.currentUserFavorites || []).map(s => s.songId);
    data.forEach((song) => {
        const liked = likedIds.includes(song.songId || song._id);

        ele.innerHTML += `
        <li data-id="${song._id}" data-url="${song.file_url}">
            ${song.title}
            <button onclick="toggleFavorite('${song.songId || song._id}','${song.title}','${song.artist}','${song.file_url}', this)">
                ${liked ? "❤️" : "🤍"}
            </button>
        </li>`;
    });

    playthis();
}


function loadIcons() {
    play.src = ICONS.play;
    prev.src = ICONS.prev;
    next.src = ICONS.next;
    burger.src = ICONS.menu;
    cross.src = ICONS.close;
    gr.src = ICONS.gr;
    lr.src = ICONS.lr;
    document.querySelector(".logo").src = ICONS.logo;
}


function transitions() {
    cross.addEventListener("click", () => {
        document.querySelector(".sidebar").classList.add("closed");
        sliderflag = false;
        burger.style.transform = "translateX(100%)";
    });

    burger.addEventListener("click", () => {
        document.querySelector(".sidebar").classList.remove("closed");
        sliderflag = true;
        burger.style.transform = "translateX(-120%)";
    });
}



async function loadLibraries() {
    const cardsContainer = document.querySelector(".cards");
    cardsContainer.innerHTML = "";


    for (let folder of arr) {
        let res = await fetch(`/api/songs/${folder}`);
        let songs = await res.json();

        if (!songs.length) continue;

        let image = songs[0].image || "default.jpg";

        let div = document.createElement("div");
        div.className = "card";
        div.innerHTML = `
            <img src="Images/${image}" alt="cover">
            <div>${folder}</div>
        `;

        div.addEventListener("click", () => {
            let ele = document.querySelector(".sidebar")
            if (ele.classList.contains("closed")) {
                ele.classList.remove("closed");
                sliderflag = true;
                burger.style.transform = "translateX(-120%)";
            }
            loadFolderSongs(folder)
        });

        cardsContainer.appendChild(div);
    }

    yours.innerHTML = "";
    const token = localStorage.getItem("token");

    if (token) {
        const res = await fetch("/api/user/me", {
            headers: { Authorization: token }
        });

        const user = await res.json();

        if (user.favorites && user.favorites.length) {
            const favCard = document.createElement("div");
            favCard.className = "card";
            favCard.innerHTML = `
                <img src="Images/fav.jpg">
                <div>Favorites</div>
            `;
            window.currentUserFavorites = user.favorites || [];
            favCard.addEventListener("click", () => renderSongList(user.favorites));
            yours.appendChild(favCard);
        }


        if (user.recentlyPlayed && user.recentlyPlayed.length) {
            const recCard = document.createElement("div");
            recCard.className = "card";
            recCard.innerHTML = `
                <img src="Images/recent.jpg">
                <div>Recently Played</div>
            `;
            recCard.addEventListener("click", () => renderSongList(user.recentlyPlayed));
            yours.appendChild(recCard);
        }
    }
}

async function toggleFavorite(id, title, artist, file_url, btn) {
    const token = localStorage.getItem("token");

    const res = await fetch("/api/user/favorite", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: token
        },
        body: JSON.stringify({ songId: id, title, artist, file_url })
    });

    const data = await res.json();

    if (data.liked) {
        btn.innerText = "❤️";
    } else {
        await loadLibraries();
        btn.innerText = "🤍";
    }


}

async function addToRecent(id, title, file_url) {
    const token = localStorage.getItem("token");

    await fetch("/api/user/recent", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: token
        },
        body: JSON.stringify({
            songId: id,
            title: title,
            file_url: file_url
        })
    });

    
}

async function main() {

    setupAuthButton();


    const langSelect = document.getElementById("languageSelect");

    if (langSelect) {
        langSelect.addEventListener("change", () => {
            const lang = langSelect.value;
            localStorage.setItem("lang", lang);
            applyLanguage(lang);
        });
    }


    const savedLang = localStorage.getItem("lang") || "en";
    if (langSelect) langSelect.value = savedLang;
    await loadLibraries();
    applyLanguage(savedLang);
    loadIcons();
    transitions();
}
main()
