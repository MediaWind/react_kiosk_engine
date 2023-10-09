import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/pro-solid-svg-icons";

import styles from "../../../styles/CustomKeyboard.module.scss";

import Key from "./Key";

interface ISpecialCharsBoxProps {
	chars: string[]
	visible?: boolean
	onAddChar: CallableFunction
	onClose: CallableFunction
}

export default function SpecialCharsBox(props: ISpecialCharsBoxProps): JSX.Element {
	const {
		chars,
		visible,
		onAddChar,
		onClose,
	} = props;

	const closeBoxHandler = () => {
		onClose();
	};

	const changeTextHandler = (char: string) => {
		onAddChar(char);
		onClose();
	};

	return (
		<div
			className={styles.spec_char_box}
			style={{ display: visible ? "flex" : "none", }}
		>
			<div>
				<FontAwesomeIcon id={styles.spec_chars_xmark} icon={faCircleXmark} onClick={closeBoxHandler} />
				{chars.map((char, index) => {
					return (
						<Key
							key={char + index}
							text={{defaultValue: char,}}
							onChangeText={changeTextHandler}
						/>
					);
				})}
			</div>
		</div>
	);
}
