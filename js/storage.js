// Daten(spiel)platz Franz
const BASE_URL = "https://remotestorage-d71ae-default-rtdb.europe-west1.firebasedatabase.app/";

/*Haupt URL*/
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

    await fetch(firebaseUrl + "/users" + ".json", {
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

async function putData(path = "", data = {}) {
    let response = await fetch(firebaseUrl + path + ".json", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
}