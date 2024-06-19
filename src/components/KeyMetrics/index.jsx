import { useState } from "react";

import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import CollapsibleContainer from "./CollapsibleContainer";
import SaliencyCalculator from "./SaliencyCalculator";

export default function KeyMetrics() {
	const [collapseStates, setcollapseStates] = useState([true, false, false]);

	const toggleState = (index) => {
		setcollapseStates((prev) => {
			const newState = [...prev];
			newState[index] = !newState[index];
			return newState;
		});
	};

	return (
		<Stack gap={3}>
			<CollapsibleContainer
				open={collapseStates[0]}
				onToggle={toggleState.bind(this, 0)}
				title={"Estimate Saliency Score"}>
				<Box>
					<SaliencyCalculator />
				</Box>
			</CollapsibleContainer>
			<CollapsibleContainer
				open={collapseStates[1]}
				onToggle={toggleState.bind(this, 1)}
				title={"Estimate Efficiency Score"}>
				<Typography>Calculate Efficiency Score</Typography>
			</CollapsibleContainer>
			<CollapsibleContainer
				open={collapseStates[2]}
				onToggle={toggleState.bind(this, 2)}
				title={"Estimate Impressions"}>
				<Typography>Calculate Impressions</Typography>
			</CollapsibleContainer>
		</Stack>
	);
}
