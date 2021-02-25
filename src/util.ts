// There shouldn't need to be any data validation since it's just my own data.
export const table: Promise<WindowTable> = browser.storage.local.get();
const hooks: TableHook[] = [];

// This is the core operation that resizes windows.
export async function resize(preset: Dimensions) {
	const window = await browser.windows.getCurrent();

	if (window.id) {
		browser.windows.update(window.id, {
			left: preset[0],
			top: preset[1],
			width: preset[2],
			height: preset[3]
		});
	}

	// only if window.state === "normal" should the control panel capture the window size
	//console.log(window.left, window.top, window.width, window.height, window.state === "normal");
}

export function savePreset(
	presetTag: string,
	offsetX: OptionalNumber,
	offsetY: OptionalNumber,
	width: OptionalNumber,
	height: OptionalNumber
) {
	const preset: Dimensions = [offsetX, offsetY, width, height];
	browser.storage.local.set({
		[presetTag]: preset
	});
	table.then((loadedTable) => {
		loadedTable[presetTag] = preset;
		callTableUpdate(loadedTable);
	});
}

export function deletePreset(presetTag: string) {
	browser.storage.local.remove(presetTag);
	table.then((loadedTable) => {
		delete loadedTable[presetTag];
		callTableUpdate(loadedTable);
	});
}

export function hookTableUpdates(callback: TableHook) {
	hooks.push(callback);
}

function callTableUpdate(updatedTable: WindowTable) {
	for (const callback of hooks) {
		callback(updatedTable);
	}
}

export type OptionalNumber = number | undefined;
// [offsetX, offsetY, width, height]
export type Dimensions = [OptionalNumber, OptionalNumber, OptionalNumber, OptionalNumber];
export type WindowTable = {[preset: string]: Dimensions};
type TableHook = (updatedTable: WindowTable) => void;

export type ActiveEdit = {
	presetTag: string | null;
	offsetX: OptionalNumber;
	offsetY: OptionalNumber;
	width: OptionalNumber;
	height: OptionalNumber;
};

// In this case, undefined means to skip that property while null means to empty that property.
export type ActiveEditChanges = {
	activePreset?: string | null;
	offsetX?: number | null;
	offsetY?: number | null;
	width?: number | null;
	height?: number | null;
};
