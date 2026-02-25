import { CSSProperties, useEffect, useState } from "react";
import dayjs from "dayjs";

import { Variables } from "../../../variables";

import { IServiceScheduleContent } from "../../interfaces";
import { useLanguageContext } from "../../contexts/languageContext";
import fetchRetry from "../../utils/fetchRetry";

type ServiceScheduleSlot = {
	hour_start: string;
	hour_end: string;
};

type ServiceWithSchedule = {
	id: string;
	name_fr: string;
	array_translations?: Record<string, {
		lang: string;
		value: string;
	}>;
	schedule?: Record<string, ServiceScheduleSlot[]>;
};

interface IServiceScheduleContentProps {
	content: IServiceScheduleContent;
}

function formatHour(value: string, format: string): string {
	const [hour = "00", minute = "00"] = value.split(":");
	const date = new Date();
	date.setHours(Number(hour), Number(minute), 0, 0);
	return dayjs(date).format(format);
}

export default function ServiceScheduleContent(props: IServiceScheduleContentProps): JSX.Element {
	const { content, } = props;
	const { language, } = useLanguageContext();

	const [services, setServices] = useState<ServiceWithSchedule[]>([]);

	const timeFormat = content.format ?? "HH:mm";
	const emptyLabel = content.emptyLabel ?? "";
	const rowTextStyle: CSSProperties = {
		display: "block",
		width: "100%",
		fontSize: content.styles.fontSize,
		fontFamily: content.styles.fontFamily,
		fontWeight: content.styles.fontWeight,
		fontStyle: content.styles.fontStyle,
		lineHeight: content.styles.lineHeight,
		letterSpacing: content.styles.letterSpacing,
		color: content.styles.color,
		textAlign: content.styles.textAlign,
	};

	useEffect(() => {
		async function fetchSchedules() {

			const urlObj = new URL(`${Variables.DOMAINE_HTTP}/modules/Modules/QueueManagement/services/services.php`);
			urlObj.searchParams.set("id_project", Variables.W_ID_PROJECT.toString());
			urlObj.searchParams.set("serial", Variables.SERIAL);
			urlObj.searchParams.set("all", "1");
			if (content.serviceIds && content.serviceIds.length > 0) {
				urlObj.searchParams.set("id_service", content.serviceIds.join(","));
			}
			const url = urlObj.toString();

			try {
				const response = await fetchRetry(url);
				const data = await response.json();

				const returnedServices: ServiceWithSchedule[] = Array.isArray(data)
					? data
					: data.array_services ?? [];

				setServices(returnedServices);
			} catch (error) {
				console.error("Error fetching services schedules:", error);
				setServices([]);
			}
		}

		fetchSchedules();
	}, [content.serviceIds?.join(",")]);

	return (
		<div style={{ position: "absolute", zIndex: 2, ...content.styles, }}>
			{services.map(service => {
				const day = `${new Date().getDay()}`;
				const daySchedule = service.schedule?.[day] ?? [];

				const label = service.array_translations?.[language]?.value?.trim()
					|| service.array_translations?.fr?.value?.trim()
					|| service.name_fr;

				const scheduleLabel = daySchedule.length > 0
					? daySchedule
						.map(slot => `${formatHour(slot.hour_start, timeFormat)} - ${formatHour(slot.hour_end, timeFormat)}`)
						.join(" / ")
					: emptyLabel;

				return (
					<div key={`service_schedule_${service.id}`} style={rowTextStyle}>
						{label} : {scheduleLabel}
					</div>
				);
			})}

			{services.length == 0 && <div style={rowTextStyle}>{emptyLabel}</div>}
		</div>

	);
}
