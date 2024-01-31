import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/pro-solid-svg-icons";

import style from "../../../styles/ui/UserAgentSelect.module.scss";

import { AgentData, IStyles, LANGUAGE } from "../../../interfaces";

import useAgents from "../../../hooks/useAgents";
import { useLanguageContext } from "../../../contexts/languageContext";

interface IUserAgentSelectProps {
	styles: IStyles
}

function getDefaultText(lng?: LANGUAGE) {
	switch (lng) {
		case LANGUAGE.DUTCH: return "Selecteer een host";
		case LANGUAGE.FRENCH: return "Sélectionnez un hôte";
		case LANGUAGE.SPANISH: return "Seleccione un host";
		case LANGUAGE.ENGLISH:
		default: return "Please select an host";
	}
}

function getDropdownPosition(selectTop: string, selectHeight: string) {
	const topMatch = selectTop.match(/^([\d.]+)(\D+)$/);
	const heightMatch = selectHeight.match(/^([\d.]+)(\D+)$/);

	if (!topMatch || !heightMatch) return;

	const topNumericValue = parseInt(topMatch[1], 10);
	const heightNumericValue = parseInt(heightMatch[1], 10);

	if (topNumericValue > 50) {
		return `${topNumericValue - 50 + (heightNumericValue / 2)}${topMatch[2]}`;
	} else {
		return `${topNumericValue + (heightNumericValue / 2)}${topMatch[2]}`;
	}
}

function getDropdownBorderRadius(selectTop: string, selectBorderRadius: string) {
	const topMatch = selectTop.match(/^([\d.]+)(\D+)$/);

	if (!topMatch) return;

	if (parseInt(topMatch[1]) > 50) {
		return `${selectBorderRadius} ${selectBorderRadius} 0 0`;
	} else {
		return `0 0 ${selectBorderRadius} ${selectBorderRadius}`;
	}
}

export default function UserAgentSelect(props: IUserAgentSelectProps): JSX.Element {
	const { styles, } = props;
	const [selectedAgent, setSelectedAgent] = useState<AgentData | undefined>();
	const [showDropdown, setShowDropdown] = useState<boolean>(false);

	const [agents, getUserAgents] = useAgents();

	const { language, } = useLanguageContext();

	useEffect(() => {
		getUserAgents();
	}, []);

	useEffect(() => {
		// console.log("🚀 ~ UserAgentSelect ~ agents:", agents);
	}, [agents]);

	function toggleDropdown() {
		setShowDropdown(latest => !latest);
	}

	return (
		<>
			<div
				onClick={toggleDropdown}
				className={style.main}
				style={{
					all: styles.all,
					outline: "none",

					position: "absolute",
					top: styles.top,
					bottom: styles.bottom,
					right: styles.right,
					left: styles.left,
					zIndex: 3,

					width: styles.width,
					height: styles.height,

					margin: styles.margin,

					borderWidth: styles.borderWidth,
					borderStyle: styles.borderStyle,
					borderColor: styles.borderColor,
					borderRadius: styles.borderRadius,

					boxShadow: showDropdown ? `0 0 5px 0 ${styles.borderColor ?? "#000000"}` : "",

					backgroundColor: styles.backgroundColor ?? "#ffffff",
					opacity: styles.opacity,
				}}
			>
				<p
					style={{
						fontFamily: styles.fontFamily,
						fontSize: styles.fontSize,
						color: styles.textColor,
						textAlign: styles.textAlign,
					}}
				>
					{selectedAgent ? `${selectedAgent.name.firstname} ${selectedAgent.name.lastname}` : getDefaultText(language)}
				</p>
				<FontAwesomeIcon
					icon={faChevronDown}
					style={{
						fontSize: styles.fontSize,
						color: styles.textColor,
					}}
				/>
			</div>

			{showDropdown && (
				<div
					className={style.dropdown}
					style={{
						all: styles.all,
						outline: "none",

						position: "absolute",
						top: getDropdownPosition(styles.top, styles.height),
						left: styles.left,
						zIndex: 2,

						width: styles.width,
						height: "50%",

						margin: styles.margin,
						padding: styles.padding,

						borderRadius: styles.borderRadius ? getDropdownBorderRadius(styles.top, styles.borderRadius) : "",

						backgroundColor: "#ffffff",
						opacity: styles.opacity,
					}}
				>
					<div className={style.agents_list}>

					</div>
				</div>
			)}
		</>
	);
}
