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
    gr:"SVGS/gr.svg",
    lr:"SVGS/lr.svg"
};


play.src = "SVGS/play.svg";

let arrayoflis = [];

let arr = ["Romance", "Peace", "Party", "J pop"];

play.addEventListener("click", () => {
    if (!curraudio || arrayoflis.length === 0) return;
    if (audio.paused) {
        audio.play();
        play.src = ICONS.pause;   // show pause when playing
    } else {
        audio.pause();
        play.src = ICONS.play;    // show play when paused
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

function seekbar() {
    if (!curraudio || !audio.duration) return;

    let ratio = audio.currentTime / audio.duration;
    let ln = document.querySelector(".bar").offsetWidth;
    circle.style.left = `${ln * ratio}px`;
}


function playaudio(url) {
    audio.src = url;
    audio.load();
    audio.play();
    play.src = ICONS.pause;
    circle.style.left = "0px";
    document.querySelector(".content").innerHTML =
        arrayoflis[index].innerText;
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


async function getdata(folder) {
    foldr = folder;

    let res = await fetch(`/api/songs/${folder}`);
    let data = await res.json();

    let ele = document.querySelector("div>ul");
    ele.innerHTML = "";

    data.forEach((song, i) => {
        ele.innerHTML += `<li data-url="${song.file_url}">${song.title}</li>`;
    });
    if(!sliderflag) {
        document.querySelector(".sidebar").classList.remove("closed");
        sliderflag = true;
        burger.style.transform = "translateX(-120%)";
    }
    playthis();
}



async function libfill() {
    const cardsContainer = document.querySelector(".cards");
    cardsContainer.innerHTML = "";

    for (let folder of arr) {
        let res = await fetch(`/api/songs/${folder}`);
        let songs = await res.json();

        if (!songs.length) continue;

        // take first song as folder representative
        let image = songs[0].image || "default.jpg";

        let div = document.createElement("div");
        div.className = "card";
        div.innerHTML = `
            <img src="Images/${image}" alt="cover">
            <div>${folder}</div>
            <div class="fldr" style="display:none">${folder}</div>
        `;

        div.addEventListener("click", () => getdata(folder));

        cardsContainer.appendChild(div);
    }
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



async function main() {
    await libfill();
    loadIcons();
    transitions();
    const mediaquery = window.matchMedia("(max-width: 600px)")
    mediaquery.addEventListener("change",(e)=>{
        document.querySelector(".sidebar").classList.add("closed");
        sliderflag = false;
        burger.style.transform = "translateX(100%)";
    });
    const mediaquery1 = window.matchMedia("(min-width: 601px)")
    mediaquery1.addEventListener("change",(e)=>{
        document.querySelector(".sidebar").classList.remove("closed");
        sliderflag = true;
        burger.style.transform = "translateX(-120%)";
    });
}
main()