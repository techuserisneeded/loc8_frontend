import React, { useState, forwardRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useSWR from "swr";
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
import Loader from "../../components/Loader";
import BriefForm, {
	defaultBudget,
	defaultFormState,
} from "../../components/BriefForm";
import SuperAdminLayout from "../../layouts/SuperAdminLayout";

import {
	createBrief,
	getBriefDetailsByBriefIdAPI,
} from "../../apis/briefs.apis";

import "react-datepicker/dist/react-datepicker.css";

const DateInput = forwardRef(({ value, onClick }, ref) => (
	<TextField value={value} onClick={onClick} ref={ref} />
));

const EditBrief = () => {
	const navigate = useNavigate();
	const { brief_id } = useParams();

	const { data, isLoading, error } = useSWR(
		brief_id ? "briefs/briefs/" + brief_id : null,
		getBriefDetailsByBriefIdAPI.bind(this, brief_id)
	);

	const initialBudgets = data?.budgets?.map((v) => {
		return {
			...v,
			zone: {
				label: v.zone_name,
				id: v.zone_id,
				value: v.zone_id,
			},
			state: {
				label: v.state_name,
				id: v.state_id,
				value: v.state_id,
			},
			city: {
				label: v.city_name,
				id: v.city_id,
				value: v.city_id,
			},
		};
	}) || [defaultBudget];

	const initialFormState = {
		isImmediate: data?.is_immediate_camp || 0,
		startDate: data?.startDate || "",
		specialNotes: data?.notes || "",
		mediaApproach: data?.media_approach || "",
		category: data?.category || "",
		brand: data?.brand_name || "",
		targetAud: data?.target_audience || "",
		campObj: data?.campaign_obj || "",
		brandLogo: null,
	};

	const [budgets, setbudgets] = useState([]);
	// const [isLoading, setisLoading] = useState(false);
	const [formState, setformState] = useState();
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
			// await createBrief(fd);
			// toast.success("Created Successfully!");
			// navigate("/");
		} catch (e) {
			// let msg = "Something went wrong!";
			// if (e.response && e.response?.data?.message) {
			// 	msg = e.response?.data?.message;
			// }
			// toast.error(msg);
		}
	};

	return (
		<SuperAdminLayout activeLink={"/"}>
			<BriefForm
				initialBudgetState={initialBudgets}
				initialFormState={initialFormState}
				onSubmit={handleSubmit}
				submitButtonText="save"
			/>
			<Loader open={isLoading} />
		</SuperAdminLayout>
	);
};

export default EditBrief;
