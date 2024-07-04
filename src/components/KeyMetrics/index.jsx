import { useState } from "react";
import { APIerrorMessageHandler } from "../../utils/helper.utils";
import {
  calculateefficiencyAPI,
  calculateImpressionAPI,
  estimateImpressionAPI,
} from "../../apis/metrics.apis";
import { toast } from "react-toastify";
import Papa from "papaparse";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CollapsibleContainer from "./CollapsibleContainer";
import SaliencyCalculator from "./SaliencyCalculator";
import Loader from "../Loader";
import CustomButton from "../CustomButton";
import { Button, styled } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function KeyMetrics() {
  const [collapseStates, setcollapseStates] = useState([true, false, false]);
  const [isLoading, setisLoading] = useState(false);
  const [data, setData] = useState([]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    Papa.parse(file, {
      header: true, // If your CSV has headers
      complete: (result) => {
        setData(result.data);
      },
    });
  };

  const handleFileSubmit = async (e) => {
    e.preventDefault();
    if (data.length == 0) {
      alert("Please select a file");
      return;
    }
    setisLoading(true);
    const body = {
      data: data,
    };

    try {
      await calculateImpressionAPI(body);
      toast.success("Impression Added successfully!");
    } catch (error) {
      APIerrorMessageHandler(error);
    } finally {
      setisLoading(false);
    }
  };

  const handleEstimateImpression = async(e) => {
    e.preventDefault();
    setisLoading(true);
    try {
      await estimateImpressionAPI();
      toast.success("Impression Estimated successfully!");
    } catch (error) {
      APIerrorMessageHandler(error);
    } finally {
      setisLoading(false);
    }
  }

  
  const toggleState = (index) => {
    setcollapseStates((prev) => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setisLoading(true);
    try {
      await calculateefficiencyAPI();

      toast.success("Efficiency set successfully!");
    } catch (error) {
      APIerrorMessageHandler(error);
    } finally {
      setisLoading(false);
    }
  };
  return (
    <>
      <Stack gap={3}>
        <CollapsibleContainer
          open={collapseStates[0]}
          onToggle={toggleState.bind(this, 0)}
          title={"Estimate Saliency Score"}
        >
          <Box>
            <SaliencyCalculator setisLoading={setisLoading} />
          </Box>
        </CollapsibleContainer>
        <CollapsibleContainer
          open={collapseStates[1]}
          onToggle={toggleState.bind(this, 1)}
          title={"Estimate Efficiency Score"}
        >
          <Typography>Calculate Efficiency Score</Typography>
          <Stack
            direction={"row"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <CustomButton
              type="submit"
              onClick={handleSubmit}
              sx={{ minWidth: "200px" }}
            >
              Calculate
            </CustomButton>
          </Stack>
        </CollapsibleContainer>
        <CollapsibleContainer
          open={collapseStates[2]}
          onToggle={toggleState.bind(this, 2)}
          title={"Estimate Impressions"}
        >
          <Typography>Calculate Impressions</Typography>
          <Box>
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
            >
              Upload file
              <VisuallyHiddenInput type="file" onChange={handleFileChange}  />
            </Button>
            <Stack
              direction={"row"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <CustomButton
                onClick={handleFileSubmit}
                sx={{ minWidth: "200px" }}
              >
                Add impression
              </CustomButton>
            </Stack>
            <Stack justifyContent={"center"} alignItems={"center"} mt={5}>
              <CustomButton onClick={handleEstimateImpression} component="label" role={undefined} variant="contained">
                Estimate Impression
              </CustomButton>
            </Stack>
          </Box>
        </CollapsibleContainer>
      </Stack>
      <Loader open={isLoading} />
    </>
  );
}
