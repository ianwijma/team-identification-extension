const tableBody = document.getElementById('network-table');

let rowCount = 0;

const resetBody = () => {
	tableBody.innerHTML = '';
	rowCount = 0;
};

const addPage = ({ redirect }) => {
	const row = document.createElement('tr');
	row.style.background = 'gray';

	const column = document.createElement('td');
	column.colSpan = 3;
	column.textContent = `Redirect: ${redirect}`;

	row.appendChild(column);
	tableBody.prepend(row);
};

const addNetwork = ({ url, method, team }) => {
	const urlObj = new URL(url);

	const row = document.createElement('tr');
	row.style.background = rowCount % 2 === 0 ? 'lightgray' : '';

	const pathElement = document.createElement('td');
	pathElement.textContent = String(urlObj.pathname);
	row.appendChild(pathElement);

	const methodElement = document.createElement('td');
	methodElement.textContent = String(method);
	row.appendChild(methodElement);

	const teamElement = document.createElement('td');
	teamElement.textContent = String(team);
	row.appendChild(teamElement);

	tableBody.prepend(row);
	rowCount++;
};

const addNetworkListener = async () => {
	const handlePage = (redirect) => {
		console.log('page', { redirect });
		// addPage({ redirect });
		resetBody();
	};
	const handleNetwork = (event) => {
		const { request = {} } = event;
		const { url = '', method = '', headers = [] } = request;

		const filterHeader = ({ name }) =>
			name === 'x-team-identification-extension';
		const [wantedHeader = {}] = headers.filter(filterHeader);
		const { value: team = '' } = wantedHeader;

		console.log('network', { url, method, team });
		addNetwork({ url, method, team });
	};

	chrome.devtools.network.onNavigated.addListener(handlePage);
	chrome.devtools.network.onRequestFinished.addListener(handleNetwork);
};

const main = async () => {
	console.log('Hello Network!');

	await addNetworkListener();
};

main();
