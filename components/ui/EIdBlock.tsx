import { useTranslation } from "react-i18next";

import styles from "../../styles/ui/EIdBlock.module.scss";

import { IErrorManagement } from "../../interfaces";

import BackgroundImage from "./BackgroundImage";

interface IEIdBlockProps {
	customImages?: IErrorManagement
}

export default function EIdBlock(props: IEIdBlockProps): JSX.Element {
	const { customImages, } = props;
	const { t, } = useTranslation("eId");

	if (customImages?.eIdRead) {
		return (
			<div className={styles.custom_image}>
				<BackgroundImage image={customImages.eIdRead} />
			</div>
		);
	}

	return (
		<div className={styles.main}>
			<div className={styles.container}>
				<p>{t("remove card")}</p>
			</div>
		</div>
	);
}
