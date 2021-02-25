# dynamic-resizer
A simple window resizer with customizable presets and a responsive control panel.

## Features
- In the control panel, you can leave any field blank to avoid having that property changed when activating a preset. For example, if you just want to change the width and height, leave the position fields blank.
- There's an option to calculate the auto-centered position based on the size.
- The control panel will automatically capture the current dimensions of the window as you open it up.

## Developing
The configuration is absolutely overkill for this small of a project, but the commands ended up being relatively simple to use.
- `npm install` to install necessary dependencies
- `npm start` to begin watching changes
- `npm run build` to build a zip of the extension
- `npm run sign` to build and upload a signed Firefox xpi that you can install for personal use

### Storage Format
Each user-defined entry as used by the app will have a certain prefix to avoid namespace conflicts. This prefix will immediately be removed as the data from storage goes into the application.
- `"user:<tag>": [offsetX, offsetY, width, height]` will keep track of user-defined presets. For example, a tag of `test` will create a storage entry of `user:test`. The dimensions are in a 4-element tuple of either type `number` or `undefined` (which ignores that entry when resizing).
- `"order": [User-Defined Tags]` will keep track of the order of tags the user specifies. Its value is an array of strings.
