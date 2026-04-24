import { CSSProperties, TouchEvent, useEffect, useMemo, useRef, useState } from "react";

import classes from "../../styles/ui/ServiceButtonsContent.module.scss";
import { Variables } from "../../../variables";

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
	const touchStartRef = useRef<{ x: number; y: number; } | null>(null);
	const touchMovedRef = useRef<boolean>(false);
	const skipNextClickRef = useRef<boolean>(false);
	const ignoreClicksUntilRef = useRef<number>(0);

	const [hasOverflow, setHasOverflow] = useState<boolean>(false);
	const [atTop, setAtTop] = useState<boolean>(true);
	const [atBottom, setAtBottom] = useState<boolean>(false);
	const [timeTick, setTimeTick] = useState<number>(() => Date.now());

	useEffect(() => {
		// Prevent ghost click from previous page navigation.
		ignoreClicksUntilRef.current = Date.now() + 400;
	}, []);

	useEffect(() => {
		const intervalId = setInterval(() => {
			setTimeTick(Date.now());
		}, 30_000);

		return () => {
			clearInterval(intervalId);
		};
	}, []);

	function parseHourToMinutes(value: string | undefined): number | null {
		if (!value) {
			return null;
		}

		const [hoursRaw, minutesRaw] = value.split(":");
		const hours = Number(hoursRaw);
		const minutes = Number(minutesRaw);

		if (
			Number.isNaN(hours)
			|| Number.isNaN(minutes)
			|| hours < 0
			|| hours > 23
			|| minutes < 0
			|| minutes > 59
		) {
			return null;
		}

		return hours * 60 + minutes;
	}

	function isServiceOpenNow(service: typeof servicesCatalog[number], now: Date): boolean {
		if (Number(service.service_is_disabled)) {
			return false;
		}

		if (Number(service.is_closed_day)) {
			return false;
		}

		const dayKey = String(now.getDay());
		const slots = service.schedule?.[dayKey] ?? [];

		if (slots.length === 0) {
			// Fallback for services without schedule in payload.
			return Boolean(Number(service.service_is_open));
		}

		const currentMinutes = now.getHours() * 60 + now.getMinutes();

		return slots.some(slot => {
			const startMinutes = parseHourToMinutes(slot.hour_start);
			const endMinutes = parseHourToMinutes(slot.hour_end);

			if (startMinutes === null || endMinutes === null) {
				return false;
			}

			if (startMinutes === endMinutes) {
				// Explicit business rule: 00:00 -> 00:00 means always open.
				return startMinutes === 0;
			}

			if (endMinutes > startMinutes) {
				return currentMinutes >= startMinutes && currentMinutes < endMinutes;
			}

			// Overnight slot, e.g. 22:00 -> 02:00.
			return currentMinutes >= startMinutes || currentMinutes < endMinutes;
		});
	}

	function normalizeServiceIds(value: unknown): string[] {
		if (value === undefined || value === null) {
			return [];
		}

		if (Array.isArray(value)) {
			return value
				.map(item => String(item).trim())
				.filter(item => item.length > 0);
		}

		if (typeof value === "number") {
			return [String(value)];
		}

		if (typeof value === "string") {
			const trimmed = value.trim();
			if (trimmed.length === 0) {
				return [];
			}

			const variableMatch = trimmed.match(/^\{([A-Z0-9_]+)\}$/);
			if (variableMatch) {
				const variableName = variableMatch[1];
				const variableValue = (Variables as unknown as Record<string, unknown>)[variableName];
				return normalizeServiceIds(variableValue);
			}

			return trimmed
				.split(",")
				.map(item => item.trim())
				.filter(item => item.length > 0);
		}

		return [];
	}

	const resolvedServiceIds = useMemo(
		() => normalizeServiceIds(content.serviceIds as unknown),
		[content.serviceIds]
	);

	const services = useMemo(() => {
		if (resolvedServiceIds.length === 0) {
			return servicesCatalog;
		}

		const servicesById = new Map(servicesCatalog.map(service => [service.id, service]));
		return resolvedServiceIds
			.map(id => servicesById.get(id))
			.filter((service): service is NonNullable<typeof service> => service !== undefined);
	}, [servicesCatalog, resolvedServiceIds.join(",")]);

	const visibleServices = useMemo(() => {
		if (content.hideClosedService) {
			const now = new Date(timeTick);
			return services.filter(service => isServiceOpenNow(service, now));
		}
		return services;
	}, [services, content.hideClosedService, timeTick]);

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
		
		const filteredAction = actions.filter((a) => a.type === ACTION_TYPE.SAVESERVICE);
		const saveAction = filteredAction.shift();
		if (saveAction && saveAction.service) {
			const saveActionIndex = actions.findIndex((a) => a === saveAction);
			saveAction.service.serviceId = parseInt(serviceId);
			actions[saveActionIndex] = saveAction;
		} else {			
			actions.unshift({
				type: ACTION_TYPE.SAVESERVICE,
				service: {
					serviceId: parseInt(serviceId, 10),
				},
			});
		}

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

	function handleButtonTouchStart(event: TouchEvent<HTMLButtonElement>) {
		const touch = event.changedTouches[0];
		if (!touch) {
			return;
		}

		touchStartRef.current = { x: touch.clientX, y: touch.clientY, };
		touchMovedRef.current = false;
	}

	function handleButtonTouchMove(event: TouchEvent<HTMLButtonElement>) {
		const touch = event.changedTouches[0];
		const start = touchStartRef.current;

		if (!touch || !start) {
			return;
		}

		const deltaX = Math.abs(touch.clientX - start.x);
		const deltaY = Math.abs(touch.clientY - start.y);

		if (deltaX > 8 || deltaY > 8) {
			touchMovedRef.current = true;
		}
	}

	function handleButtonTouchEnd(serviceId: string) {
		skipNextClickRef.current = true;
		setTimeout(() => {
			skipNextClickRef.current = false;
		}, 400);

		if (touchMovedRef.current) {
			return;
		}

		clickHandler(serviceId);
	}

	function handleButtonClick(serviceId: string) {
		if (Date.now() < ignoreClicksUntilRef.current) {
			return;
		}

		if (skipNextClickRef.current) {
			return;
		}

		clickHandler(serviceId);
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
							type="button"
							onClick={() => handleButtonClick(service.id)}
							onTouchStart={handleButtonTouchStart}
							onTouchMove={handleButtonTouchMove}
							onTouchEnd={() => handleButtonTouchEnd(service.id)}
							onTouchCancel={() => {
								touchStartRef.current = null;
								touchMovedRef.current = false;
							}}
							style={{ ...content.buttonStyles, flexShrink: 0, touchAction: "manipulation", }}
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
