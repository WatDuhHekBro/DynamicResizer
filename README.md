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
