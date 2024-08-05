(() => {
	chrome.devtools.panels.create(
		'Team Identification Extension',
		'',
		'devtools.html',
		function (panel) {
			console.log(panel);
		},
	);
})()