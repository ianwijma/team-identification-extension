const px = (unit) => `${unit}px`;

const findElement = (element) => {
	if (element.getAttribute('team-identification-extension')) {
		return element;
	} else {
		const foundElement = element.closest('[team-identification-extension]');
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

	const handleClick = (event) => {
		event.preventDefault();
		console.log(
			'team',
			event.currentTarget.getAttribute('team-identification-extension'),
		);
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

	const handleChange = ({ target }) => {
		const element = findElement(target);
		element ? handleElement(element) : handleReset();
	};

	document.addEventListener('mouseover', handleChange);
};

const main = async () => {
	console.log('Hello Content!');

	await startHighlight();
};

main();
