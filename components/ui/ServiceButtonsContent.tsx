import { CSSProperties, useEffect, useMemo, useRef, useState } from "react";

import { Variables } from "../../../variables";
import classes from "../../styles/ui/ServiceButtonsContent.module.scss";

import { ACTION_TYPE, IInputAction, IServiceButtonsContent } from "../../interfaces";
import { useLanguageContext } from "../../contexts/languageContext";
import fetchRetry from "../../utils/fetchRetry";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp, faAngleDown } from "@fortawesome/pro-solid-svg-icons";

type ServiceButtonData = {
	id: string;
	name_fr: string;
	service_is_open?: boolean | number;
	array_translations?: Record<string, {
		lang: string;
		value: string;
	}>;
};

interface IServiceButtonsContentProps {
	content: IServiceButtonsContent;
	onActionsTrigger: CallableFunction;
}

export default function ServiceButtonsContent(props: IServiceButtonsContentProps): JSX.Element {
	const { content, onActionsTrigger, } = props;
	const { language, } = useLanguageContext();
	const listRef = useRef<HTMLDivElement | null>(null);

	const [services, setServices] = useState<ServiceButtonData[]>([]);
	const [hasOverflow, setHasOverflow] = useState<boolean>(false);

	const visibleServices = useMemo(() => {
		if (content.hideClosedService) {
			return services.filter(service => Boolean(Number(service.service_is_open)));
		}
		return services;
	}, [services, content.hideClosedService]);

	const buttonTextStyle: CSSProperties = {
		fontSize: content.buttonStyles.fontSize,
		fontFamily: content.buttonStyles.fontFamily,
		fontWeight: content.buttonStyles.fontWeight,
		fontStyle: content.buttonStyles.fontStyle,
		lineHeight: content.buttonStyles.lineHeight,
		letterSpacing: content.buttonStyles.letterSpacing,
		color: content.buttonStyles.color,
		textAlign: content.buttonStyles.textAlign,
	};

	function clickHandler(serviceId: string) {
		let actions = content.actions ?? [];

		if (!actions || actions.length === 0) {
			return;
		}

		actions.unshift({
			type: ACTION_TYPE.SAVESERVICE,
			service: {
				serviceId: parseInt(serviceId, 10),
			},
		});

		actions = actions.map(action => {
			if (action.type !== ACTION_TYPE.CUSTOM) {
				return action;
			}

			return {
				...action,
				id: `${action.id ?? ""}=${serviceId}`,
			};
		});

		onActionsTrigger(actions);
	}

	function scrollList(direction: "up" | "down") {
		if (!listRef.current || !hasOverflow) {
			return;
		}

		const step = content.scrollStep ?? 120;
		listRef.current.scrollBy({
			top: direction === "up" ? -step : step,
			behavior: "smooth",
		});
	}

	useEffect(() => {
		function updateOverflowState() {
			if (!listRef.current) {
				setHasOverflow(false);
				return;
			}

			setHasOverflow(listRef.current.scrollHeight > listRef.current.clientHeight + 1);
		}

		updateOverflowState();
		window.addEventListener("resize", updateOverflowState);

		return () => {
			window.removeEventListener("resize", updateOverflowState);
		};
	}, [visibleServices.length, content.buttonStyles.height, content.styles.height]);

	useEffect(() => {
		async function fetchServices() {
			const urlObj = new URL(`${Variables.DOMAINE_HTTP}/modules/Modules/QueueManagement/services/services.php`);
			urlObj.searchParams.set("id_project", Variables.W_ID_PROJECT.toString());
			urlObj.searchParams.set("serial", Variables.SERIAL);
			urlObj.searchParams.set("all", "1");
			if (content.serviceIds && content.serviceIds.length > 0) {
				urlObj.searchParams.set("id_service", content.serviceIds.join(","));
			}

			try {
				const response = await fetchRetry(urlObj.toString());
				const data = await response.json();

				const returnedServices: ServiceButtonData[] = Array.isArray(data)
					? data
					: data.array_services ?? [];

				setServices(returnedServices);
			} catch (error) {
				console.error("Error fetching services for buttons list:", error);
				setServices([]);
			}
		}

		fetchServices();
	}, [content.serviceIds?.join(","), content.hideClosedService]);

	return (
		<div className={classes.main} style={{ ...content.styles, }}>
			<div
				ref={listRef}
				className={classes.list}
				style={{
					justifyContent: hasOverflow ? "flex-start" : "center",
				}}
			>
				{visibleServices.map(service => {
					const label = service.array_translations?.[language]?.value?.trim()
						|| service.array_translations?.fr?.value?.trim()
						|| service.name_fr;

					return (
						<button
							key={`service_button_${service.id}`}
							onClick={() => clickHandler(service.id)}
							onTouchEnd={() => clickHandler(service.id)}
							style={{ ...content.buttonStyles, flexShrink: 0, }}
						>
							<span style={buttonTextStyle}>{label}</span>
						</button>
					);
				})}

				{visibleServices.length === 0 && (
					<div style={buttonTextStyle}>{content.emptyLabel ?? ""}</div>
				)}
			</div>

			<div
				className={classes.controls}
				style={hasOverflow ? undefined : { visibility: "hidden", pointerEvents: "none", }}
			>
				<button
					onClick={() => scrollList("up")}
					onTouchEnd={() => scrollList("up")}
					className={classes.scroll_btn}
				>
					<FontAwesomeIcon icon={faAngleUp} style={{ fontSize: "35px", }} />
				</button>
				<button
					onClick={() => scrollList("down")}
					onTouchEnd={() => scrollList("down")}
					className={classes.scroll_btn}
				>
					<FontAwesomeIcon icon={faAngleDown} style={{ fontSize: "35px", }} />
				</button>
			</div>
		</div>
	);
}
