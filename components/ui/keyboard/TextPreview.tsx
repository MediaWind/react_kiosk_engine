import styles from "../../../styles/keyboard/TextPreview.module.scss";

interface ITextPreviewProps {
	text: string
}

export default function TextPreview(props: ITextPreviewProps): JSX.Element {
	const { text, } = props;

	return (
		<div className={styles.main}>
			<p>{text}</p>
		</div>
	);
}
