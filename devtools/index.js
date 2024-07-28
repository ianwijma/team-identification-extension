const addNetworkPanel = async () => {
	chrome.devtools.panels.create(
		'Team Identification Extension',
		'',
		'devtools/network/index.html',
		function (panel) {
			console.log(panel);
		},
	);
};

const main = async () => {
	console.log('Hello Devtools!');

	await addNetworkPanel();
};

main();
