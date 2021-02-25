import {ButtonListPane} from "./list";
import {EditPane} from "./edit";
import {table, hookTableUpdates, ActiveEdit, WindowTable, OptionalNumber, Dimensions} from "../util";

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

	componentDidMount() {
		table.then((loadedTable) => {
			this.setState({
				presets: loadedTable
			});
		});

		hookTableUpdates((updatedTable) => {
			this.setState({
				presets: updatedTable
			});
		});

		// this is probably the better way to hook into events
		//browser.storage.onChanged.addListener(console.log);
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
		return <button onClick={this.props.onActivate}>Toggle Edit Mode</button>;
	}
}

type ModeProps = {
	onActivate: () => void;
};

function resolveChangedNumber(newValue: number | null | undefined, oldValue: OptionalNumber) {
	// If newValue was skipped, just go to oldValue.
	if (newValue === undefined) return oldValue;
	// If newValue is null, explicitly empty the value.
	else if (newValue === null) return undefined;
	// Otherwise, get newValue itself.
	else return newValue;
}
