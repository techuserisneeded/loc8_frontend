import Card from "@mui/material/Card";
import Collapse from "@mui/material/Collapse";
import CardHeader from "@mui/material/CardHeader";
import Container from "@mui/material/Container";
import CardContent from "@mui/material/CardContent";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import IconButton from "@mui/material/IconButton";

export default function CollapsibleContainer({
	onToggle,
	open,
	children,
	title,
}) {
	const handleToggle = () => {
		onToggle?.();
	};

	return (
		<Card
			sx={{
				minWidth: 300,
				border: "1px solid rgba(211,211,211,0.6)",
			}}>
			<CardHeader
				title={title}
				action={
					<IconButton onClick={handleToggle} aria-label="expand" size="small">
						{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
					</IconButton>
				}></CardHeader>
			<div
				style={{
					backgroundColor: "rgba(211,211,211,0.4)",
				}}>
				<Collapse in={open} timeout="auto" unmountOnExit>
					<CardContent>
						<Container
							sx={{
								minHeight: 100,
							}}>
							{children}
						</Container>
					</CardContent>
				</Collapse>
			</div>
		</Card>
	);
}
