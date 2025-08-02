import CustomTextField from "@/components/Fields/CustomTextField";
import { Button, Grid, SnackbarCloseReason } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import CustomSnackbar from "@/components/CustomSnackbar";
import { toLower } from "lodash";

const PartyAddMore = (props: any) => {
  const {
    getPartyData,
    setPartyData,
    partyData,
    partySelectedData,
    setPartySelectedData,
    resetForm,
    setResetForm,
    setShowPartyData,
    setAddPartyData,
  } = props;
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarStatus, setSnackbarStatus] = useState<string>("");
  const { handleSubmit, control, setValue, reset, watch } = useForm<any>({
    defaultValues: {
      partyName: null,
      partyAddress: null,
      representative: null,
      designation: null,
    },
  });

  const partyName = watch("partyName");
  const partyAddress = watch("partyAddress");
  const representative = watch("representative");
  const designation = watch("designation");

  useEffect(() => {
    const isAllFieldsFilled =
      partyName?.trim() &&
      partyAddress?.trim() &&
      representative?.trim() &&
      designation?.trim();
    setShowPartyData(!!isAllFieldsFilled);
    if (isAllFieldsFilled) {
      const newPartyData = {
        partyName,
        partyAddress,
        representative,
        designation,
      };
      setAddPartyData((prev: any) => {
        const updated: any = [...prev];
        const index = updated.length - 1;
        if (index >= 0) {
          updated[index] = newPartyData;
        } else {
          updated.push(newPartyData);
        }
        return updated;
      });
    }
  }, [partyName, partyAddress, representative, designation]);

  const onSubmit = (data: any) => {
    const error =
      partyData &&
      partyData.filter(
        (party: any) => toLower(party.partyName) === toLower(data?.partyName)
      );
    if (error && error.length > 0) {
      setSnackbarOpen(true);
      setSnackbarStatus("error");
    } else {
      setSnackbarOpen(true);
      setSnackbarStatus("success");
      setPartyData([...partyData, data]);
      setPartySelectedData([]);
      reset({
        partyName: "",
        partyAddress: "",
        representative: "",
        designation: "",
      });
    }
  };

  const handleSnackBarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    if (snackbarOpen) {
      timeoutId = setTimeout(() => {
        setSnackbarOpen(false);
      }, 1000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [snackbarOpen]);

  useEffect(() => {
    if (partySelectedData && partySelectedData.length > 0) {
      setValue(
        "partyName",
        partySelectedData &&
          partySelectedData[0] &&
          partySelectedData[0].partyName
      );
      setValue(
        "partyAddress",
        partySelectedData &&
          partySelectedData[0] &&
          partySelectedData[0].partyAddress
      );
      setValue(
        "representative",
        partySelectedData &&
          partySelectedData[0] &&
          partySelectedData[0].representative
      );
      setValue(
        "designation",
        partySelectedData &&
          partySelectedData[0] &&
          partySelectedData[0].designation
      );
      setShowPartyData(true);
    }
  }, [partySelectedData]);

  useEffect(() => {
    if (resetForm) {
      setPartyData([]);
      reset({
        partyName: "",
        partyAddress: "",
        representative: "",
        designation: "",
      });
      setTimeout(() => {
        setResetForm(false);
      }, 1000);
    }
  }, [resetForm]);

  return (
    <>
      {snackbarStatus !== "" && (
        <CustomSnackbar
          message={
            snackbarStatus === "success"
              ? `Party Added successfully!`
              : "The party name already exists! Please add a different one."
          }
          severity={snackbarStatus === "success" ? "success" : "error"}
          open={snackbarOpen}
          onClose={handleSnackBarClose}
        />
      )}
      <Grid
        container
        item
        spacing={2}
        component={"form"}
        onSubmit={handleSubmit(onSubmit)}
        justifyContent={"space-between"}
      >
        <Grid item xs={5.75}>
          <CustomTextField
            name="partyName"
            label="Party Name"
            placeholder="Enter a Party Name"
            control={control}
            required={true}
            rules={{
              pattern: {
                value: /^[a-zA-Z0-9\s,.:()/-]*$/,
                message: "Only Alphanumberic & hypens are allowed",
              },
              maxLength: {
                value: 20,
                message: "Party Name cannot exceed 20 characters",
              },
              required: "Party Name is required",
            }}
          />
        </Grid>
        <Grid item xs={5.75}>
          <CustomTextField
            name="partyAddress"
            label="Party Address"
            placeholder="Enter Party Address"
            control={control}
            required={true}
            rules={{
              pattern: {
                value: /^[a-zA-Z0-9\s,.:()/-]*$/,
                message: "Only Alphanumberic & hypens are allowed",
              },
              maxLength: {
                value: 100,
                message: "Party Address cannot exceed 100 characters",
              },
              required: "Party Address is required",
            }}
          />
        </Grid>
        <Grid item xs={5.75}>
          <CustomTextField
            name="representative"
            label="Representative"
            placeholder="Enter Representative"
            control={control}
            required={true}
            rules={{
              pattern: {
                value: /^[a-zA-Z0-9\s,.:()/-]*$/,
                message: "Only Alphanumberic & hypens are allowed",
              },
              maxLength: {
                value: 100,
                message: "Representative Plan cannot exceed 100 characters",
              },
              required: "Representative Plan is required",
            }}
          />
        </Grid>
        <Grid item xs={5.75}>
          <CustomTextField
            name="designation"
            label="Designation"
            placeholder="Enter Designation"
            control={control}
            required={true}
            rules={{
              pattern: {
                value: /^[a-zA-Z0-9\s,.:()/-]*$/,
                message: "Only Alphanumberic & hypens are allowed",
              },
              maxLength: {
                value: 100,
                message: "Designation Plan cannot exceed 100 characters",
              },
              required: "Designation Plan is required",
            }}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <Button
            variant="text"
            className="dubai-med text-capitalize"
            sx={{ color: "#00426A" }}
            startIcon={<AddBoxOutlinedIcon />}
            onClick={handleSubmit(onSubmit)}
          >
            {getPartyData && getPartyData.length >= 1
              ? "Add Next Party"
              : "Add Party"}
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default PartyAddMore;
