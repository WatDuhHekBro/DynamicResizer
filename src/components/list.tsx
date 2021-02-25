import React, {Component} from "react";
import {ReactSortable} from "react-sortablejs";
import {resize, deletePreset, WindowTable, Dimensions, ActiveEdit} from "../util";

// todo: order of entries, move function
export class ButtonListPane extends Component<ButtonListPaneProps> {
	render() {
		const presets = this.props.presets;

		if (presets) {
			const items: JSX.Element[] = [];

			for (const presetTag in presets) {
				const preset = presets[presetTag];
				items.push(
					<Item
						dimensions={preset}
						inEditMode={this.props.inEditMode}
						isActive={presetTag === this.props.activeEdit.presetTag}
						callEditMode={() =>
							// Bring an existing preset into the editor, communicated via main (<App/>).
							this.props.setActivePreset(this.props.activeEdit.presetTag === presetTag ? null : presetTag)
						}
						callDelete={() => {
							// Delete the specified preset from storage and clear fields if the user is editing said preset.
							deletePreset(presetTag);
							if (this.props.activeEdit.presetTag === presetTag) this.props.resetFields();
						}}
					>
						{presetTag}
					</Item>
				);
			}

			return <ul>{items}</ul>;
		} else {
			return <h1>Loading Presets...</h1>;
		}
	}
}

type ButtonListPaneProps = {
	presets: WindowTable | null;
	inEditMode: boolean;
	activeEdit: ActiveEdit;
	setActivePreset: (newActiveTag: string | null) => void;
	resetFields: () => void;
};

class Item extends Component<ItemProps> {
	render() {
		const inEditMode = this.props.inEditMode;

		return (
			<li draggable={true}>
				{inEditMode && <button onClick={() => console.log("todo reorder")}>≡</button>}
				{inEditMode ? (
					<button onClick={this.props.callEditMode}>{`${this.props.children} ${
						this.props.isActive ? "✏️" : "🔧"
					}`}</button>
				) : (
					<button onClick={() => resize(this.props.dimensions)}>{this.props.children}</button>
				)}
				{inEditMode && <button onClick={this.props.callDelete}>❌</button>}
			</li>
		);
	}
}

type ItemProps = {
	dimensions: Dimensions;
	inEditMode: boolean;
	isActive: boolean;
	callEditMode: () => void;
	callDelete: () => void;
};
