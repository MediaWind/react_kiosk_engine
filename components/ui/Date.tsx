import { CSSProperties, useEffect, useState } from "react";
import dayjs from "dayjs";

import { setIntervalSync } from "../../../core/customInterval";

import { useLanguageContext } from "../../contexts/languageContext";

import getFontSize from "../../utils/getFontSize";

require("dayjs/locale/fr");
require("dayjs/locale/en");
require("dayjs/locale/nl");
require("dayjs/locale/es");

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
					color: style.color,
					fontSize: style.fontSize ? style.fontSize : getFontSize(`${style.height}`),
					textAlign: style.textAlign,
				}}
			>
				{date}
			</p>
		</div>
	);
}
