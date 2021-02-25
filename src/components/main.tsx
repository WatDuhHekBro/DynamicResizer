import {ButtonListPane} from "./list";
import {EditPane} from "./edit";
import {table, hookTableUpdates, ActiveEdit, WindowTable} from "../util";

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
					setActivePreset={(newActiveTag) => {
						this.setState({
							presetTag: newActiveTag
						});

						// ERROR: Numbers are stuck, also only height seems to be saved
						if (newActiveTag && this.state.presets && newActiveTag in this.state.presets) {
							const preset = this.state.presets[newActiveTag];

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
					}}
				></ButtonListPane>
				{this.state.inEditMode && (
					<EditPane
						presets={this.state.presets}
						activeEdit={activeEdit}
						modifyActive={(changes) => {
							this.setState({
								presetTag:
									changes.activePreset !== undefined ? changes.activePreset : activeEdit.presetTag,
								offsetX: changes.offsetX,
								offsetY: changes.offsetY,
								width: changes.width,
								height: changes.height
							});
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
