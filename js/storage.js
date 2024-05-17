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

function onloadFunc() {
    loadData("/users"); // zum ausgeben der Daten

}

// Daten(spiel)platz Franz
const BASE_URL = "https://remotestorage-d71ae-default-rtdb.europe-west1.firebasedatabase.app/";


/*Raphaelas Versuche*/

const firebaseUrl = "https://join-2fe35-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * This function loads the example tasks into the database.
 */
async function putTasksToDatabase(){
    let response = await fetch("../json/tasks.json");
    let data = await response.json();

    await fetch(firebaseUrl + "/tasks" + ".json", {
        method: "PUT",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
}

/**
 * This function loads the example users into the database.
 */
async function putUsersToDatabase(){
    let response = await fetch("../json/users.json");
    let data = await response.json();

    await fetch(BASE_URL + "/users" + ".json", {
        method: "PUT",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
}

/**
 * This function loads data whith are saved in the database and returnes them.
 * 
 * @param {string} path The deposit under which the data should be loaded.
 * @returns the data
 */
async function loadData(path=""){
    let response = await fetch(firebaseUrl + path + ".json");
    return  responseToJson = await response.json();
}

async function putCurrentUsersToDatabase(){
    let users = postData;

    await fetch(BASE_URL + "/currentUser" + ".json", { // Der Datenpfad in der Firebase-Datenbank kann hier angepasst werden
        method: "PUT",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(users)
    });
}

async function postData(path = "", data = {}) {
    let response = await fetch(BASE_URL + path + ".json", {
      method: "POST",
      header: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return (responseToJson = await response.json());
  }