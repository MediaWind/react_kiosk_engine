import { CSSProperties, useEffect, useState } from "react";

import classes from "../../../styles/inputs/AdvancedButton.module.scss";
import animation from "../../../styles/inputs/AdvancedButtonAnimation.module.scss";

import { Variables } from "../../../../variables";

import { BUTTON_ANIMATION, IAdvancedButtonConfig } from "../../../interfaces";

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
			if (config.pressed.animation === BUTTON_ANIMATION.MOVE_DOWN) {
				if (pressed) {
					setAnimationClass(animation.move_down);
				} else {
					setAnimationClass(animation.move_up);
				}
			} else if (config.pressed.animation === BUTTON_ANIMATION.EMBOSSED) {
				if (pressed) {
					setAnimationClass(animation.embossed_down);
				} else {
					setAnimationClass(animation.embossed_up);
				}
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
				backgroundImage: config.backgroundImage ? `url(${(pressed && config.pressed?.backgroundImage) ? config.pressed.backgroundImage.default : config.backgroundImage.default})` : "",
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
