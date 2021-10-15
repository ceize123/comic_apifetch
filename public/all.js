let max = Infinity;
let minute = document.querySelector(".minutes");
let second = document.querySelector(".seconds");

const getLatestNum = () => {
    fetch(`/api`, {
        method: "GET",
        headers: { 'Content-Type': 'application/json' },
        mode: "no-cors",
    }).then((response) => {
            return response.json();
        })
        .then((response) => {
            max = response.num;
        });
};
getLatestNum();

const loadingRequest = method => {
    let path = window.location.pathname.replace('/', '');
    let comicNum = "";
    if (path !== '') {
        comicNum = path;
    }
    fetch(`/api/${comicNum}`, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        mode: "no-cors",
    }).then((response) => {
        return response.json();
    }).then((response) => {
        document.getElementById('num').innerHTML = response.num;
        document.getElementById('time').innerHTML = `${response.month}-${response.day}-${response.year}`;
        document.getElementById('time').setAttribute("datetime",`${response.month}-${response.day}-${response.year}`);
        document.getElementById('title').innerHTML = response.title;
        let transcript = response.transcript.replace(/(?:\r\n|\r|\n)/g, '<br>');
        document.getElementById('transcript').innerHTML = transcript;
        document.getElementById('comic').src = response.img;
    });
};

const makeAJAXRequest = (method, comicNum) => {
    // if ((comicNum > max || comicNum <= 1) && comicNum !== "") {
    //     alert("Hi");
    //     return;
    // }

    // console.log(max);
    // console.log(window.location.pathname);
    // let path = window.location.pathname.replace('/', '');
    
    // if (path !== '') {
    //     comicNum = path;
    // }
    // console.log(path);
    // console.log(comicNum);

    fetch(`/api/${comicNum}`, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        mode: "no-cors",
    }).then((response) => {
        // window.location = url;
        return response.json();
    }).then((response) => {
        if (response.num) {
            document.getElementById('num').innerHTML = response.num;
            document.getElementById('time').innerHTML = `${response.month}-${response.day}-${response.year}`;
            document.getElementById('time').setAttribute("datetime",`${response.month}-${response.day}-${response.year}`);
            document.getElementById('title').innerHTML = response.title;
            let transcript = response.transcript.replace(/(?:\r\n|\r|\n)/g, '<br>');
            document.getElementById('transcript').innerHTML = transcript;
            document.getElementById('comic').src = response.img;
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
    let num = document.getElementById('num');
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
    }
};

const timePassed = () => {
    if (parseInt(second.textContent) < 59)
        second.textContent = ('0' + parseInt(++second.textContent)).slice(-2);
    else if (parseInt(second.textContent) === 59) {
        second.textContent = '00';
        minute.textContent = parseInt(++minute.textContent);
    }
};

let timeSet = setInterval(timePassed, 1000);

const resetTime = () => {
    clearInterval(timeSet);
    second.textContent = '00';
    minute.textContent = '00';
    timeSet = setInterval(timePassed, 1000);
}