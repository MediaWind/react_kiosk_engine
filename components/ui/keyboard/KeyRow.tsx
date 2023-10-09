import styles from "../../../styles/CustomKeyboard.module.scss";

import { IKeyRow } from "./CustomKeyboard";

import Key from "./Key";

interface IKeyRowProps {
	row: IKeyRow
	onAddChars: CallableFunction
	onDeleteChars: CallableFunction
	onShiftToggle: CallableFunction
	capslock: boolean
	onDisplaySpecChars: CallableFunction
	specChars: boolean
}

export default function KeyRow(props: IKeyRowProps): JSX.Element {
	const {
		row,
		onAddChars,
		onDeleteChars,
		onShiftToggle,
		capslock,
		onDisplaySpecChars,
		specChars,
	} = props;

	const changetexthandler = (keyValue: string) => {
		onAddChars(keyValue);
	};

	const deletetexthandler = () => {
		onDeleteChars();
	};

	const toggleShiftHandler = (isOn: boolean) => {
		onShiftToggle(isOn);
	};

	const displaySpecCharsHandler = () => {
		onDisplaySpecChars();
	};

	return (
		<div className={styles.key_row}>
			{row.keys.map((key, index) => {
				return (
					<Key
						key={(key.text?.defaultValue ?? "") + index}
						text={key.text}
						style={key.style}
						action={key.action}
						onChangeText={changetexthandler}
						onDeleteText={deletetexthandler}
						onShiftToggle={toggleShiftHandler}
						capslock={capslock}
						onDisplaySpecChars={displaySpecCharsHandler}
						specChars={specChars}
					/>
				);
			})}
		</div>
	);
}
