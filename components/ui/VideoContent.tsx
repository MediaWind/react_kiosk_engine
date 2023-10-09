import Media from "../../../core/components/Media";

import { IVideoContent } from "../../interfaces";
import getNumbersOnly from "../../utils/getNumbersOnly";

interface IVideoContentProps {
	id: string
	content: IVideoContent
}

export default function VideoContent(props: IVideoContentProps): JSX.Element {
	const { id, content, } = props;

	return (
		<Media
			UUID={id}
			url={content.src}
			emptyUrlError={`L'url renseigné pour "${content.name}" est invalide`}
			top={getNumbersOnly(content.styles.top)}
			bottom={content.styles.bottom ? getNumbersOnly(content.styles.bottom) : 0}
			left={getNumbersOnly(content.styles.left)}
			right={content.styles.right ? getNumbersOnly(content.styles.right) : 0}
			muted={true}
		/>
	);
}
