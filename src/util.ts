export const USER_NAMESPACE_PREFIX = "user:";

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
		[USER_NAMESPACE_PREFIX + presetTag]: preset
	});
	resize(preset);
}

export function deletePreset(presetTag: string) {
	browser.storage.local.remove(USER_NAMESPACE_PREFIX + presetTag);
}

export type OptionalNumber = number | undefined;
// [offsetX, offsetY, width, height]
export type Dimensions = [OptionalNumber, OptionalNumber, OptionalNumber, OptionalNumber];
export type WindowTable = {[preset: string]: Dimensions};

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
