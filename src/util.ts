// This is the core operation that resizes windows.
export async function resize(width: number, height: number, offsetX: number, offsetY: number) {
	const window = await browser.windows.getCurrent();

	if (window.id) {
		// >> Updates the properties of a window. Specify only the properties that you want to change; unspecified properties will be left unchanged.
		browser.windows.update(window.id, {
			top: offsetY,
			left: offsetX,
			width: width,
			height: height
		});
	}
}

// There shouldn't need to be any data validation since it's just my own data.
export const table: Promise<WindowTable> = browser.storage.local.get();

export async function setWebsite(
	website: string,
	width: number,
	height: number,
	offsetX: number,
	offsetY: number
): Promise<SetWebsiteStatus> {
	return SetWebsiteStatus.SUCCESS;
}

type OptionalNumber = number | null;
type Dimensions = [OptionalNumber, OptionalNumber, OptionalNumber, OptionalNumber];
type WindowTable = {[website: string]: Dimensions};

enum SetWebsiteStatus {
	SUCCESS,
	FAIL
}
