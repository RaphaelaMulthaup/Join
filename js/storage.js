const STORAGE_TOKEN = '39QCOR1Z1NVJZHWNBMOEMDPO2Y6VX0RI1KUJ7OM7';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';

async function setItem(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN };
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload) })
        .then(res => res.json());
}

async function getItem(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return fetch(url).then(res => res.json()).then(res => {
        if (res.data) {
            return res.data.value;
        } throw `Could not find data with key "${key}".`;
    });
}

//work in progress
function onloadFunc() {
    loadData("");
    // loadData("/name"); // zum ausgeben der Daten
    // postData("/name", {
    //     "banana": "rama",
    //     "bananas": "ramas"
    // })
    // deleteData("/-Nxkq291cFI_P_KJBPBd");
    putData("/users/user", {
        "color": "klecks",
        "name": "blunt"
    });
    // postData()
}

const BASE_URL = "https://remotestorage-d71ae-default-rtdb.europe-west1.firebasedatabase.app/";

async function loadData(path = "") {
    let response = await fetch(BASE_URL + path + ".json");
    let responseToJson = await response.json();
    console.log('welcher log?',responseToJson);
}

// wird hinzugefügt mit einer einzigartigen ID. Es wird nichts ersetzt
async function postData(path = "", data = {}) {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "POST",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });

    console.log('data', data);

    setTimeout(() => {
        console.log('userData', users);
    }, 3000);

    return await response.json();
}

async function deleteData(path = "") {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "DELETE",
    });

    return responseToJson = await response.json();
}

// überschreibt alles was gleich heißt
async function putData(path = "", data = {}) {
    setTimeout(() => {
    let response = fetch(BASE_URL + path + ".json", {
        method: "PUT",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    }, 3000);
    console.log('userData', users);
    });

    // return responseToJson = await response.json();
}


/*Raphaelas Versuche*/

const firebaseUrl = "https://join-2fe35-default-rtdb.europe-west1.firebasedatabase.app/";

async function postTasksToDatabase(path=""){
    let response = await fetch("../tasks.json");
    let data = await response.json();
    
    await fetch(firebaseUrl + path + ".json", {
        method: "POST",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
}