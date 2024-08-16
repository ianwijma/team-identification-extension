const px = (unit) => `${unit}px`;

const findElement = (element, attributeName) => {
	if (element.getAttribute(attributeName)) {
		return element;
	} else {
		const foundElement = element.closest(`[${attributeName}]`);
		if (foundElement) {
			return foundElement;
		}
	}

	return null;
};

const getHighlighter = () => {
	const highlighter = document.createElement('div');

	highlighter.style.position = 'absolute';
	highlighter.style.display = 'none';
	highlighter.style.pointerEvents = 'none';
	highlighter.style.border = 'solid red 5px';
	highlighter.classList.add('team-identification-extension__highlighter');

	document.body.appendChild(highlighter);

	return {
		target: (element) => {
			const [{ width, height, top, left }] = element.getClientRects();
			highlighter.style.display = '';
			highlighter.style.left = `${left}px`;
			highlighter.style.top = `${top}px`;
			highlighter.style.width = `${width}px`;
			highlighter.style.height = `${height}px`;
			targetEl = element;
		},
		reset: () => {
			highlighter.style.display = 'none';
		},
	};
};

const startHighlight = async () => {
	const highlighter = getHighlighter();

	let currentElement = null;
	let started = false;
	let attributeName = 'team-identification-extension';

	const handleClick = (event) => {
		event.preventDefault();
		
		const teamAlias = event.currentTarget.getAttribute(attributeName);

		chrome.runtime.sendMessage({ teamAlias });
	};

	const resetElement = () => {
		if (currentElement) {
			currentElement.removeEventListener('click', handleClick);
			currentElement = null;
		}
	};

	const registerElement = (element) => {
		resetElement();

		if (!currentElement) {
			currentElement = element;
			currentElement.addEventListener('click', handleClick);
		}
	};

	const handleElement = (element) => {
		highlighter.target(element);
		registerElement(element);
	};
	const handleReset = () => {
		highlighter.reset();
		resetElement();
	};

	const isStarted = () => started;
	
	const start = (newAttributeName) => {
		attributeName = newAttributeName;
		started = true;
	};

	const stop = () => {
		handleReset();

		started = false;
	};

	const handleChange = ({ target }) => {
		if (isStarted()) {
			const element = findElement(target, attributeName);
			element ? handleElement(element) : handleReset();
		}
	};

	document.addEventListener('mouseover', handleChange);

	return { start, stop, isStarted }
};

const main = async () => {
	const highlighter =	await startHighlight();

	chrome.runtime.onMessage.addListener(function ({ type, elementPicker, attributeName }, sender, sendResponse) {
		console.log('listener', { type, elementPicker })

		if (type === 'set-picker') {
			elementPicker ? highlighter.start(attributeName) : highlighter.stop()
		}

		if (type === 'get-picker') {
			sendResponse({ elementPickerState: highlighter.isStarted() })
		}
	});
};

main();
