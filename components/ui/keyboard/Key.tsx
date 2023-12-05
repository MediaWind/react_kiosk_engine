import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUp } from "@fortawesome/pro-regular-svg-icons";
import { faDeleteLeft } from "@fortawesome/pro-solid-svg-icons";
import { faCircle } from "@fortawesome/pro-solid-svg-icons";
import { faArrowTurnDownLeft } from "@fortawesome/pro-solid-svg-icons";

import styles from "../../../styles/CustomKeyboard.module.scss";

import { IKeyStyling, KeyAction } from "./CustomKeyboard";
import { Variables } from "../../../../variables";

interface IKeyProps {
	text?: {
		defaultValue: string
		capslockValue?: string
		specCharsValue?: string
	}
	style?: IKeyStyling
	action?: KeyAction | CallableFunction
	onChangeText: CallableFunction
	onDeleteText?: CallableFunction
	onShiftToggle?: CallableFunction
	capslock?: boolean
	onDisplaySpecChars?: CallableFunction
	specChars?: boolean
}

export default function Key(props: IKeyProps): JSX.Element {
	const {
		text,
		style,
		action,
		onChangeText,
		onDeleteText,
		onShiftToggle,
		capslock,
		onDisplaySpecChars,
		specChars,
	} = props;

	const changetexthandler = () => {
		if (capslock && text?.capslockValue !== undefined) {
			onChangeText(text.capslockValue);
		} else if (specChars && text?.specCharsValue !== undefined) {
			onChangeText(text.specCharsValue);
		} else {
			onChangeText(text?.defaultValue);
		}
	};

	function changetexthandlerDev() {
		if (!Variables.PREVIEW) {
			return;
		}
		changetexthandler();
	}

	const displaySpecCharsHandler = () => {
		if (onDisplaySpecChars) {
			onDisplaySpecChars();
		}
	};

	function displaySpecCharsHandlerDev() {
		if (!Variables.PREVIEW) {
			return;
		}
		displaySpecCharsHandler();
	}

	if (action) {
		if (action === KeyAction.SHIFT) {
			const shiftClickHandler = () => {
				if (onShiftToggle) {
					onShiftToggle();
				}
			};

			const devClick = () => {
				if (!Variables.PREVIEW) {
					return;
				}
				shiftClickHandler();
			};

			return (
				<div
					className={styles.key_action}
					onClick={devClick}
					onTouchEnd={shiftClickHandler}
				>
					{text ? text.defaultValue : <FontAwesomeIcon icon={faUp} style={{ color: "#999999", fontSize: "0.03rem", }} />}
					<FontAwesomeIcon icon={faCircle} style={{ color: capslock ? "#00dd00" : "#999999", fontSize: "0.01rem", marginTop: "0.004rem", }} />
				</div>
			);
		}

		if (action === KeyAction.SPECIALCHARS) {
			return (
				<div
					className={styles.key_action}
					onClick={displaySpecCharsHandlerDev}
					onTouchEnd={displaySpecCharsHandler}
				>
					<p>{text ? text.defaultValue : "#+="}</p>
					<FontAwesomeIcon icon={faCircle} style={{ color: specChars ? "#00dd00" : "#999999", fontSize: "0.01rem", marginTop: "0.004rem", }} />
				</div>
			);
		}

		if (action === KeyAction.SPACEBAR) {
			return (
				<div
					className={styles.key_spacebar}
					onClick={() => Variables.PREVIEW ? onChangeText(" ") : ""}
					onTouchEnd={() => onChangeText(" ")}
				>
					<p>{text ? text.defaultValue : "Space"}</p>
				</div>
			);
		}

		if (action === KeyAction.ENTER) {
			return (
				<div
					className={styles.key_action}
					onClick={() => Variables.PREVIEW ? onChangeText("\n") : ""}
					onTouchEnd={() => onChangeText("\n")}
					style={{
						backgroundColor: style?.backgroundColor ? style.backgroundColor : "",
						justifyContent: style?.textAlign ? style.textAlign : "",
					}}
				>
					<p
						style={{
							color: style?.textColor ? style.textColor : "",
							fontSize: style?.fontSize ? style.fontSize : "",
						}}
					>
						{text ? text.defaultValue : <FontAwesomeIcon icon={faArrowTurnDownLeft} style={{ color: "#999999", fontSize: "0.02rem", }} />}
					</p>
				</div>
			);
		}

		if (action === KeyAction.BACKSPACE) {
			return (
				<div
					className={styles.key_action}
					onClick={() => {
						if (!Variables.PREVIEW) {
							return;
						}
						if (onDeleteText) {
							onDeleteText();
						}
					}}
					onTouchEnd={() => {
						if (onDeleteText) {
							onDeleteText();
						}
					}}
				>
					{text ? text.defaultValue : <FontAwesomeIcon icon={faDeleteLeft} style={{ color: "#999999", fontSize: "0.025rem", }} />}
				</div>
			);
		}

		if (typeof action === "function") {
			let displayedText = text?.defaultValue;

			if (capslock && text?.capslockValue) {
				displayedText = text.capslockValue;
			}
			if (specChars && text?.specCharsValue) {
				displayedText = text.specCharsValue;
			}

			return (
				<div
					className={styles.key_action}
					onClick={() => Variables.PREVIEW ? action() : ""}
					onTouchEnd={() => action()}
					style={{
						backgroundColor: style?.backgroundColor ? style.backgroundColor : "",
						justifyContent: style?.textAlign ? style.textAlign : "",
					}}
				>
					<p
						style={{
							color: style?.textColor ? style.textColor : "",
							fontSize: style?.fontSize ? style.fontSize : "",
						}}
					>
						{displayedText ?? "Action"}
					</p>
				</div>
			);
		}
	}

	let displayedText = text?.defaultValue;

	if (capslock && text?.capslockValue) {
		displayedText = text.capslockValue;
	}
	if (specChars && text?.specCharsValue) {
		displayedText = text.specCharsValue;
	}

	return (
		<div
			className={styles.key_default}
			onClick={changetexthandlerDev}
			onTouchEnd={changetexthandler}
		>
			<p>
				{displayedText}
			</p>
		</div>
	);
}
