import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUp } from "@fortawesome/pro-regular-svg-icons";
import { faDeleteLeft } from "@fortawesome/pro-solid-svg-icons";
import { faCircle } from "@fortawesome/pro-solid-svg-icons";
import { faArrowTurnDownLeft } from "@fortawesome/pro-solid-svg-icons";

import styles from "../../../styles/CustomKeyboard.module.scss";

import { IKeyStyling, KEY_ACTION } from "./CustomKeyboard";
import { Variables } from "../../../../variables";
import { useState } from "react";

interface IKeyProps {
	text?: {
		defaultValue: string
		capslockValue?: string
		specCharsValue?: string
	}
	style?: IKeyStyling
	action?: KEY_ACTION | CallableFunction
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

	const [pressed, setPressed] = useState<boolean>(false);

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
		if (Variables.PREVIEW) {
			changetexthandler();
		}
	}

	const displaySpecCharsHandler = () => {
		if (onDisplaySpecChars) {
			onDisplaySpecChars();
		}
	};

	function displaySpecCharsHandlerDev() {
		if (Variables.PREVIEW) {
			displaySpecCharsHandler();
		}
	}

	if (action) {
		if (action === KEY_ACTION.SHIFT) {
			const shiftClickHandler = () => {
				if (onShiftToggle) {
					onShiftToggle();
				}
			};

			const devClick = () => {
				if (Variables.PREVIEW) {
					shiftClickHandler();
				}
			};

			return (
				<div
					className={`${styles.key_action} ${pressed ? styles.pressed : ""}`}
					onClick={devClick}
					onMouseDown={() => setPressed(true)}
					onMouseUp={() => setPressed(false)}
					onTouchStart={() => setPressed(true)}
					onTouchEnd={() => {
						shiftClickHandler();
						setPressed(false);
					}}
				>
					{text ? text.defaultValue : <FontAwesomeIcon icon={faUp} style={{ color: "#999999", fontSize: "0.03rem", }} />}
					<FontAwesomeIcon icon={faCircle} style={{ color: capslock ? "#00dd00" : "#999999", fontSize: "0.01rem", marginTop: "0.004rem", }} />
				</div>
			);
		}

		if (action === KEY_ACTION.SPECIALCHARS) {
			return (
				<div
					className={`${styles.key_action} ${pressed ? styles.pressed : ""}`}
					onClick={displaySpecCharsHandlerDev}
					onMouseDown={() => setPressed(true)}
					onMouseUp={() => setPressed(false)}
					onTouchStart={() => setPressed(true)}
					onTouchEnd={() => {
						displaySpecCharsHandler();
						setPressed(false);
					}}
				>
					<p>{text ? text.defaultValue : "#+="}</p>
					<FontAwesomeIcon icon={faCircle} style={{ color: specChars ? "#00dd00" : "#999999", fontSize: "0.01rem", marginTop: "0.004rem", }} />
				</div>
			);
		}

		if (action === KEY_ACTION.SPACEBAR) {
			return (
				<div
					className={`${styles.key_spacebar} ${pressed ? styles.pressed : ""}`}
					onClick={() => Variables.PREVIEW ? onChangeText(" ") : ""}
					onMouseDown={() => setPressed(true)}
					onMouseUp={() => setPressed(false)}
					onTouchStart={() => setPressed(true)}
					onTouchEnd={() => {
						onChangeText(" ");
						setPressed(false);
					}}
				>
					<p>{text ? text.defaultValue : "Space"}</p>
				</div>
			);
		}

		if (action === KEY_ACTION.ENTER) {
			return (
				<div
					className={`${styles.key_action} ${pressed ? styles.pressed : ""}`}
					onClick={() => Variables.PREVIEW ? onChangeText("\n") : ""}
					onMouseDown={() => setPressed(true)}
					onMouseUp={() => setPressed(false)}
					onTouchStart={() => setPressed(true)}
					onTouchEnd={() => {
						onChangeText("\n");
						setPressed(false);
					}}
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

		if (action === KEY_ACTION.BACKSPACE) {
			return (
				<div
					className={`${styles.key_action} ${pressed ? styles.pressed : ""}`}
					onClick={() => {
						if (Variables.PREVIEW) {
							if (onDeleteText) {
								onDeleteText();
							}
						}
					}}
					onMouseDown={() => setPressed(true)}
					onMouseUp={() => setPressed(false)}
					onTouchStart={() => setPressed(true)}
					onTouchEnd={() => {
						setPressed(false);
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
					className={`${styles.key_action} ${pressed ? styles.pressed : ""}`}
					onClick={() => Variables.PREVIEW ? action() : ""}
					onMouseDown={() => setPressed(true)}
					onMouseUp={() => setPressed(false)}
					onTouchStart={() => setPressed(true)}
					onTouchEnd={() => {
						action();
						setPressed(false);
					}}
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
			className={`${styles.key_default} ${pressed ? styles.pressed : ""}`}
			onClick={changetexthandlerDev}
			onMouseDown={() => setPressed(true)}
			onMouseUp={() => setPressed(false)}
			onTouchStart={() => setPressed(true)}
			onTouchEnd={() => {
				changetexthandler();
				setPressed(false);
			}}
		>
			<p>
				{displayedText}
			</p>
		</div>
	);
}
