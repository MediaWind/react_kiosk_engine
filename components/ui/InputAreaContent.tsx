import classes from "../../styles/ui/InputAreaContent.module.scss";

import { IInputAreaContent, PROVIDER } from "../../interfaces";

import { useErrorContext } from "../../contexts/errorContext";

import useAgents from "../../hooks/useAgents";
import useServices from "../../hooks/useServices";
import { useEffect } from "react";
import ButtonInput from "./inputs/ButtonInput";
import AdvancedButton from "./inputs/AdvancedButton";
import { useTranslation } from "react-i18next";

interface IInputAreaContentProps {
	content: IInputAreaContent;
}

export default function InputAreaContent(props: IInputAreaContentProps): JSX.Element {
	const { content, } = props;

	const { dispatchErrorState, } = useErrorContext();
	const { t, } = useTranslation("InputAreaContent");

	const [services, getServices] = useServices(dispatchErrorState);
	const [agents, getAgents] = useAgents(dispatchErrorState);

	useEffect(() => {
		if (content.provider === PROVIDER.SERVICES) {
			getServices(content.filterUnavailable, content.filterIds);
		} else if (content.provider === PROVIDER.USER_AGENTS) {
			getAgents(content.filterIds);
		}
	}, []);

	function clickHandler() {
		//
	}

	if (services.length === 0 && agents.length === 0) {
		return (
			<div
				className={classes.main}
				style={{
					position: "absolute",
					zIndex: 2,
					justifyContent: "center",
					...content.styles,
				}}
			>
				{content.provider === PROVIDER.SERVICES && (
					<p
						className={classes.no_availability}
						style={{
							fontFamily: content.styles.fontFamily,
							fontSize: content.styles.fontSize,
							color: content.styles.color,
							textAlign: content.styles.textAlign,
						}}
					>{t("no service")}</p>
				)}

				{content.provider === PROVIDER.USER_AGENTS && (
					<p
						className={classes.no_availability}
						style={{
							color: content.styles.color,
						}}
					>{t("no agent")}</p>
				)}
			</div>
		);
	}

	return (
		<div
			className={classes.main}
			style={{
				position: "absolute",
				zIndex: 2,
				...content.styles,
			}}
		>
			{services.length > 0 && services.map((service, index) => (
				<AdvancedButton
					key={`input_area__button_${index}`}
					onClick={clickHandler}
					styles={content.inputsConfig?.styles ?? {}}
					config={{
						label: {
							"fr": service.name_fr.replace("\\", "") + (!service.service_is_open ? t("closed") : ""),
							"nl": (service.name_nl !== "" ? service.name_nl : service.name_fr).replace("\\", "") + (!service.service_is_open ? t("closed") : ""),
							"en": (service.name_en !== "" ? service.name_en : service.name_fr).replace("\\", "") + (!service.service_is_open ? t("closed") : ""),
							"es": (service.name_en !== "" ? service.name_en : service.name_fr).replace("\\", "") + (!service.service_is_open ? t("closed") : ""),
						},
					}}
				/>
			))}

			{agents.length > 0 && agents.map((agent, index) => <ButtonInput key={`input_area__button_${index}`} onClick={clickHandler} styles={content.inputsConfig?.styles ?? {}} />)}
		</div>
	);
}
