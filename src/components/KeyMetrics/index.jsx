import { useState } from "react";
import { APIerrorMessageHandler } from "../../utils/helper.utils";
import { calculateefficiencyAPI } from "../../apis/metrics.apis";
import { toast } from "react-toastify";

import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import CollapsibleContainer from "./CollapsibleContainer";
import SaliencyCalculator from "./SaliencyCalculator";
import Loader from "../Loader";
import CustomButton from "../CustomButton";
export default function KeyMetrics() {
  const [collapseStates, setcollapseStates] = useState([true, false, false]);
  const [isLoading, setisLoading] = useState(false);

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
		  <CustomButton sx={{mt:2}}>Upload Data</CustomButton>
            <Stack
              direction={"row"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <CustomButton
                type="submit"
                sx={{ minWidth: "200px" }}
              >
                Calculate
              </CustomButton>
            </Stack>
          </Box>
        </CollapsibleContainer>
      </Stack>
      <Loader open={isLoading} />
    </>
  );
}
