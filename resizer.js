// This is the core operation that resizes windows.
// Also, for whatever reason, you have to have a background page even if it's completely empty. Otherwise, you won't have access to the "chrome" variable.
function resize(width, height, offsetX, offsetY)
{
	chrome.windows.getCurrent(win => {
		chrome.windows.update(win.id, {
			top: offsetY,
			left: offsetX,
			width: width,
			height: height
		});
	});
}

// Extension popups don't allow inline JavaScript, so onclick is useless in the document.
const eventTable = {
	youtube: [512, 448, 650, 345],
	crunchyroll: [692, 498, 535, 310]
};

for(const id in eventTable)
{
	const element = document.getElementById(id);
	const args = eventTable[id];
	element.onclick = () => resize(...args);
}