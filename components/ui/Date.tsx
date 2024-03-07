import { CSSProperties, useEffect, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/en";
import "dayjs/locale/fr";
import "dayjs/locale/nl";
import "dayjs/locale/es";

import { setIntervalSync } from "../../../core/customInterval";
import capitalizeFirstLetter from "../../../core/utils/capitalizeFirstLetter";

import { useLanguageContext } from "../../contexts/languageContext";

import getFontSize from "../../utils/getFontSize";

interface IDateProps {
	format?: string
	style: CSSProperties
}

export default function Date(props: IDateProps): JSX.Element {
	const { format, style, } = props;
	const { language, } = useLanguageContext();

	const [date, setDate] = useState<string>("");
	dayjs.locale("fr");

	useEffect(() => {
		dayjs.locale(language);

		setDate(dayjs().format(format ?? "DD/MM/YYYY"));

		const delay = setIntervalSync(() => {
			setDate(dayjs().format(format ?? "DD/MM/YYYY"));
		}, 30 * 60 * 1000);

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
				{capitalizeFirstLetter(date)}
			</p>
		</div>
	);
}
