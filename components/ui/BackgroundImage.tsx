import styles from "../../styles/ui/BackgroundImage.module.scss";

import { Variables } from "../../../variables";
import { IBackgroundImage, LANGUAGE } from "../../interfaces";
import { useContext } from "react";
import { LanguageContext } from "../../contexts/languageContext";

interface IBackgroundImageProps {
	image: IBackgroundImage,
}

function getBackGroundImage(bgimg: IBackgroundImage): string {
	const { language, } = useContext(LanguageContext);

	switch (language) {
		case LANGUAGE.FRENCH: {
			return bgimg.french ? bgimg.french : bgimg.default;
		}
		case LANGUAGE.DUTCH: {
			return bgimg.dutch ? bgimg.dutch : bgimg.default;
		}
		case LANGUAGE.ENGLISH: {
			return bgimg.english ? bgimg.english : bgimg.default;
		}
		default: return bgimg.default;
	}
}

export default function BackgroundImage(props: IBackgroundImageProps): JSX.Element {
	const { image, } = props;

	return (
		<img src={getBackGroundImage(image)} className={styles.main} style={{ width: Variables.WIDTH, height: Variables.HEIGHT, }}/>
	);
}
