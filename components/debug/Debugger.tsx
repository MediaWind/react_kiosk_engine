import { eIdData } from "../../../core/hooks/useEId";

interface IDebuggerProps {
	eidData?: eIdData | null
	messages?: string[];
}

export default function Debugger(props: IDebuggerProps): JSX.Element {
	const { eidData, messages, } = props;

	return (
		<div
			style={{
				position: "relative",
				top: "0",
				left: "0",
				zIndex: "10",
				width: "fit-content",
				backgroundColor: "#ffffff",
			}}
		>
			{eidData !== undefined && (
				<>
					<p>Firstname: {eidData?.firstName ?? "no data"}</p>
					<p>Lastname: {eidData?.lastName ?? "no data"}</p>
					<p>Zip Code: {eidData?.addressZip ?? "no data"}</p>
					<p>Birth date: {eidData?.dateOfBirth ?? "no data"}</p>
					<p>Birth place: {eidData?.locationOfBirth ?? "no data"}</p>
					<p>Gender: {eidData?.gender ?? "no data"}</p>
					<p>National number: {eidData?.nationalNumber ?? "no data"}</p>
					<p>Nationality: {eidData?.nationality ?? "no data"}</p>
					<hr />
				</>
			)}

			{messages && messages.map((message, index) => {
				return <p key={index}>{message}</p>;
			})}

			<hr />
		</div>
	);
}
