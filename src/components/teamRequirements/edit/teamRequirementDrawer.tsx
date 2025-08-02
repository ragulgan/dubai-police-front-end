import React, { useEffect, useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Grid,
  Button,
  FormControl,
  MenuItem,
  Select,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Controller, useForm } from "react-hook-form";
import dayjs from "dayjs";
import _ from "lodash";
import CustomTextField from "@/components/Fields/CustomTextField";
import DropDown from "@/components/Fields/DropDown";
import { useRouter } from "next/router";
import { getLocalStorage } from "@/utils/helper";
import { useDispatch, useSelector } from "react-redux";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface TeamRequirementEditProps {
  open: boolean;
  onClose: any;
  //   module?: string;
  //   isEditData?: any;
}

const requirementTypeData = [
  { label: "Protective Gear", value: "Protective Gear" },
  { label: "Footwear", value: "Footwear" },
  { label: "Apparel & Clothing", value: "Apparel & Clothing" },
  {
    label: "Training & Performance Equipment",
    value: "Training & Performance Equipment",
  },
  { label: "Sport-Specific Equipment", value: "Sport-Specific Equipment" },
  { label: "Outdoor & Adventure Gear", value: "Outdoor & Adventure Gear" },
  { label: "Tech & Smart Gear", value: "Tech & Smart Gear" },
  { label: "Custom", value: "Custom" },
];

