import {table, resize, deletePreset, hookTableUpdates, WindowTable, Dimensions} from "../util";

// todo: order of entries, move function
export class ButtonListPane extends Component<ButtonListPaneProps, ButtonListPaneState> {
	constructor(props: ButtonListPaneProps) {
		super(props);
		this.state = {
			presets: null
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
		const presets = this.state.presets;

		if (presets) {
			const items: JSX.Element[] = [];

			for (const presetTag in presets) {
				const preset = presets[presetTag];
				items.push(
					<Item tag={presetTag} dimensions={preset} inEditMode={this.props.inEditMode}>
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
	inEditMode: boolean;
};

type ButtonListPaneState = {
	presets: WindowTable | null;
};

class Item extends Component<ItemProps> {
	render() {
		const inEditMode = this.props.inEditMode;

		return (
			<li>
				{inEditMode && <button onClick={() => console.log("todo reorder")}>≡</button>}
				<button onClick={() => resize(this.props.dimensions)}>{this.props.children}</button>
				{inEditMode && <button onClick={() => console.log("todo edit")}>✏️</button>}
				{inEditMode && <button onClick={() => deletePreset(this.props.tag)}>❌</button>}
			</li>
		);
	}
}

type ItemProps = {
	tag: string;
	dimensions: Dimensions;
	inEditMode: boolean;
};
