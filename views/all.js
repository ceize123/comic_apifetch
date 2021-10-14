// function makeAJAXRequest(method, url) {
//             fetch(url, {
//                 method: method,
//                 headers: { 'Content-Type': 'application/json' },
//                 mode: "no-cors",
//             })
//             .then(() => {
//                 window.location = url;
//             });
//         }

//         function nextComic() {
//             let num = document.getElementById('num');
//             makeAJAXRequest("GET", ++num.textContent);
//         }

//         function previousComic() {
//             let num = document.getElementById('num');
//             makeAJAXRequest("GET", --num.textContent);
//         }