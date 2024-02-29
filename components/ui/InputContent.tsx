import { useEffect, useState } from "react";

import { eIdStatus } from "../../../core/hooks/useEId";

import { IInputContent, INPUT_TYPE } from "../../interfaces";

import { useEIdContext } from "../../contexts/eIdContext";

import ButtonInput from "./inputs/ButtonInput";
import NumberInput from "./inputs/NumberInput";
import SelectInput from "./inputs/SelectInput";

interface IInputContentProps {
	content: IInputContent
	onActionsTrigger: CallableFunction
}

export default function InputContent(props: IInputContentProps): JSX.Element {
	const { content, onActionsTrigger, } = props;

	const { status, } = useEIdContext();

	const [eIdBlock, setEIdBlock] = useState<boolean>(false);

	useEffect(() => {
		if (content.type === INPUT_TYPE.CARDREADER) {
			if (status === eIdStatus.READ) {
				setEIdBlock(true);
			}

			if (status === eIdStatus.REMOVED && eIdBlock) {
				setEIdBlock(false);
				actionHandler();
			}
		}
	}, [content, status]);

	useEffect(() => {
		if (content.type === INPUT_TYPE.QRCODE) {
			actionHandler();
		}
	}, []);

	function actionHandler() {
		onActionsTrigger(content.actions);
	}

	if (content.type === INPUT_TYPE.BUTTON) {
		return (
			<ButtonInput onClick={actionHandler} styles={content.styles} />
		);
	}

	if (content.type === INPUT_TYPE.NUMBER) {
		return (
			<NumberInput styles={content.styles} />
		);
	}

	if (content.type === INPUT_TYPE.SELECT) {
		return (
			<SelectInput selectStyles={content.styles} config={content.selectConfig} />
		);
	}

	//? INPUT_TYPE.TEXT is managed from ActivePage with TextInputsManager component
	return (
		<>
		</>
	);
}
