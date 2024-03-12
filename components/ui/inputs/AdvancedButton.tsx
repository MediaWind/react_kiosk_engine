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

	const [init, setInit] = useState<boolean>(true);
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
		if (init) {
			setInit(false);
			return;
		}

		if (config.pressed?.animation) {
			if (config.pressed.animation === BUTTON_ANIMATION.MOVE_DOWN) {
				setAnimationClass(pressed ? animation.move_down : animation.move_up);
			}

			if (config.pressed.animation === BUTTON_ANIMATION.EMBOSSED) {
				setAnimationClass(pressed ? animation.embossed_down : animation.embossed_up);
			}

			if (config.pressed.animation === BUTTON_ANIMATION.ROLL) {
				if (pressed) {
					setAnimationClass(animation.roll);

					setTimeout(() => {
						setAnimationClass(animation.none);
					}, 800);
				}
			}

			if (config.pressed.animation === BUTTON_ANIMATION.SHINE) {
				if (pressed) {
					setAnimationClass(animation.shine_in);

					setTimeout(() => {
						setAnimationClass(animation.none);
					}, 600);
				}
			}

			if (config.pressed.animation === BUTTON_ANIMATION.BOUNCE) {
				setAnimationClass(pressed ? animation.bounce_down : animation.bounce_up);
			}

			if (config.pressed.animation === BUTTON_ANIMATION.FLIP) {
				if (pressed) {
					setAnimationClass(animation.flip);

					setTimeout(() => {
						setAnimationClass(animation.none);
					}, 300);
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
		<>
			{config.pressed?.animation === BUTTON_ANIMATION.BOUNCE && <>
				<div
					className={`${animation.bounce_shadow} ${pressed ? animation.shadow_bounce_down : animation.shadow_bounce_up}`}
					style={{
						position: "absolute",
						zIndex: 1,
						...styles,
						backgroundImage: "none",
						backgroundColor: "#0000009f",
					}}
				></div>
			</>}

			<div
				onTouchStart={clickDownHandler}
				onTouchEnd={clickUpHandler}
				onMouseDown={devClickDown}
				onMouseUp={devClickUp}
				className={`${classes.main} ${animationClass}`}
				style={{
					position: "absolute",
					zIndex: 2,
					backgroundImage: config.backgroundImage ? `url(${(pressed && config.pressed?.backgroundImage) ? config.pressed.backgroundImage.default : config.backgroundImage.default})` : "",
					backgroundPosition: "center center",
					backgroundRepeat: "no-repeat",
					backgroundSize: "100% 100%",
					...styles,
					...(pressed && config.pressed ? config.pressed.style : ""),
				}}
			>
				<p style={{
					fontFamily: pressed && config.pressed?.style.fontFamily ? config.pressed.style.fontFamily : styles.fontFamily,
					fontSize: pressed && config.pressed?.style.fontSize ? config.pressed.style.fontSize : styles.fontSize,
					color: pressed && config.pressed?.style.color ? config.pressed.style.color : styles.color,
					textAlign: pressed && config.pressed?.style.textAlign ? config.pressed.style.textAlign : styles.textAlign,
				}}>
					{label}
				</p>

				{config.pressed?.animation === BUTTON_ANIMATION.SHINE && <>
					<div className={animation.shine1}></div>
					<div className={animation.shine1_blur}></div>
					<div className={animation.shine2}></div>
					<div className={animation.shine_shadow}></div>
				</>}
			</div>
		</>
	);
}
