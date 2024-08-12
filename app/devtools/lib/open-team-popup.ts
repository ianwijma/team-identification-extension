export const openTeamPopup = (teamId: string) => {
    chrome.action.setPopup({ popup: `popup.html?teamId=${teamId}` });
    chrome.action.openPopup();
}