import CustomTextField from "@/components/Fields/CustomTextField";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import { Grid, Button, Typography, Box } from "@mui/material";
import React, { Fragment, useEffect, useState } from "react";
import { useFieldArray } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

const AddMore = (props: any) => {
  const { eventInformationData, setEventInformationData, control, watch } =
    props;
  const [formData, setFormData] = useState<any>({});
  const { fields, append, remove } = useFieldArray({
    control,
    name: "eventInformation",
    keyName: "id",
  });

  const watchedEventInformation = watch("eventInformation");
  const lastEventInformation =
    watchedEventInformation &&
    watchedEventInformation[watchedEventInformation.length - 1];
  const hasEmptyValues = !lastEventInformation.venue.trim();

  const handleEventCoordinatorPhone = (
    value: string,
    country: any,
    event: any
  ) => {
    const dialCode = country.dialCode;
    const phoneWithoutDialCode = value.slice(dialCode.length);
    setFormData((prevData: any) => ({
      ...prevData,
      emergencyContactNumber: phoneWithoutDialCode,
      emergencyCountryCode: dialCode,
    }));
  };

  useEffect(() => {
    setEventInformationData(watchedEventInformation);
  }, [watchedEventInformation, setEventInformationData]);

  return (
    <>
      {fields.map((item: any, index) => (
        <Fragment key={item.id}>
          <Grid item xs={12} md={5.75}>
            <CustomTextField
              name={`eventInformation.${index}.eventLocation`}
              label="Event Location"
              placeholder="Enter Event Location"
              control={control}
            />
          </Grid>
          <Grid item xs={12} md={5.75}>
            <CustomTextField
              name={`eventInformation.${index}.eventCoordinatorName`}
              label="Event Coordinator Name"
              placeholder="Enter Event Coordinator Name"
              control={control}
            />
          </Grid>
          <Grid item xs={12} md={5.75}>
            <CustomTextField
              name={`eventInformation.${index}.venue`}
              label="Venue"
              placeholder="Enter Venue"
              control={control}
              required={true}
              rules={{
                maxLength: {
                  value: 100,
                  message: "Venue cannot exceed 100 characters",
                },
                required: "Venue is required",
              }}
            />
          </Grid>
          <Grid item xs={12} md={5.75}>
            <CustomTextField
              name={`eventInformation.${index}.eventCoordinatorEmail`}
              label="Event Coordinator Email"
              placeholder="Enter Event Coordinator Email"
              control={control}
            />
          </Grid>
          <Grid item xs={12} md={5.75}>
            <CustomTextField
              name={`eventInformation.${index}.locationUrl`}
              label="Location Url"
              placeholder="Enter Location Url"
              control={control}
            />
          </Grid>
          <Grid item xs={12} md={5.75}>
            <Typography
              gutterBottom
              className="typography textfield-label bukra"
              sx={{ mt: 0.5 }}
            >
              Event Coordinator Phone
            </Typography>
            <Box className="Text-field-customise">
              <PhoneInput
                country={"ae"}
                value={`${formData.emergencyCountryCode || ""}${
                  formData.emergencyContactNumber || ""
                }`}
                onChange={handleEventCoordinatorPhone}
                searchPlaceholder="Event Coordinator Phone"
                autoFormat={false}
              />
            </Box>
          </Grid>
          {/* <Grid item xs={12} md={5.75}>
            {eventInformationData && eventInformationData.length > 1 ? (
              <Button
                variant="text"
                color="error"
                onClick={() => remove(index)}
                className="text-capitalize"
              >
                <DeleteOutlinedIcon sx={{ mr: 1 }} />
                Delete Location
              </Button>
            ) : null}
          </Grid> */}
        </Fragment>
      ))}
      <Grid item xs={12} md={6}>
        <Button
          variant="text"
          className="dubai-med text-capitalize"
          sx={{ color: "#00426A" }}
          startIcon={<AddBoxOutlinedIcon />}
          onClick={() =>
            append({
              eventLocation: "",
              eventCoordinatorName: "",
              venue: "",
              eventCoordinatorEmail: "",
              locationUrl: "",
            })
          }
          disabled={hasEmptyValues}
        >
          Add more
        </Button>
      </Grid>
    </>
  );
};

export default AddMore;
