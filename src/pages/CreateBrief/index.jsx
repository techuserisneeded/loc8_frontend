import React, { useState, forwardRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
	FormControl,
	Paper,
	TextField,
	Grid,
	Box,
	Stack,
	FormLabel,
	Typography,
	IconButton,
	Select,
	MenuItem,
} from "@mui/material";
import DatePicker from "react-datepicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { toast } from "react-toastify";
import { useDropzone } from "react-dropzone";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import AreaSelector from "../../components/AreaSelector";
import CustomButton from "../../components/CustomButton";
import BriefForm, {
	defaultBudget,
	defaultFormState,
} from "../../components/BriefForm";
import SuperAdminLayout from "../../layouts/SuperAdminLayout";

import { createBrief } from "../../apis/briefs.apis";

import "react-datepicker/dist/react-datepicker.css";

const DateInput = forwardRef(({ value, onClick }, ref) => (
	<TextField value={value} onClick={onClick} ref={ref} />
));

const CreateBrief = () => {
	const navigate = useNavigate();

	const [budgets, setbudgets] = useState([defaultBudget]);
	const [isLoading, setisLoading] = useState(false);
	const [formState, setformState] = useState({
		isImmediate: 0,
		startDate: "",
		specialNotes: "",
		mediaApproach: "",
		category: "",
		brand: "",
		targetAud: "",
		campObj: "",
		brandLogo: null,
	});
	const [focusedBudgetErrorField, setFocusedBudgetErrorField] = useState({
		index: 0,
		msg: "",
		field: "",
	});

	const onDrop = useCallback((acceptedFiles) => {
		const file = acceptedFiles[0];

		if (!file) {
			return;
		}

		const reader = new FileReader();

		reader.onload = (e) => {
			setformState((prev) => ({
				...prev,
				brandLogo: file,
				previewSrc: e.target.result,
			}));
		};

		reader.readAsDataURL(file);
	}, []);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		maxFiles: 1,
		accept: {
			"image/*": [".jpg", ".png", ".jpeg"],
		},
	});

	const totalBudgets = budgets.reduce(
		(acc, obj) => {
			const currentZoneTotal = parseFloat(acc[obj.zone.label]);
			const budget = parseFloat(obj.budget);

			if (!isNaN(budget) && !isNaN(currentZoneTotal)) {
				acc[obj.zone.label] = currentZoneTotal + budget;
			}

			return acc;
		},
		{
			North: 0,
			South: 0,
			West: 0,
			East: 0,
			"North East": 0,
		}
	);

	const handleChange = (e) => {
		const name = e.target.name;
		const value = e.target.value;

		setformState((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const addBudget = () => {
		setbudgets((prev) => [...prev, { ...defaultBudget, id: prev.length + 1 }]);
	};

	const removeBudget = (id) => {
		setbudgets((prev) => prev.filter((v) => v.id !== id));
	};

	const setDate = (v) => {
		setformState((prev) => ({
			...prev,
			startDate: v,
		}));
	};

	const handleBudgetAreaChange = (index, val) => {
		setbudgets((prev) => {
			const newData = [...prev];
			newData[index] = {
				...newData[index],
				...val,
			};
			return newData;
		});

		setFocusedBudgetErrorField({});
	};

	const handleBudgetChange = (index, e) => {
		const value = e.target.value?.trim();
		setbudgets((prev) => {
			const newData = [...prev];
			newData[index] = {
				...newData[index],
				budget: value,
			};
			return newData;
		});
	};

	const handleSubmit = async (fd) => {
		try {
			await createBrief(fd);
			toast.success("Created Successfully!");
			navigate("/");
		} catch (e) {
			let msg = "Something went wrong!";

			if (e.response && e.response?.data?.message) {
				msg = e.response?.data?.message;
			}

			toast.error(msg);
		}
	};

	return (
		<SuperAdminLayout activeLink={"/create-brief"}>
			<BriefForm
				initialBudgetState={[defaultBudget]}
				initialFormState={defaultFormState}
				onSubmit={handleSubmit}
			/>
		</SuperAdminLayout>
	);
};

export default CreateBrief;

function SectionTitle({ children }) {
	return (
		<Box
			padding={1}
			sx={{
				backgroundColor: "#f5ddba",
			}}
			width={"100%"}>
			<Typography variant="body" mb={1}>
				{children}
			</Typography>
		</Box>
	);
}

function SectionContainer(params) {
	return <Box padding={3} {...params} />;
}
