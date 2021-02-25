import {savePreset, OptionalNumber} from "../util";

// todo: update from window's existing size, auto-center, send existing preset to editor
export class EditPane extends Component<{}, EditPaneState> {
	constructor(props: {}) {
		super(props);
		this.state = {
			presetTag: "none",
			offsetX: undefined,
			offsetY: undefined,
			width: undefined,
			height: undefined
		};
	}

	render() {
		return (
			<div>
				<div>
					<InputField
						type="text"
						onInput={(value) => {
							if (value)
								this.setState({
									presetTag: value
								});
						}}
						id="editPresetTag"
					>
						Preset Tag
					</InputField>
					<InputField
						type="number"
						onInput={(value) => {
							const num = Number(value);
							if (value && num) this.setState({offsetX: num});
						}}
						id="editOffsetX"
					>
						Offset X
					</InputField>
					<InputField
						type="number"
						onInput={(value) => {
							const num = Number(value);
							if (value && num) this.setState({offsetY: num});
						}}
						id="editOffsetY"
					>
						Offset Y
					</InputField>
					<InputField
						type="number"
						onInput={(value) => {
							const num = Number(value);
							if (value && num) this.setState({width: num});
						}}
						id="editWidth"
					>
						Width
					</InputField>
					<InputField
						type="number"
						onInput={(value) => {
							const num = Number(value);
							if (value && num) this.setState({height: num});
						}}
						id="editHeight"
					>
						Height
					</InputField>
				</div>
				<button>Auto Center</button>
				<button
					onClick={() => {
						savePreset(
							this.state.presetTag,
							this.state.offsetX,
							this.state.offsetY,
							this.state.width,
							this.state.height
						);
					}}
				>
					Save Preset
				</button>
			</div>
		);
	}
}

type EditPaneState = {
	presetTag: string;
	offsetX: OptionalNumber;
	offsetY: OptionalNumber;
	width: OptionalNumber;
	height: OptionalNumber;
};

class InputField extends Component<InputFieldProps> {
	render() {
		return (
			<div>
				<label htmlFor={this.props.id}>{this.props.children}</label>
				<input
					type={this.props.type}
					onInput={(event) => {
						const value = event.currentTarget.value;

						// Force explicit handling of empty inputs
						if (value !== "") this.props.onInput(value);
						else this.props.onInput(null);
					}}
					id={this.props.id}
				></input>
			</div>
		);
	}
}

type InputFieldProps = {
	type: string;
	id: string;
	onInput: (value: string | null) => void;
};
