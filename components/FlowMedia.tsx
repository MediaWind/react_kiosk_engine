import { IImageContent, IInputAction, IInputContent, IMedia, IVideoContent, MEDIA_TYPE } from "../interfaces";

import ImageContent from "./ui/ImageContent";
import InputContent from "./ui/InputContent";
import VideoContent from "./ui/VideoContent";

interface IFlowMediaProps {
	id: string
	media: IMedia
	onActionsTrigger: CallableFunction
}

export default function FlowMedia(props: IFlowMediaProps): JSX.Element {
	const { id, media, onActionsTrigger, } = props;

	function actionsHandler(actions: IInputAction[]) {
		onActionsTrigger(actions);
	}

	if (media.type === MEDIA_TYPE.IMAGE) {
		return (
			<ImageContent id={id} content={media.content as IImageContent} />
		);
	} else if (media.type === MEDIA_TYPE.VIDEO) {
		return (
			<VideoContent id={id} content={media.content as IVideoContent} />
		);
	} else {
		return (
			<InputContent content={media.content as IInputContent} onActionsTrigger={actionsHandler} />
		);
	}
}
