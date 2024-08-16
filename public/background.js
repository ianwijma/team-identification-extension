const main = async () => {
    chrome.runtime.onMessage.addListener(function({ teamAlias = false }) {
        if ( teamAlias ) {
            chrome.action.setPopup({ popup: `popup.html?teamAlias=${teamAlias}` });
            setTimeout(() => chrome.action.openPopup(), 0);
        }
    });

    chrome.runtime.onConnect.addListener(function(port) {
        if (port.name === "popup") {
            port.onDisconnect.addListener(function() {
                chrome.action.setPopup({ popup: 'popup.html' });
            });
        }
    });
}

main();