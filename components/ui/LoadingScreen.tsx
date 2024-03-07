import { useTranslation } from "react-i18next";

import styles from "../../styles/ui/LoadingScreen.module.scss";

import { eIdStatus } from "../../../core/hooks/useEId";

import { useEIdContext } from "../../contexts/eIdContext";

import { IErrorManagement } from "../../interfaces";

import BackgroundImage from "./BackgroundImage";

interface ILoadingScreenProps {
	customImages?: IErrorManagement
}

export default function LoadingScreen(props: ILoadingScreenProps): JSX.Element {
	const { customImages, } = props;
	const { t, } = useTranslation("eId");
	const { status, } = useEIdContext();

	if (status === eIdStatus.INSERTED && customImages?.eIdInserted) {
		return (
			<div className={styles.custom_image}>
				<BackgroundImage image={customImages.eIdInserted} />
			</div>
		);
	}

	return (
		<div className={styles.main}>
			<div className={`${styles.lds_ring}`}>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div>
			{status === eIdStatus.INSERTED && <p>{t("card inserted")}</p>}
		</div>
	);
}
