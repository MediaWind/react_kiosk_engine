import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/pro-solid-svg-icons";

import styles from "../../../styles/ui/SelectInput.module.scss";

import { Variables } from "../../../../variables";

import { AgentData, IOption, ISelectConfig, IStyles, LANGUAGE, SELECT_PROVIDER, ServiceData, TICKET_DATA_ACTION_TYPE } from "../../../interfaces";

import { useLanguageContext } from "../../../contexts/languageContext";
import { useFlowContext } from "../../../contexts/flowContext";
import { useTicketDataContext } from "../../../contexts/ticketDataContext";

import useAgents from "../../../hooks/useAgents";
import useServices from "../../../hooks/useServices";

import getFontSize from "../../../utils/getFontSize";

import SelectOption from "./SelectOption";

interface ISelectInputProps {
	selectStyles: IStyles
	config: ISelectConfig | undefined
}

function getDefaultText(lng: LANGUAGE | undefined): string {
	switch (lng) {
		case LANGUAGE.ENGLISH: return "-- Select an option --";
		case LANGUAGE.DUTCH: return "-- Selecteer een optie --";
		case LANGUAGE.SPANISH: return "-- Seleccione una opción --";
		case LANGUAGE.FRENCH:
		default: return "-- Sélectionnez une option --";
	}
}

export default function SelectInput(props: ISelectInputProps): JSX.Element {
	const { selectStyles, config, } = props;

	const { language, } = useLanguageContext();
	const { flow, } = useFlowContext();
	const { dispatchTicketState, } = useTicketDataContext();

	const [userAgents, getUserAgents] = useAgents();
	const [services, getServices] = useServices();

	const [selectedValue, setSelectedValue] = useState<string>(config?.placeholders ? config.placeholders[language ?? "fr"] : getDefaultText(language));
	const [showDropdown, setShowDropdown] = useState<boolean>(false);

	const [customOptions, setCustomOptions] = useState<IOption[]>([]);
	const [agentOptions, setAgentOptions] = useState<AgentData[]>([]);
	const [serviceOptions, setServiceOptions] = useState<ServiceData[]>([]);

	useEffect(() => {
		switch (config?.provider) {
			case SELECT_PROVIDER.CUSTOM:
				setCustomOptions(config.options ?? []);
				setAgentOptions([]);
				setServiceOptions([]);
				break;
			case SELECT_PROVIDER.SERVICES:
				getServices(config.filterUnavailable, config.filterIds);
				setCustomOptions([]);
				setAgentOptions([]);
				break;
			case SELECT_PROVIDER.USER_AGENTS:
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
				payload: { serviceID: parseInt(value), },
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
					all: selectStyles.all,

					top: selectStyles.top,
					bottom: selectStyles.bottom,
					right: selectStyles.right,
					left: selectStyles.left,
					zIndex: 3,

					width: selectStyles.width,
					height: selectStyles.height,

					margin: selectStyles.margin,
					padding: selectStyles.padding,

					backgroundColor: selectStyles.backgroundColor ?? "transparent",
					opacity: selectStyles.opacity,

					borderStyle: selectStyles.borderStyle,
					borderWidth: selectStyles.borderWidth,
					borderColor: selectStyles.borderColor,
					borderRadius: selectStyles.borderRadius,
				}}
			>
				<p
					style={{
						fontFamily: selectStyles.fontFamily,
						fontSize: selectStyles.fontSize ?? getFontSize(selectStyles.height),
						color: selectStyles.textColor,
						textAlign: selectStyles.textAlign,
					}}
				>
					{selectedValue}
				</p>
				<FontAwesomeIcon icon={faChevronDown} style={{
					fontSize: selectStyles.fontSize ?? getFontSize(selectStyles.height),
					color: selectStyles.textColor,
				}} />
			</div>

			{showDropdown &&
				<div
					className={styles.dropdown}
					style={{
						all: config?.dropdownStyles?.all,

						top: config?.dropdownStyles?.top,
						bottom: config?.dropdownStyles?.bottom,
						right: config?.dropdownStyles?.right,
						left: config?.dropdownStyles?.left,
						zIndex: 3,

						width: config?.dropdownStyles?.width,
						height: config?.dropdownStyles?.height,

						margin: config?.dropdownStyles?.margin,
						padding: config?.dropdownStyles?.padding,

						backgroundColor: config?.dropdownStyles?.backgroundColor ?? "transparent",
						opacity: config?.dropdownStyles?.opacity,

						borderStyle: config?.dropdownStyles?.borderStyle,
						borderWidth: config?.dropdownStyles?.borderWidth,
						borderColor: config?.dropdownStyles?.borderColor,
						borderRadius: config?.dropdownStyles?.borderRadius,
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
						label={language === LANGUAGE.ENGLISH ? option.name_en : language === LANGUAGE.DUTCH ? option.name_nl : option.name_fr}
						value={option.id}
						onChange={changeHandler}
						styles={config?.optionStyles} />)
					}
				</div>
			}
		</>
	);
}
