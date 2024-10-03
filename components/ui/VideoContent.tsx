import { useTranslation } from "react-i18next";

import Media from "../../../core/components/Media";

import { IVideoContent } from "../../interfaces";

import getNumbersOnly from "../../utils/getNumbersOnly";

interface IVideoContentProps {
	id: string
	content: IVideoContent
}

export default function VideoContent(props: IVideoContentProps): JSX.Element {
	const { id, content, } = props;
	const { t, } = useTranslation("Media content");

	return (
		<div style={{
			position: "absolute",
			zIndex: 1,
			...content.styles,
		}}>
			<Media
				UUID={id}
				url={content.src}
				emptyUrlError={t("empty url", { what: content.name, })}
				top={getNumbersOnly(`${content.styles.top}`)}
				bottom={content.styles.bottom ? getNumbersOnly(`${content.styles.bottom}`) : 0}
				left={getNumbersOnly(`${content.styles.left}`)}
				right={content.styles.right ? getNumbersOnly(`${content.styles.right}`) : 0}
				width={content.styles.width ? getNumbersOnly(`${content.styles.width}`) : undefined}
				height={content.styles.height ? getNumbersOnly(`${content.styles.height}`) : undefined}
				muted={true}
			/>
		</div>
	);
}
