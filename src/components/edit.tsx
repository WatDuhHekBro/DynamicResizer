import React, {Component} from "react";
import {browser} from "webextension-polyfill-ts";
import {savePreset, ActiveEdit, ActiveEditChanges, WindowTable} from "../util";

export class EditPane extends Component<EditPaneProps> {
	render() {
		const presets = this.props.presets;
		const activeTag = this.props.activeEdit.presetTag;
		const isExistingTag: boolean = !!presets && !!activeTag && activeTag in presets;

		return (
			<div>
				<div>
					<InputField
						type="text"
						onInput={(value) => {
							this.props.modifyActive({
								activePreset: value
							});
						}}
						id="editPresetTag"
						intialValue={this.props.activeEdit.presetTag ?? ""}
						placeholder="This field is required."
					>
						Preset Tag
					</InputField>
					<InputField
						type="number"
						onInput={(value) => {
							const num = Number(value);
							if (value && isFinite(num)) this.props.modifyActive({offsetX: num});
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
							if (value && isFinite(num)) this.props.modifyActive({offsetY: num});
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
							if (value && isFinite(num)) this.props.modifyActive({width: num});
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
							if (value && isFinite(num)) this.props.modifyActive({height: num});
						}}
						id="editHeight"
						intialValue={this.props.activeEdit.height?.toString()}
					>
						Height
					</InputField>
				</div>
				<button
					onClick={async () => {
						const window = await browser.windows.getCurrent();
						this.props.modifyActive({
							offsetX: window.left,
							offsetY: window.top,
							width: window.width,
							height: window.height
						});
					}}
				>
					Use Current Window
				</button>
				<button
					onClick={() => {
						const activeEdit = this.props.activeEdit;
						let offsetX = undefined;
						let offsetY = undefined;

						if (activeEdit.width !== undefined) offsetX = Math.floor((screen.width - activeEdit.width) / 2);
						if (activeEdit.height !== undefined)
							offsetY = Math.floor((screen.height - activeEdit.height) / 2);

						// Apparently, I need to group up these calls into one or else it won't work.
						this.props.modifyActive({
							offsetX,
							offsetY
						});
					}}
				>
					Auto Center
				</button>
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
		// If value is undefined, it'll keep around stale input. That's what the empty string is for.
		return (
			<div>
				<label htmlFor={this.props.id}>{this.props.children}</label>
				<input
					type={this.props.type}
					onInput={(event) => {
						const value = event.currentTarget.value;

						// Force explicit handling of empty inputs by treating null as an empty string.
						if (value !== "") this.props.onInput(value);
						else this.props.onInput(null);
					}}
					id={this.props.id}
					value={this.props.intialValue ?? ""}
					placeholder={this.props.placeholder}
				></input>
			</div>
		);
	}
}

type InputFieldProps = {
	type: string;
	id: string;
	intialValue?: string;
	placeholder?: string;
	onInput: (value: string | null) => void;
};
