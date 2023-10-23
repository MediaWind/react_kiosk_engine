import { IImageContent, IInputContent, IMedia, IVideoContent, MediaType } from "../interfaces";

import ImageContent from "./ui/ImageContent";
import InputContent from "./ui/InputContent";
import VideoContent from "./ui/VideoContent";

interface IFlowMediaProps {
	id: string
	media: IMedia
	onNavigate: CallableFunction
	onPrint: CallableFunction
	onBackPage: CallableFunction
	onHomePage: CallableFunction
}

export default function FlowMedia(props: IFlowMediaProps): JSX.Element {
	const {
		id,
		media,
		onNavigate,
		onPrint,
		onBackPage,
		onHomePage,
	} = props;

	const navigationHandler = (pageID: string) => {
		onNavigate(pageID);
	};

	const printHandler = () => {
		onPrint();
	};

	const backPageHandler = () => {
		onBackPage();
	};

	const homePageHandler = () => {
		onHomePage();
	};

	if (media.type === MediaType.IMAGE) {
		return (
			<ImageContent id={id} content={media.content as IImageContent} />
		);
	} else if (media.type === MediaType.VIDEO) {
		return (
			<VideoContent id={id} content={media.content as IVideoContent} />
		);
	} else {
		return (
			<InputContent
				content={media.content as IInputContent}
				onNavigate={navigationHandler}
				onPrint={printHandler}
				onBackPage={backPageHandler}
				onHomePage={homePageHandler}
			/>
		);
	}
}
