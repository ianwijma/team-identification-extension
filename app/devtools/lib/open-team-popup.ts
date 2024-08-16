import { TeamAlias } from "../../lib/extension-settings";

export const openTeamPopup = (teamAlias: TeamAlias) => {
    chrome.action.setPopup({ popup: `popup.html?teamAlias=${teamAlias}` });
    chrome.action.openPopup();
}