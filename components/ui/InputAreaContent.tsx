import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import classes from "../../styles/ui/InputAreaContent.module.scss";

import { ACTION_TYPE, IInputAreaContent, PROVIDER, TICKET_DATA_ACTION_TYPE } from "../../interfaces";

import { useFlowContext } from "../../contexts/flowContext";
import { useErrorContext } from "../../contexts/errorContext";
import { useTicketDataContext } from "../../contexts/ticketDataContext";

import useAgents from "../../hooks/useAgents";
import useServices from "../../hooks/useServices";

import AdvancedButton from "./inputs/AdvancedButton";

interface IInputAreaContentProps {
	content: IInputAreaContent;
	onActionsTrigger: CallableFunction;
}

export default function InputAreaContent(props: IInputAreaContentProps): JSX.Element {
	const { content, onActionsTrigger, } = props;

	const { t, } = useTranslation("InputAreaContent");
	const { flow, } = useFlowContext();
	const { dispatchErrorState, } = useErrorContext();
	const { dispatchTicketState, } = useTicketDataContext();

	const [services, getServices] = useServices(dispatchErrorState);
	const [agents, getAgents] = useAgents(dispatchErrorState);

	useEffect(() => {
		if (content.provider === PROVIDER.SERVICES) {
			getServices(content.filterUnavailable, content.filterIds);
		} else if (content.provider === PROVIDER.USER_AGENTS) {
			getAgents(content.filterIds);
		}
	}, []);

	function clickHandler(id: string) {
		if (content.provider === PROVIDER.USER_AGENTS) {
			const inputId = flow.ticketParameters?.idUserAgent;

			if (inputId) {
				dispatchTicketState({
					type: TICKET_DATA_ACTION_TYPE.INPUTTEXTUPDATE,
					payload: {
						id: inputId,
						value: id,
					},
				});
			}
		}

		if (content.actions) {
			let updatedActions = content.actions;

			if (content.provider === PROVIDER.SERVICES) {
				const isSavingService = content.actions.find(action => action.type === ACTION_TYPE.SAVESERVICE);

				if (isSavingService) {
					updatedActions = updatedActions.filter(action => action.type !== ACTION_TYPE.SAVESERVICE);
					updatedActions.push({
						type: ACTION_TYPE.SAVESERVICE,
						service: {
							serviceId: parseInt(id),
						},
					});
				}
			}

			onActionsTrigger(updatedActions);
		}
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
				<p
					style={{
						fontFamily: content.styles.fontFamily,
						fontSize: content.styles.fontSize,
						color: content.styles.color,
						textAlign: content.styles.textAlign,
					}}
				>
					{content.provider === PROVIDER.SERVICES ? t("no service") : content.provider === PROVIDER.USER_AGENTS ? t("no agent") : ""}
				</p>
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
					value={service.id}
					onClick={clickHandler}
					styles={content.inputsConfig?.styles ?? {}}
					config={{
						label: {
							"fr": service.name_fr.replace("\\", "") + (!service.service_is_open ? t("closed") : ""),
							"nl": (service.name_nl !== "" ? service.name_nl : service.name_fr).replace("\\", "") + (!service.service_is_open ? t("closed") : ""),
							"en": (service.name_en !== "" ? service.name_en : service.name_fr).replace("\\", "") + (!service.service_is_open ? t("closed") : ""),
						},
					}}
					disabled={!service.service_is_open}
				/>
			))}

			{agents.length > 0 && agents.map((agent, index) => (
				<AdvancedButton
					key={`input_area__button_${index}`}
					value={agent.id_user}
					onClick={clickHandler}
					styles={content.inputsConfig?.styles ?? {}}
					config={{
						label: {
							"fr": `${agent.name.firstname} ${agent.name.lastname}`,
							"nl": `${agent.name.firstname} ${agent.name.lastname}`,
							"en": `${agent.name.firstname} ${agent.name.lastname}`,
						},
					}}
				/>
			))}
		</div>
	);
}
