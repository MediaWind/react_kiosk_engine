import styles from "../../styles/ui/LoadingScreen.module.scss";

export default function LoadingScreen(): JSX.Element {
	return (
		<div className={styles.main}>
			<div className={`${styles.lds_ring}`}>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div>
		</div>
	);
}
