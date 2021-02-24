class Test extends Component {
	render() {
		return <h1>test</h1>;
	}
}

ReactDOM.render(<Test></Test>, document.getElementById("root"));

// This is the core operation that resizes windows.
// Also, for whatever reason, you have to have a background page even if it's completely empty. Otherwise, you won't have access to the "chrome" variable.
async function resize(width: number, height: number, offsetX: number, offsetY: number) {
	const window = await browser.windows.getCurrent();

	if (window.id) {
		browser.windows.update(window.id, {
			top: offsetY,
			left: offsetX,
			width: width,
			height: height
		});
	}
}

// Extension popups don't allow inline JavaScript, so onclick is useless in the document.
const eventTable: {[website: string]: [number, number, number, number]} = {
	youtube: [512, 448, 650, 345],
	crunchyroll: [692, 498, 535, 310]
};

for (const id in eventTable) {
	const element = document.getElementById(id);
	const args = eventTable[id];
	element!.onclick = () => resize(...args);
}
