let menuItems = ['menuItemSummary', 'menuItemAddTask', 'menuItemBoard', 'menuItemContacts']

async function loadPage(id) {
    await includeHTML();
    selectActivePage(id);
}

async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html"); // "includes/header.html"
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}

function selectActivePage(id){
    for (let i = 0; i < menuItems.length; i++) {
        document.getElementById(menuItems[i]).classList.remove('menuItemActicePage');
        document.getElementById(menuItems[i]).classList.add('menuItemHoveringPossible');
    }
    document.getElementById(id).classList.add('menuItemActicePage');
    document.getElementById(id).classList.remove('menuItemHoveringPossible');
}