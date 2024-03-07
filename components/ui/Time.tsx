import { CSSProperties, useEffect, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale";

import { setIntervalSync } from "../../../core/customInterval";

import { useLanguageContext } from "../../contexts/languageContext";

import getFontSize from "../../utils/getFontSize";

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
					fontFamily: style.fontFamily,
					fontSize: style.fontSize ?? getFontSize(`${style.height}`),
					color: style.color,
					textAlign: style.textAlign,
				}}
			>
				{time}
			</p>
		</div>
	);
}
