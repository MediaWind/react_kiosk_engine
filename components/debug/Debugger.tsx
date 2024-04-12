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
					<p>firstName: {eidData.firstName}</p>
					<p>lastName: {eidData.lastName}</p>
					<p>addressStreetAndNumber: {eidData.addressStreetAndNumber}</p>
					<p>addressZip: {eidData.addressZip}</p>
					<p>addressMunicipality: {eidData.addressMunicipality}</p>
					<p>dateOfBirth: {eidData.dateOfBirth}</p>
					<p>locationOfBirth: {eidData.locationOfBirth}</p>
					<p>nationalNumber: {eidData.nationalNumber}</p>
					<p>nationality: {eidData.nationality}</p>
					<p>gender: {eidData.gender}</p>
					<p>cardNumber: {eidData.cardNumber}</p>
					<p>validityBeginDate: {eidData.validityBeginDate}</p>
					<p>validityEndDate: {eidData.validityEndDate}</p>
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
