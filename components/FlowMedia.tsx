import { IImageContent, IInputAction, IInputAreaContent, IInputContent, IMedia, IVideoContent, MEDIA_TYPE } from "../interfaces";

import ImageContent from "./ui/ImageContent";
import InputContent from "./ui/InputContent";
import VideoContent from "./ui/VideoContent";
import InputAreaContent from "./ui/InputAreaContent";
import { useEffect } from "react";

interface IFlowMediaProps {
	id: string
	media: IMedia
	onActionsTrigger: CallableFunction
}

export default function FlowMedia(props: IFlowMediaProps): JSX.Element {
	const { id, media, onActionsTrigger, } = props;

	useEffect(() => {
		// Remove media element if they are generated outside the classic flow
		return () => {
			const element = document.getElementById(id);
			if (element) {
				element.remove();
			}
		};
	},[]);

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
	} else if (media.type === MEDIA_TYPE.INPUT) {
		return (
			<InputContent content={media.content as IInputContent} onActionsTrigger={actionsHandler} />
		);
	} else if (media.type === MEDIA_TYPE.INPUT_AREA) {
		return (
			<InputAreaContent content={media.content as IInputAreaContent} onActionsTrigger={actionsHandler} />
		);
	} else {
		return (
			<></>
		);
	}
}
