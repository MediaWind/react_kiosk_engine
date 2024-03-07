import { CSSProperties, useEffect, useState } from "react";

import classes from "../../../styles/inputs/AdvancedButton.module.scss";
import animation from "../../../styles/inputs/AdvancedButtonAnimation.module.scss";

import { Variables } from "../../../../variables";

import { IAdvancedButtonConfig } from "../../../interfaces";

import { useLanguageContext } from "../../../contexts/languageContext";

interface IAdvancedButtonProps {
	onClick: CallableFunction
	config: IAdvancedButtonConfig
	styles: CSSProperties
}

export default function AdvancedButton(props: IAdvancedButtonProps): JSX.Element {
	const { onClick, config, styles, } = props;
	const { language, } = useLanguageContext();

	const [pressed, setPressed] = useState<boolean>(false);
	const [label, setLabel] = useState<string>("");
	const [animationClass, setAnimationClass] = useState<string>(animation.none);

	useEffect(() => {
		if (pressed) {
			if (config.pressed && config.pressed.label) {
				setLabel(config.pressed.label[language ?? "fr"]);
			}
		} else {
			if (config.label) {
				setLabel(config.label[language ?? "fr"]);
			}
		}
	}, [pressed, language]);

	useEffect(() => {
		if (config.pressed?.animation) {
			if (pressed) {
				//TODO: switch between animation types
			} else {
				//TODO: switch between animation types
			}
		} else {
			setAnimationClass(animation.none);
		}
	}, [pressed]);

	function clickDownHandler() {
		setPressed(true);
	}

	function clickUpHandler() {
		setPressed(false);
		onClick();
	}

	function devClickDown() {
		if (Variables.PREVIEW) {
			clickDownHandler();
		}
	}

	function devClickUp() {
		if (Variables.PREVIEW) {
			clickUpHandler();
		}
	}

	return (
		<div
			onTouchStart={clickDownHandler}
			onTouchEnd={clickUpHandler}
			onMouseDown={devClickDown}
			onMouseUp={devClickUp}
			className={`${classes.main} ${animationClass}`}
			style={{
				position: "absolute",
				zIndex: 1,
				backgroundImage: `url(${(pressed && config.pressed) ? config.pressed.backgroundImage.default : config.backgroundImage.default})`,
				backgroundPosition: "center center",
				backgroundRepeat: "no-repeat",
				backgroundSize: "100% 100%",
				...styles,
			}}
		>
			<p style={{
				fontFamily: styles.fontFamily,
				fontSize: styles.fontSize,
				color: styles.color,
				textAlign: styles.textAlign,
			}}>
				{label}
			</p>
		</div>
	);
}
