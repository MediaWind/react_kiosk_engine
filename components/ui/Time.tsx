import { CSSProperties, useEffect, useState } from "react";
import dayjs from "dayjs";

import { setIntervalSync } from "../../../core/customInterval";

import { useLanguageContext } from "../../contexts/languageContext";

import getFontSize from "../../utils/getFontSize";

require("dayjs/locale/fr");
require("dayjs/locale/en");
require("dayjs/locale/nl");
require("dayjs/locale/es");

interface ITimeProps {
	format?: string
	style: CSSProperties
}

export default function Time(props: ITimeProps) {
	const { format, style, } = props;
	const { language, } = useLanguageContext();

	const [time, setTime] = useState<string>("");
	dayjs.locale("fr");

	useEffect(() => {
		dayjs.locale(language);

		setTime(dayjs().format(format ?? "HH:mm"));

		const delay = setIntervalSync(() => {
			setTime(dayjs().format(format ?? "HH:mm"));
		}, 60 * 1000);

		return () => {
			clearInterval(delay);
		};
	}, [language]);

	return (
		<div
			style= {{
				position: "absolute",
				zIndex: 1,
				...style,
			}}
		>
			<p
				style={{
					fontSize: getFontSize(`${style.height}`),
					...style,
				}}
			>
				{time}
			</p>
		</div>
	);
}
