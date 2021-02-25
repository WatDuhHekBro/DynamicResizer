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
						tag={presetTag}
						dimensions={preset}
						inEditMode={this.props.inEditMode}
						isActive={presetTag === this.props.activeEdit.presetTag}
						callEditMode={() => {
							this.props.setActivePreset(
								this.props.activeEdit.presetTag === presetTag ? null : presetTag
							);
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
};

class Item extends Component<ItemProps> {
	render() {
		const inEditMode = this.props.inEditMode;

		return (
			<li>
				{inEditMode && <button onClick={() => console.log("todo reorder")}>≡</button>}
				{inEditMode ? (
					<button onClick={this.props.callEditMode}>{`${this.props.children as string} ${
						this.props.isActive ? "✏️" : "🔧"
					}`}</button>
				) : (
					<button onClick={() => resize(this.props.dimensions)}>{this.props.children}</button>
				)}

				{inEditMode && <button onClick={() => deletePreset(this.props.tag)}>❌</button>}
			</li>
		);
	}
}

type ItemProps = {
	tag: string;
	dimensions: Dimensions;
	inEditMode: boolean;
	isActive: boolean;
	callEditMode: () => void;
};
