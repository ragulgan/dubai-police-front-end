import CustomRadioButton from '@/components/commanderShield/create/CustomRadioButton';
import CustomRadioButtonTeam from '@/components/commanderShield/create/CustomRadioButtonTeam';
import CustomRadioGroup from '@/components/Fields/CustomRadioGroup';
import CustomTextField from '@/components/Fields/CustomTextField';
import DropDown from '@/components/Fields/DropDown';
import TextSunEditor from '@/components/SunEditor';
import FormWithSunEditor from '@/components/useFormSunEditor';
import { Box, Button, Grid, IconButton, Typography } from '@mui/material';
import React from 'react'
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

const CreateDepartmentForm = () => {
  const { handleSubmit, control, setValue, reset, watch, setError, clearErrors } = useForm<any>({
    defaultValues: {
      departmentName: "",
      teamSize: "",
      departmentLocation: "",
      email: "",
      phoneNumber: "",
      description: null,
    },
  });

  const onSubmit = () => {
  };

  // Add Department
  const addDepartment = useSelector((state: any) => {
    return state.addDepartment;
  });

  return (
    <Grid container spacing={0} px={5} py={2}>
      <Box sx={{ width: "100%", paddingTop: "10px" }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid
            container
            item
            xs={12}
            md={12}
            spacing={2}
            justifyContent={"space-between"}
            component={"form"}
          >
            <Grid item xs={12} md={5.75}>
              <CustomTextField
                name="departmentName"
                label="Department Name"
                placeholder="Enter Department Name"
                control={control}
                required={true}
                rules={{
                  pattern: {
                    value: /^[a-zA-Z0-9\s,.:()/-]*$/,
                    message: "Only Alphanumberic & hypens are allowed",
                  },
                  maxLength: {
                    value: 50,
                    message: "Department Name cannot exceed 50 characters",
                  },
                  required: "Department Name is required",
                }}
              />
            </Grid>
            <Grid item xs={12} md={5.75} >
              <CustomTextField
                name="teamSize"
                label="Team Size"
                placeholder="Enter Team Size"
                control={control}
                required={true}
                rules={{
                  pattern: {
                    value: /^[a-zA-Z0-9\s,.:()/-]*$/,
                    message: "Only Alphanumberic & hypens are allowed",
                  },
                  maxLength: {
                    value: 50,
                    message: "Team Size cannot exceed 50 characters",
                  },
                  required: "Team Size is required",
                }}
              />
            </Grid>
            <Grid
              item
              xs={12}
              md={5.75}
            >
              <CustomTextField
                name="departmentLocation"
                label="Department Location"
                placeholder="Enter Department Location"
                control={control}
              />
            </Grid>
            <Grid item xs={12} md={5.75}>
              <CustomTextField
                name="email"
                label="Email"
                placeholder="Enter Email"
                control={control}
                required={true}
                rules={{
                  pattern: {
                    value: /^[a-zA-Z0-9\s,.:()/-]*$/,
                    message: "Only Alphanumberic & hypens are allowed",
                  },
                  maxLength: {
                    value: 50,
                    message: "Email cannot exceed 50 characters",
                  },
                  required: "Email is required",
                }}
              />
            </Grid>

            <Grid
              item
              xs={12}
              md={5.75}
            >
              <CustomTextField
                name="phoneNumber"
                label="Phone Number"
                placeholder="Enter Phone Number"
                control={control}
                required={true}
                rules={{
                  pattern: {
                    value: /^[a-zA-Z0-9\s,.:()/-]*$/,
                    message: "Only Alphanumberic & hypens are allowed",
                  },
                  maxLength: {
                    value: 50,
                    message: "Phone Number cannot exceed 50 characters",
                  },
                  required: "Phone Number is required",
                }}
              />
            </Grid>
            <Grid item xs={12} md={5.75}>
              <FormWithSunEditor
                name="description"
                control={control}
                minHeight={"200px"}
                label="Description"
                placeholder="Add information about department"
              />
            </Grid>
          </Grid>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mt: "20px"
            }}
          >
            <Button
              variant="outlined"
              color="error"
              sx={{
                marginRight: "8px",
                height: "48px",
                borderRadius: "4px",
                gap: "0px",
                fontSize: "16px",
              }}
              // onClick={handleCancel}
              className="cancel-button text-capitalize dubai-med"
            >
              Back
            </Button>
            <Button
              type="submit"
              variant="contained"
              className="text-capitalize dubai-med cancel-button"
              sx={{
                height: "48px",
                borderRadius: "4px",
                gap: "0px",
                fontSize: "16px",
              }}
              onClick={handleSubmit(onSubmit)}
            >
              Save
            </Button>
          </Box>
        </form>
      </Box>
    </Grid>
  )
}

export default CreateDepartmentForm;