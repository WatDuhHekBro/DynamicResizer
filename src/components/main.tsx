import {ButtonListPane} from "./list";
import {EditPane} from "./edit";
import {USER_NAMESPACE_PREFIX, ActiveEdit, WindowTable, OptionalNumber} from "../util";

// Extension popups don't allow inline JavaScript, so onclick is useless in the document.
// Luckily, React generates these buttons dynamically.
export class App extends Component<{}, AppState> {
	constructor(props: {}) {
		super(props);
		this.state = {
			inEditMode: false,
			presets: null,
			presetTag: null,
			offsetX: undefined,
			offsetY: undefined,
			width: undefined,
			height: undefined
		};
	}

	// There shouldn't need to be any data validation since it's just my own data.
	componentDidMount() {
		browser.storage.local.get().then((loadedTable) => {
			const transformedTable: WindowTable = {};

			for (const tag in loadedTable) {
				if (tag.startsWith(USER_NAMESPACE_PREFIX)) {
					const presetTag = tag.substring(USER_NAMESPACE_PREFIX.length);
					transformedTable[presetTag] = loadedTable[tag];
				}
			}

			this.setState({
				presets: transformedTable
			});
		});

		// Synchronize any changes from the storage API into the app state.
		browser.storage.onChanged.addListener((changes) => {
			if (this.state.presets) {
				for (const tag in changes) {
					if (tag.startsWith(USER_NAMESPACE_PREFIX)) {
						const {oldValue, newValue} = changes[tag];
						const presetTag = tag.substring(USER_NAMESPACE_PREFIX.length);

						// If an item is deleted, use the delete keyword.
						// Otherwise, just set the value as normal.
						if (oldValue !== undefined && newValue === undefined) {
							const newPresets: WindowTable = {...this.state.presets};
							delete newPresets[presetTag];
							this.setState({
								presets: newPresets
							});
						} else {
							this.setState({
								presets: {
									...this.state.presets,
									[presetTag]: newValue
								}
							});
						}
					} else {
						switch (tag) {
							case "order":
								console.log('"I will have order!" - pls buff', changes[tag]);
								break;
							default:
								console.warn(`Unknown Tag: "${tag}"`);
								break;
						}
					}
				}
			}

			browser.storage.local.get().then((res) => {
				console.log("ORIGIN", res);
				console.log("REROUT", this.state.presets);
			});
		});
	}

	// Take a new tag specified from either the edit panel or the list and check if it exists in storage.
	// - If it exists, load the dimensions from storage.
	// - If it doesn't exist, clear out any existing text.
	loadDimensionsFromNewTagIfExists(newActiveTag: string | null) {
		const presets = this.state.presets;

		this.setState({
			presetTag: newActiveTag
		});

		if (newActiveTag && presets && newActiveTag in presets) {
			const preset = presets[newActiveTag];

			this.setState({
				offsetX: preset[0],
				offsetY: preset[1],
				width: preset[2],
				height: preset[3]
			});
		} else {
			this.setState({
				offsetX: undefined,
				offsetY: undefined,
				width: undefined,
				height: undefined
			});
		}
	}

	render() {
		const activeEdit: ActiveEdit = {
			presetTag: this.state.presetTag,
			offsetX: this.state.offsetX,
			offsetY: this.state.offsetY,
			width: this.state.width,
			height: this.state.height
		};

		return (
			<React.Fragment>
				<ModeButton
					onActivate={() =>
						// This is here to reset all fields when toggling edit mode on and off.
						this.setState({
							inEditMode: !this.state.inEditMode,
							presetTag: null,
							offsetX: undefined,
							offsetY: undefined,
							width: undefined,
							height: undefined
						})
					}
					inEditMode={this.state.inEditMode}
				></ModeButton>
				<ButtonListPane
					presets={this.state.presets}
					activeEdit={activeEdit}
					inEditMode={this.state.inEditMode}
					setActivePreset={(newActiveTag) =>
						// This is called whenever a user brings over an existing preset to edit it (from the list).
						this.loadDimensionsFromNewTagIfExists(newActiveTag)
					}
					resetFields={() => {
						// This should only be called if you delete an entry that you're editing. It'll reset all fields if so.
						this.setState({
							presetTag: null,
							offsetX: undefined,
							offsetY: undefined,
							width: undefined,
							height: undefined
						});
					}}
				></ButtonListPane>
				{this.state.inEditMode && (
					<EditPane
						presets={this.state.presets}
						activeEdit={activeEdit}
						modifyActive={(changes) => {
							// If activePreset is undefined, just skip it because that means the dimensions are being modified.
							// Otherwise, ignore any other changes and pull from the active preset specified (if it exists).
							if (changes.activePreset === undefined) {
								this.setState({
									offsetX: resolveChangedNumber(changes.offsetX, activeEdit.offsetX),
									offsetY: resolveChangedNumber(changes.offsetY, activeEdit.offsetY),
									width: resolveChangedNumber(changes.width, activeEdit.width),
									height: resolveChangedNumber(changes.height, activeEdit.height)
								});
							} else {
								this.loadDimensionsFromNewTagIfExists(changes.activePreset);
							}
						}}
					></EditPane>
				)}
			</React.Fragment>
		);
	}
}

type AppState = {
	inEditMode: boolean;
	presets: WindowTable | null;
} & ActiveEdit;

class ModeButton extends Component<ModeProps> {
	render() {
		return (
			<button onClick={this.props.onActivate}>{this.props.inEditMode ? "Disable" : "Enable"} Edit Mode</button>
		);
	}
}

type ModeProps = {
	onActivate: () => void;
	inEditMode: boolean;
};

function resolveChangedNumber(newValue: number | null | undefined, oldValue: OptionalNumber) {
	// If newValue was skipped, just go to oldValue.
	if (newValue === undefined) return oldValue;
	// If newValue is null, explicitly empty the value.
	else if (newValue === null) return undefined;
	// Otherwise, get newValue itself.
	else return newValue;
}
