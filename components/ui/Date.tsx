import { useEffect, useState } from "react";
import dayjs from "dayjs";

import { setIntervalSync } from "../../../core/customInterval";

import { useLanguageContext } from "../../contexts/languageContext";

import { IStyles } from "../../interfaces";
import getFontSize from "../../utils/getFontSize";

require("dayjs/locale/fr");
require("dayjs/locale/en");
require("dayjs/locale/nl");
require("dayjs/locale/es");

interface IDateProps {
	format?: string
	style: IStyles
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
				all: style.all,
				position: "absolute",
				zIndex: 5,

				top: style.top,
				left: style.left,
				bottom: style.bottom,
				right: style.right,

				width: style.width,
				height: style.height,

				padding: style.padding,
				margin: style.margin,

				borderWidth: style.borderWidth,
				borderStyle: style.borderStyle,
				borderColor: style.borderColor,
				borderRadius: style.borderRadius,

				backgroundColor: style.backgroundColor,
			}}
		>
			<p
				style={{
					fontFamily: style.fontFamily,
					color: style.textColor,
					fontSize: style.fontSize ? style.fontSize : getFontSize(style.height),
					textAlign: style.textAlign,
				}}
			>
				{date}
			</p>
		</div>
	);
}
