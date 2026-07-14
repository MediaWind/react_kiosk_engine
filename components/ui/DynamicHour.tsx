import { CSSProperties, Fragment } from "react";
import dayjs from "dayjs";

import { IDynamicHourData } from "../../interfaces";
import { useLanguageContext } from "../../contexts/languageContext";
import { useServicesCatalogContext } from "../../contexts/servicesCatalogContext";

interface IDynamicHourProps {
	serviceId: string;
	config: IDynamicHourData;
}

const dayLabels: Record<string, string[]> = {
	fr: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
	nl: ["Zondag", "Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag"],
	en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
};

const weekdayOrder = [1, 2, 3, 4, 5, 6, 0];

function formatHour(value: string, format: string): string {
	const [hour = "00", minute = "00"] = value.split(":");
	const date = new Date();
	date.setHours(Number(hour), Number(minute), 0, 0);
	return dayjs(date).format(format);
}

export default function DynamicHour(props: IDynamicHourProps): JSX.Element | null {
	const { serviceId, config, } = props;
	const { servicesCatalog, } = useServicesCatalogContext();
	const { language, defaultLangue, } = useLanguageContext();

	const service = servicesCatalog.find(item => String(item.id) === String(serviceId));
	if (!service) return null;

	const labels = dayLabels[language] ?? dayLabels[defaultLangue] ?? dayLabels.fr;
	const format = config.format ?? "HH[h]mm";
	const emptyLabel = config.emptyLabel ?? "";
	const dayStyle: CSSProperties = {
		...config.rowStyle,
		textAlign: "right",
	};
	const hoursStyle: CSSProperties = {
		...config.rowStyle,
		textAlign: "left",
	};

	return (
		<div style={{
			position: "absolute",
			zIndex: 2,
			...config.style,
			display: "grid",
			gridTemplateColumns: "max-content max-content",
			justifyContent: "center",
			columnGap: "0.5em",
		}}>
			{weekdayOrder.map(day => {
				const label = labels[day];
				const slots = service.schedule?.[String(day)] ?? [];
				const hours = slots.length > 0
					? slots.map(slot => `${formatHour(slot.hour_start, format)} - ${formatHour(slot.hour_end, format)}`).join(" / ")
					: emptyLabel;

				return (
					<Fragment key={`dynamic_hour_${day}`}>
						<span style={dayStyle}>{label} :</span>
						<span style={hoursStyle}>{hours}</span>
					</Fragment>
				);
			})}
		</div>
	);
}
