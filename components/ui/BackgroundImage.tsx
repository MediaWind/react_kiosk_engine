import styles from "../../styles/ui/BackgroundImage.module.scss";

import { Variables } from "../../../variables";

import { IBackgroundImage } from "../../interfaces";

import { useLanguageContext } from "../../contexts/languageContext";

interface IBackgroundImageProps {
	image: IBackgroundImage,
}

export default function BackgroundImage(props: IBackgroundImageProps): JSX.Element {
	const { image, } = props;
	const { language, } = useLanguageContext();

	return (
		<img src={image[language] ?? image.default} className={styles.main} style={{ width: Variables.WIDTH, height: Variables.HEIGHT, }}/>
	);
}
