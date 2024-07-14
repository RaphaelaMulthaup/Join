/**
 * This function first loads the current page and then displays the appropriate menu coloring for the currently selected page.
 * 
 * @param {string} currentPage name of the current page
 */
async function loadInfoPage(currentPage){
    await loadPage();
    changeMenuItemsEmphasis(currentPage);
}

/**
 * This function highlights the background of the menu item on the current page and disables its hover option.
 * 
 * @param {string} currentPage name of the current page
 */
function changeMenuItemsEmphasis(currentPage){
    document.getElementById('menuPoint' + currentPage).style.backgroundColor = '#091931';
    document.getElementById('menuItemseLegallySpan' + currentPage).classList.remove('menuItemseLegallySpan');
}

/**
 * This function clears the background highlighting of the menu item on the current page and turns its hover option back on.
 * 
 * @param {string} currentPage name of the current page
 */
function changeBackMenuItemsEmphasis(notCurrentPage){
    document.getElementById('menuPoint' + notCurrentPage).style.backgroundColor = '#2A3647';
    document.getElementById('menuItemseLegallySpan' + notCurrentPage).classList.add('menuItemseLegallySpan');
}

/**
 * This function changes all menu items to default.
 */
function allMenuItemsToDefault(){
    for (let i = 0; i < menuItems.length; i++) {
        let menuItem = document.getElementById(menuItems[i]);
        changeMenuItemToDefault(menuItem);
    }
}