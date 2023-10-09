import styles from "../../styles/ui/BackgroundImage.module.scss";

interface IBackgroundImageProps {
	url: string;
}

export default function BackgroundImage(props: IBackgroundImageProps): JSX.Element {
	const { url, } = props;

	return (
		<img src={url} className={styles.main}/>
	);
}
