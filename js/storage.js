/*Haupt URL*/
const firebaseUrl = "https://join-2fe35-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * This function loads the example tasks into the database.
 */
async function putExampleTasksToDatabase(){
    let response = await fetch("../json/tasks.json");
    let data = await response.json();
    await putTasksToDatabase(data);
}

/**
 * This function loads tasks into the database.
 * 
 * @param {JSON} data The JSON with tasks to be saved in the database. 
 */
async function putTasksToDatabase(data){
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
async function putExampleUsersToDatabase(){
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
 * This function loads data which are saved in the database and returnes them.
 * 
 * @param {string} path The deposit under which the data should be loaded.
 * @returns the data
 */
async function loadData(path=""){
    let response = await fetch(firebaseUrl + path + ".json");
    return  responseToJson = await response.json();
}

/**
 * Sends a PUT request to the specified path with the provided data.
 *
 * @async
 * @function putData
 * @param {string} [path=""] - The path to append to the base URL for the request.
 * @param {Object} [data={}] - The data to send in the body of the request.
 * @returns {Promise<Object>} The response data as a JSON object.
 *
 * @example
 * const result = await putData('/users/123', { name: 'John Doe', email: 'john@example.com' });
 * console.log(result);
 */
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