import { CSSProperties, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/pro-solid-svg-icons";

import styles from "../../../styles/inputs/SelectInput.module.scss";

import { Variables } from "../../../../variables";

import { AgentData, IOption, ISelectConfig, PROVIDER, ServiceData, TICKET_DATA_ACTION_TYPE } from "../../../interfaces";

import { useLanguageContext } from "../../../contexts/languageContext";
import { useFlowContext } from "../../../contexts/flowContext";
import { useTicketDataContext } from "../../../contexts/ticketDataContext";
import { useErrorContext } from "../../../contexts/errorContext";

import useAgents from "../../../hooks/useAgents";
import useServices from "../../../hooks/useServices";

import getFontSize from "../../../utils/getFontSize";

import SelectOption from "./SelectOption";

interface ISelectInputProps {
	selectStyles: CSSProperties
	config: ISelectConfig | undefined
}

function getLabel(option: ServiceData, defaultLanguage: string, language: string): string {
	if (language === "en") {
		return option.name_en;
	}

	if (language === "fr") {
		return option.name_fr;
	}

	if (language === "nl") {
		return option.name_nl;
	}

	if (defaultLanguage === "en") {
		return option.name_en;
	}

	if (language === "nl") {
		return option.name_nl;
	}

	return option.name_fr;
}

export default function SelectInput(props: ISelectInputProps): JSX.Element {
	const { selectStyles, config, } = props;

	const { t, } = useTranslation("SelectInput");

	const { defaultLangue, language, } = useLanguageContext();
	const { flow, } = useFlowContext();
	const { dispatchTicketState, } = useTicketDataContext();
	const { dispatchErrorState, } = useErrorContext();

	const [userAgents, getUserAgents] = useAgents(dispatchErrorState);
	const [services, getServices] = useServices(dispatchErrorState);

	const [selectedValue, setSelectedValue] = useState<string>(config?.placeholders ? config.placeholders[language ?? "fr"] : t("default placeholder"));
	const [showDropdown, setShowDropdown] = useState<boolean>(false);

	const [customOptions, setCustomOptions] = useState<IOption[]>([]);
	const [agentOptions, setAgentOptions] = useState<AgentData[]>([]);
	const [serviceOptions, setServiceOptions] = useState<ServiceData[]>([]);

	useEffect(() => {
		switch (config?.provider) {
			case PROVIDER.CUSTOM:
				setCustomOptions(config.options ?? []);
				setAgentOptions([]);
				setServiceOptions([]);
				break;
			case PROVIDER.SERVICES:
				getServices(config.filterUnavailable, config.filterIds);
				setCustomOptions([]);
				setAgentOptions([]);
				break;
			case PROVIDER.USER_AGENTS:
				getUserAgents(config.filterIds);
				setCustomOptions([]);
				setServiceOptions([]);
				break;
			default:
				setCustomOptions([]);
				setAgentOptions([]);
				setServiceOptions([]);
		}
	}, []);

	useEffect(() => {
		setAgentOptions(userAgents);
	}, [userAgents]);

	useEffect(() => {
		setServiceOptions(services);
	}, [services]);

	function toggleDropdown() {
		setShowDropdown(latest => !latest);
	}

	function devToggle() {
		if (Variables.PREVIEW) {
			toggleDropdown();
		}
	}

	function changeHandler(label: string, value: string) {
		setSelectedValue(label);
		setShowDropdown(false);

		if (flow.ticketParameters?.idUserAgent && agentOptions.length > 0) {
			dispatchTicketState({
				type: TICKET_DATA_ACTION_TYPE.INPUTTEXTUPDATE,
				payload: {
					id: flow.ticketParameters.idUserAgent,
					value: value,
				},
			});
		}

		if (serviceOptions.length > 0) {
			dispatchTicketState({
				type: TICKET_DATA_ACTION_TYPE.SERVICEUPDATE,
				payload: { serviceId: parseInt(value), },
			});
		}

		//TODO: save custom value *somewhere*
	}

	return (
		<>
			<div
				onTouchEnd={toggleDropdown}
				onClick={devToggle}
				className={styles.main}
				style={{
					position: "absolute",
					zIndex: 3,
					backgroundColor: "transparent",
					...selectStyles,
				}}
			>
				<p
					style={{
						fontFamily: selectStyles.fontFamily,
						fontSize: selectStyles.fontSize ?? getFontSize(`${selectStyles.height}`),
						textAlign: selectStyles.textAlign,
						color: selectStyles.color,
					}}
				>
					{selectedValue}
				</p>
				<FontAwesomeIcon icon={faChevronDown} style={{
					fontSize: selectStyles.fontSize ?? getFontSize(`${selectStyles.height}`),
					color: selectStyles.color,
				}} />
			</div>

			{showDropdown &&
				<div
					className={styles.dropdown}
					style={{
						zIndex: 3,
						backgroundColor: config?.dropdownStyles?.backgroundColor ?? "transparent",
						...config?.dropdownStyles,
					}}
				>
					{customOptions.length > 0 && customOptions.map(option => <SelectOption
						key={option.key}
						label={option.label}
						value={option.value}
						onChange={changeHandler}
						styles={config?.optionStyles} />)
					}

					{agentOptions.length > 0 && agentOptions.map(option => <SelectOption
						key={option.id_user}
						label={`${option.name.firstname} ${option.name.lastname}`}
						value={option.id_user}
						onChange={changeHandler}
						styles={config?.optionStyles} />)
					}

					{serviceOptions.length > 0 && serviceOptions.map(option => <SelectOption
						key={option.id}
						label={getLabel(option, defaultLangue, language)}
						value={option.id}
						onChange={changeHandler}
						styles={config?.optionStyles} />)
					}
				</div>
			}
		</>
	);
}
