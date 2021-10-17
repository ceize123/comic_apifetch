let max = Infinity;
let loadingPage = document.querySelector(".loadingPage");
let loadingPercent = document.querySelector(".percent");
let loadingBarWidth = 50; // starts with 50px
let counter = {};
let minute = document.querySelector(".minutes");
let second = document.querySelector(".seconds");

// get latest comic number
const getLatestNum = () => {
    fetch(`/api`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        mode: "no-cors",
    }).then((response) => {
            return response.json();
        })
        .then((response) => {
            max = response.num;
        });
};
getLatestNum();


// DOM manipulation
const domManip = (response) => {
    document.getElementById("num").innerHTML = response.num;
    document.getElementById("time").innerHTML = `${response.month}-${response.day}-${response.year}`;
    document.getElementById("time").setAttribute("datetime", `${response.month}-${response.day}-${response.year}`);
    document.getElementById("title").innerHTML = response.title;
    let transcript = response.transcript.replace(/(?:\r\n|\r|\n)/g, "<br>");
    document.getElementById("transcript").innerHTML = transcript;
    document.getElementById("comic").src = response.img;
    document.getElementById("countedNum").innerHTML = counter[response.num];
};

// run the request every time the page reloads
const loadingRequest = method => {
    let path = window.location.pathname.replace("/", "");
    let comicNum = "";
    if (path !== "") {
        comicNum = path;
    }
    fetch(`/api/${comicNum}`, {
        method: method,
        headers: { "Content-Type": "application/json" },
        mode: "no-cors",
    }).then((response) => {
        return response.json();
    }).then((response) => {
        loadingAnimation();
        viewedCounting(response.num);
        domManip(response);
    });
};

const makeAJAXRequest = (method, comicNum) => {
    if (comicNum === "") {
        swal({
            title: "Please Input a number",
            icon: "warning",
            dangerMode: true,
        });
        return;
    }

    fetch(`/api/${comicNum}`, {
        method: method,
        headers: { "Content-Type": "application/json" },
        mode: "no-cors",
    }).then((response) => {
        // window.location = url;
        return response.json();
    }).then((response) => {
        if (response.num) {
            viewedCounting(response.num);
            domManip(response);
            history.pushState({}, null, `${comicNum}`);
        } else {
            swal({
                title: "The comic number does not exist.",
                icon: "warning",
                dangerMode: true,
            });
        }
    });
};


// loading animation
const loadingAnimation = () => {
    const loadingBar = setInterval(() => {
        loadingPercent.style.width = `${++loadingBarWidth}px`;
        if (loadingBarWidth > 200) {
            loadingPage.childNodes[1].textContent = "Completed!";
            loadingPage.classList.add("complete");
            setTimeout(()=> { 
                clearInterval(loadingBar);
                document.body.style.overflowY = "scroll";
             }, 1000);
        }
    }, 10);
};


// function for buttons
const nextComic = (num) => {
    resetTime();
    makeAJAXRequest("GET", parseInt(num.textContent) + 1);
};

const previousComic = (num) => {
    resetTime();
    makeAJAXRequest("GET", parseInt(num.textContent) - 1);
};

const random = () => {
    resetTime();
    makeAJAXRequest("GET", Math.floor(Math.random() * max));
};

const search = (select) => {
    let num = document.getElementById("num");
    let comicID = document.getElementById("comicID");
    switch (select) {
        case 1:
            nextComic(num);
            break;
        case -1:
            previousComic(num);
            break;
        case 0:
            random();
            break;
        default:
            makeAJAXRequest("GET", comicID.value);
            break;
    }
};


// counter
const viewedCounting = (num) => {
    if (counter[num] === undefined) {
        counter[num] = 1;
    } else {
        counter[num]++;
    }
};


// logic for time passed counting
const timePassed = () => {
    if (parseInt(second.textContent) < 59)
        second.textContent = ("0" + parseInt(++second.textContent)).slice(-2);
    else if (parseInt(second.textContent) === 59) {
        second.textContent = "00";
        minute.textContent = parseInt(++minute.textContent);
    }
};

let timeSet = setInterval(timePassed, 1000);

const resetTime = () => {
    clearInterval(timeSet);
    second.textContent = "00";
    minute.textContent = "00";
    timeSet = setInterval(timePassed, 1000);
};