export class EditPane extends Component {
	render() {
		// replace the math.random() call to something actually useful later
		return (
			<div>
				<div>
					<NumberField></NumberField>
					<NumberField></NumberField>
					<NumberField></NumberField>
					<NumberField></NumberField>
				</div>
				<button>Auto Center</button>
				<button>{Math.random() < 0.5 ? "Create" : "Modify"}</button>
			</div>
		);
	}
}

class NumberField extends Component {
	render() {
		return (
			<div>
				<label></label>
				<input type="number"></input>
			</div>
		);
	}
}
