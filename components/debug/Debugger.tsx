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
				position: "absolute",
				top: "0",
				left: "0",
				zIndex: "10",
				width: "fit-content",
				backgroundColor: "#ffffff",
			}}
		>
			<h1>eId data</h1>
			{eidData ?
				<>
					<p>Firstname: {eidData.firstName}</p>
					<p>Lastname: {eidData.lastName}</p>
					<p>Zip Code: {eidData.addressZip}</p>
					<p>Birth date: {eidData.dateOfBirth}</p>
					<p>Birth place: {eidData.locationOfBirth}</p>
					<p>Gender: {eidData.gender}</p>
					<p>National number: {eidData.nationalNumber}</p>
					<p>Nationality: {eidData.nationality}</p>
				</> :
				<p>no data</p>
			}
			<hr />

			{messages && messages.map((message, index) => {
				return <p key={index}>{message}</p>;
			})}

			<hr />
		</div>
	);
}
