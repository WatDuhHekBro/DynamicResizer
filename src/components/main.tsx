import {ButtonListPane} from "./list";
import {EditPane} from "./edit";

// Extension popups don't allow inline JavaScript, so onclick is useless in the document.
// Luckily, React generates these buttons dynamically.
export class App extends Component<{}, AppState> {
	constructor(props: {}) {
		super(props);
		this.state = {
			inEditMode: false
		};
	}

	render() {
		return (
			<React.Fragment>
				<ModeButton onActivate={() => this.setState({inEditMode: !this.state.inEditMode})}></ModeButton>
				<ButtonListPane inEditMode={this.state.inEditMode}></ButtonListPane>
				{this.state.inEditMode && <EditPane></EditPane>}
			</React.Fragment>
		);
	}
}

type AppState = {
	inEditMode: boolean;
};

class ModeButton extends Component<ModeProps> {
	render() {
		return <button onClick={this.props.onActivate}>Toggle Edit Mode</button>;
	}
}

type ModeProps = {
	onActivate: () => void;
};