const TeamRequirementEditDrawer: React.FC<TeamRequirementEditProps> = ({
  open,
  onClose,
}) => {
  const router = useRouter();
  const { teamID } = router.query;
  const [isDisabled, setIsDisabled] = useState(false);

  const getSportList = useSelector((state: any) => {
    return state.getSportList;
  });

  useEffect(() => {
    if (teamID && getSportList?.data?.length) {
      const matchedSport = getSportList.data.find(
        (sport: any) => sport.sportID === Number(teamID)
      );
      if (matchedSport) {
        setValue("teamAssigned", matchedSport.sportName);
        setIsDisabled(true);
      } else {
        setIsDisabled(false);
      }
    }
  }, [teamID, getSportList]);

  const getDefaultOption = (teamsNames: any) => {
    const defaultOptions = [];
    for (const item in teamsNames) {
      defaultOptions.push({
        label: teamsNames[item].sportName,
        value: teamsNames[item].sportName,
      });
    }
    return defaultOptions;
  };

  const sportsOption = getDefaultOption(getSportList.data);

  const quantityDropdown: any = [
    {
      label: 10,
      value: 10,
    },
    {
      label: 20,
      value: 20,
    },
    {
      label: 25,
      value: 25,
    },
    {
      label: 30,
      value: 30,
    },
    {
      label: 35,
      value: 35,
    },
  ];
  const [errors, setErrors] = useState<any>({});
  const [formData, setFormData] = useState<any>({
    file: "",
  });
  const getCurrentSport = getLocalStorage("sport");
  const { handleSubmit, control, setValue, watch, getValues, reset } =
    useForm<any>({
      defaultValues: {
        requirementName: "",
        teamAssigned: null,
        type: "",
        quantityRequired: null,
      },
    });

  const timeChange = (event: any) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      type: value,
    });
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const onSubmit = (data: any) => {
    const payload: any = {
      requirementName: data?.requirementName,
      teamAssigned: data?.teamAssigned,
      type: data?.type,
      quantityRequired: Number(data?.quantityRequired),
    };
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      //   onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: "30%",
          paddingTop: "7px",
          paddingBottom: "20px",
        },
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          backgroundColor: "white",
          color: "#58585B",
          boxShadow: "none",
          borderBottom: "1px solid #ddd",
          paddingTop: "10px",
          paddingBottom: "10px",
          paddingRight: "10px",
        }}
      >
        <Typography variant="titleStyle" sx={{ px: 2 }} className="bukra">
          Edit Requirement
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{mr: 2}}>
          <CloseIcon />
        </IconButton>
      </Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid
          container
          rowSpacing={1}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          px={4}
          py={2}
          component={"form"}
        >
          <Grid
            item
            xs={12}
            sx={{
              pb: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CustomTextField
                name="requirementName"
                label="Requirement Name"
                placeholder="Enter Requirement Name"
                control={control}
                required={true}
                rules={{
                  pattern: {
                    value: /^[a-zA-Z /]*$/,
                    message: "Invalid Format",
                  },
                  maxLength: {
                    value: 100,
                    message: "Requirement Name cannot exceed 100 characters",
                  },
                  required: "Requirement name is required",
                }}
              />
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            sx={{
              pb: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <DropDown
                name="teamAssigned"
                control={control}
                label="Team Assigned"
                placeholder="Select Team"
                options={sportsOption}
                multiple={false}
                variant="outlined"
                required={true}
                rules={{
                  required: "Type is required",
                }}
                disabled={isDisabled}
              />
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            sx={{
              pb: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* <CustomTextField
                name="type"
                label="Type"
                placeholder="Enter Type"
                control={control}
                required={true}
                rules={{
                  pattern: {
                    value: /^[a-zA-Z /]*$/,
                    message: "Invalid Format",
                  },
                  maxLength: {
                    value: 100,
                    message: "Type cannot exceed 100 characters",
                  },
                  required: "Type is required",
                }}
              /> */}
              <Typography
                gutterBottom
                className="typography textfield-label bukra"
              >
                Type
                <span style={{ color: "#E4002B", marginLeft: "4px" }}>*</span>
              </Typography>

              <FormControl
                variant="outlined"
                fullWidth
                className="selectFieldContainer"
              >
                <Controller
                  name="type"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Type is required",
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <Select
                        {...field}
                        displayEmpty
                        className="Text-field-customise"
                        IconComponent={() => (
                          <ExpandMoreIcon style={{ marginRight: "10px" }} />
                        )}
                        onChange={(e) => {
                          field.onChange(e);
                          timeChange(e);
                        }}
                      >
                        <MenuItem value="" disabled>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            style={{
                              height: 27,
                              fontFamily: "Dubai",
                              fontSize: "16px",
                              fontWeight: 500,
                              lineHeight: "25.01px",
                              textAlign: "left",
                              marginLeft: 10,
                            }}
                          >
                            Select Type
                          </Typography>
                        </MenuItem>
                        {requirementTypeData.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            <Typography
                              variant="body1"
                              color="textPrimary"
                              style={{
                                height: 27,
                                fontFamily: "Dubai",
                                fontSize: "16px",
                                fontWeight: 500,
                                lineHeight: "25.01px",
                                textAlign: "left",
                                marginLeft: 10,
                              }}
                            >
                              {option.label}
                            </Typography>
                          </MenuItem>
                        ))}
                      </Select>
                      {error && (
                        <Typography
                          sx={{
                            color: "#d32f2f",
                            fontSize: "12px",
                            marginTop: "4px !important",
                          }}
                          className="dubai-med"
                        >
                          Type is Required
                        </Typography>
                      )}
                    </>
                  )}
                />
              </FormControl>
              {formData?.type === "Custom" ? (
                <>
                  <Box sx={{ paddingTop: "10px" }}>
                    <CustomTextField
                      name="customType"
                      label="Custom Type"
                      placeholder="Enter Custom Type"
                      control={control}
                      required={true}
                      rules={{
                        pattern: {
                          value: /^[a-zA-Z /]*$/,
                          message: "Invalid Format",
                        },
                        maxLength: {
                          value: 100,
                          message: "Custom Type cannot exceed 100 characters",
                        },
                        required: "Custom Type is required",
                      }}
                    />
                  </Box>
                </>
              ) : null}
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            sx={{
              pb: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <DropDown
                name="quantityRequired"
                control={control}
                label="Quantity Required"
                placeholder="Select Quantity"
                options={quantityDropdown}
                multiple={false}
                variant="outlined"
                required={true}
                rules={{
                  required: "Quantity is required",
                }}
              />
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            sx={{
              pb: 1,
            }}
          >
            <Box
              display="flex"
              justifyContent={"end"}
              sx={{
                marginY: "1.5rem",
              }}
            >
              <Button
                variant="outlined"
                color="secondary"
                sx={{
                  mr: 1,
                  width: "112px",
                  height: "48px",
                  borderRadius: "4px",
                  gap: "0px",
                }}
                onClick={() => {
                  router.push(`/teams/${getCurrentSport}/teamRequirements`);
                }}
                className="cancel-button text-capitalize"
              >
                Back
              </Button>
              <Button
                type="submit"
                variant="contained"
                className="text-capitalize cancel-button"
                sx={{
                  width: "112px",
                  height: "48px",
                  borderRadius: "4px",
                  gap: "0px",
                }}
                // disabled={trainingUpdateData.loading}
                onClick={handleSubmit(onSubmit)}
              >
                Save
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Drawer>
  );
};

export default TeamRequirementEditDrawer;
