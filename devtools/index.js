const addNetworkListener = async () => {
	const handlePage = (redirect) => {
		console.log('page', { redirect });
	};
	const handleNetwork = (event) => {
		const { request = {} } = event;
		const { url = '', method = '', headers = [] } = request;

		const filterHeader = ({ name }) =>
			name === 'x-team-identification-extension';
		const [wantedHeader = {}] = headers.filter(filterHeader);
		const { value: team = '' } = wantedHeader;

		console.log('network', { url, method, team });
	};

	chrome.devtools.network.onNavigated.addListener(handlePage);
	chrome.devtools.network.onRequestFinished.addListener(handleNetwork);
};

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

	await addNetworkListener();
	await addNetworkPanel();
};

main();
