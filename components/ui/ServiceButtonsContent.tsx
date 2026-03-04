import { CSSProperties, useEffect, useMemo, useRef, useState } from "react";

import classes from "../../styles/ui/ServiceButtonsContent.module.scss";

import { ACTION_TYPE, IServiceButtonsContent } from "../../interfaces";
import { useLanguageContext } from "../../contexts/languageContext";
import { useServicesCatalogContext } from "../../contexts/servicesCatalogContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp, faAngleDown } from "@fortawesome/pro-solid-svg-icons";

interface IServiceButtonsContentProps {
	content: IServiceButtonsContent;
	onActionsTrigger: CallableFunction;
}

export default function ServiceButtonsContent(props: IServiceButtonsContentProps): JSX.Element {
	const { content, onActionsTrigger, } = props;
	const { language, } = useLanguageContext();
	const { servicesCatalog, } = useServicesCatalogContext();
	const listRef = useRef<HTMLDivElement | null>(null);

	const [hasOverflow, setHasOverflow] = useState<boolean>(false);
	const [atTop, setAtTop] = useState<boolean>(true);
	const [atBottom, setAtBottom] = useState<boolean>(false);

	const services = useMemo(() => {
		if (!content.serviceIds || content.serviceIds.length === 0) {
			return servicesCatalog;
		}

		const servicesById = new Map(servicesCatalog.map(service => [service.id, service]));
		return content.serviceIds
			.map(id => servicesById.get(id))
			.filter((service): service is NonNullable<typeof service> => service !== undefined);
	}, [servicesCatalog, content.serviceIds?.join(",")]);

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
		const element = listRef.current;

		function updateScrollState() {
			if (!element) {
				setHasOverflow(false);
				setAtTop(true);
				setAtBottom(true);
				return;
			}

			const { scrollTop, scrollHeight, clientHeight, } = element;
			const maxScroll = scrollHeight - clientHeight;

			setHasOverflow(scrollHeight > clientHeight + 1);
			setAtTop(scrollTop <= 1);
			setAtBottom(scrollTop >= maxScroll - 1);
		}

		updateScrollState();

		element?.addEventListener("scroll", updateScrollState);
		window.addEventListener("resize", updateScrollState);

		return () => {
			element?.removeEventListener("scroll", updateScrollState);
			window.removeEventListener("resize", updateScrollState);
		};
	}, [visibleServices.length, content.buttonStyles.height, content.styles.height]);

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
					onTouchEnd={() => scrollList("up")}
					className={classes.scroll_btn}
					disabled={atTop}
				>
					<FontAwesomeIcon icon={faAngleUp} style={{ fontSize: "35px", }} />
				</button>
				<button
					onTouchEnd={() => scrollList("down")}
					className={classes.scroll_btn}
					disabled={atBottom}
				>
					<FontAwesomeIcon icon={faAngleDown} style={{ fontSize: "35px", }} />
				</button>
			</div>
		</div>
	);
}
