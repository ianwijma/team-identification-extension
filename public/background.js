const main = async () => {
    chrome.runtime.onMessage.addListener(function({ teamId = false }) {
        if ( teamId ) {
            chrome.action.setPopup({ popup: `popup.html?teamId=${teamId}` });
            setTimeout(() => chrome.action.openPopup(), 0);
        }
    });
}

main();