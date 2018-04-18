/**
 * Saves state of the sidebar. (Open / Closed)
 */
function getSidebarState(sidebarStateKey){
    switch(localStorage.getItem(sidebarStateKey)){
        case 'open':
            openSidebar();
            break;
        case 'closed' || null:
            closeSidebar();
            break;
    }
};

/**
 * Toggles the sidebar to the next state(open -> closed).
 * @param {ID of the sidebar.} sidebarId 
 */
function toggleSidebar(sidebarId, mainContentId, sidebarStateKey){
    if(document.getElementById(sidebarId).style.width == "0px")
        openSidebar(sidebarId, mainContentId, sidebarStateKey);
    else closeSidebar(sidebarId, mainContentId, sidebarStateKey);
}

function openSidebar(sidebarId, mainContentId, sidebarStateKey){
    document.getElementById(sidebarId).style.width = "250px";
    document.getElementById(mainContentId).style.marginLeft = "250px";
    localStorage.setItem(sidebarStateKey, "open");
}

function closeSidebar(sidebarId, mainContentId, sidebarStateKey){
    document.getElementById(sidebarId).style.width = "0";
    document.getElementById(mainContentId).style.marginLeft = "0";
    localStorage.setItem(sidebarStateKey, "closed");
}
