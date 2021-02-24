export class ButtonListPane extends Component {
	render() {
		return (
			<ul>
				{[1, 2, 3, 7].map((value, index) => (
					<Item index={index}>{value}</Item>
				))}
			</ul>
		);
	}
}

class Item extends Component<ItemProps> {
	render() {
		return (
			<li>
				<button>≡</button>
				<button onClick={() => console.log(this.props.index)}>{this.props.children}</button>
				<button>❌</button>
			</li>
		);
	}
}

type ItemProps = {
	index: number;
};
