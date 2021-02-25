import {savePreset, ActiveEdit, ActiveEditChanges, WindowTable} from "../util";

// todo: update from window's existing size, auto-center, send existing preset to editor
export class EditPane extends Component<EditPaneProps> {
	render() {
		const presets = this.props.presets;
		const activeTag = this.props.activeEdit.presetTag;
		let isExistingTag = false;

		if (presets && activeTag) {
			isExistingTag = activeTag in presets;

			if (isExistingTag) {
				const a = presets[activeTag];
			}
		}

		return (
			<div>
				<div>
					<InputField
						type="text"
						onInput={(value) => {
							if (value === "") {
								this.props.modifyActive({
									activePreset: null
								});
							} else {
								this.props.modifyActive({
									activePreset: value
								});
							}
						}}
						id="editPresetTag"
						intialValue={this.props.activeEdit.presetTag ?? ""}
					>
						Preset Tag
					</InputField>
					<InputField
						type="number"
						onInput={(value) => {
							const num = Number(value);
							if (value && num) this.props.modifyActive({offsetX: num});
						}}
						id="editOffsetX"
						intialValue={this.props.activeEdit.offsetX?.toString()}
					>
						Offset X
					</InputField>
					<InputField
						type="number"
						onInput={(value) => {
							const num = Number(value);
							if (value && num) this.props.modifyActive({offsetY: num});
						}}
						id="editOffsetY"
						intialValue={this.props.activeEdit.offsetY?.toString()}
					>
						Offset Y
					</InputField>
					<InputField
						type="number"
						onInput={(value) => {
							const num = Number(value);
							if (value && num) this.props.modifyActive({width: num});
						}}
						id="editWidth"
						intialValue={this.props.activeEdit.width?.toString()}
					>
						Width
					</InputField>
					<InputField
						type="number"
						onInput={(value) => {
							const num = Number(value);
							if (value && num) this.props.modifyActive({height: num});
						}}
						id="editHeight"
						intialValue={this.props.activeEdit.height?.toString()}
					>
						Height
					</InputField>
				</div>
				<button>Auto Center</button>
				<button
					onClick={() => {
						const activeEdit = this.props.activeEdit;

						// Only save a preset if there's a tag to begin with.
						if (activeEdit.presetTag) {
							savePreset(
								activeEdit.presetTag,
								activeEdit.offsetX,
								activeEdit.offsetY,
								activeEdit.width,
								activeEdit.height
							);
						}
					}}
				>
					{isExistingTag ? "Save Preset" : "Create New Preset"}
				</button>
			</div>
		);
	}
}

type EditPaneProps = {
	presets: WindowTable | null;
	activeEdit: ActiveEdit;
	modifyActive: (changes: ActiveEditChanges) => void;
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
					value={this.props.intialValue}
				></input>
			</div>
		);
	}
}

type InputFieldProps = {
	type: string;
	id: string;
	intialValue?: string;
	onInput: (value: string | null) => void;
};
