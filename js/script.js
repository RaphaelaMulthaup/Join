let menuItems = ['menuItemSummary', 'menuItemAddTask', 'menuItemBoard', 'menuItemContacts']

async function loadPage(id) {
    await includeHTML();
    selectActivePage(id);
}

async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html");
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
        let menuItem = document.getElementById(menuItems[i]);
        if ((id !=null) && (menuItems[i]==id)) {
            menuItem.classList.add('menuItemActicePage');
            menuItem.classList.remove('menuItemHoveringPossible');
            let svg = menuItem.querySelector("svg");
            let paths = svg.querySelectorAll("path");
            paths.forEach(path => {
                path.classList.add('svgMenuItemActicePage');
            })
        } else{
            menuItem.classList.remove('menuItemActicePage');
            menuItem.classList.add('menuItemHoveringPossible');
            let svg = menuItem.querySelector("svg");
            let paths = svg.querySelectorAll("path");
            paths.forEach(path => {
                path.classList.remove('svgMenuItemActicePage');
            })
        }
        
    }
}
