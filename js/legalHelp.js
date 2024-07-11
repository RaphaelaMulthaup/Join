async function loadInfoPage(currentPage){
    await loadPage();
    changeMenuItemsEmphasis(currentPage);
}

function changeMenuItemsEmphasis(currentPage){
    document.getElementById('menuPoint' + currentPage).style.backgroundColor = '#091931';
    document.getElementById('menuItemseLegallySpan' + currentPage).classList.remove('menuItemseLegallySpan');
}

function changeBackMenuItemsEmphasis(notCurrentPage){
    document.getElementById('menuPoint' + notCurrentPage).style.backgroundColor = '#2A3647';
    document.getElementById('menuItemseLegallySpan' + notCurrentPage).classList.add('menuItemseLegallySpan');
}