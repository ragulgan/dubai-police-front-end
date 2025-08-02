import React from 'react'
import CustomTextField from '@/components/Fields/CustomTextField'
import { Box, Button, Grid, Paper, Typography } from '@mui/material'
import { useForm } from 'react-hook-form';

const ParticipationAndEngagement = () => {

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

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Typography
          variant="body1"
          component="div"
          color="primary"
          sx={{
            fontWeight: "bold",
            color: "#008755",
            mt: "30px",
            mb: "20px"
          }}
          className="app-bar-menu-name bukra"
        >
          Total Participation Points: 0/10
        </Typography>
        <Paper elevation={0} sx={{ p: 0, maxWidth: 600, mx: 'auto' }}>
          <Grid container spacing={2} mb={2}>
            <React.Fragment>
              <Grid item xs={9}>
                <CustomTextField
                  name="awarenessProgram"
                  label="Awareness Programs"
                  placeholder="Enter Points"
                  control={control}
                  required={true}
                  rules={{
                    pattern: {
                      value: /^[a-zA-Z0-9\s,.:()/-]*$/,
                      message: "Only Alphanumeric & hyphens are allowed",
                    },
                    maxLength: {
                      value: 50,
                      message: "Points cannot exceed 50 characters",
                    },
                    required: "Points is required",
                  }}
                />
              </Grid>
              <Grid item xs={3}>
                <CustomTextField
                  name="percentageAwareness"
                  label="Percentage"
                  placeholder="Auto Calculated"
                  control={control}
                  disabled={true}
                />
              </Grid>
            </React.Fragment>
          </Grid>

          <Grid container spacing={2} mb={2}>
            <React.Fragment>
              <Grid item xs={9}>
                <CustomTextField
                  name="fitnessPrograms"
                  label="Fitness Programs"
                  placeholder="Enter Points"
                  control={control}
                  required={true}
                  rules={{
                    pattern: {
                      value: /^[a-zA-Z0-9\s,.:()/-]*$/,
                      message: "Only Alphanumeric & hyphens are allowed",
                    },
                    maxLength: {
                      value: 50,
                      message: "Points cannot exceed 50 characters",
                    },
                    required: "Points is required",
                  }}
                />
              </Grid>
              <Grid item xs={3}>
                <CustomTextField
                  name="percentageFitness"
                  label="Percentage"
                  placeholder="Auto Calculated"
                  control={control}
                  disabled={true}
                />
              </Grid>
            </React.Fragment>
          </Grid>

          <Grid container spacing={2} mb={2}>
            <React.Fragment>
              <Grid item xs={9}>
                <CustomTextField
                  name="trainingCourses"
                  label="Training Courses"
                  placeholder="Enter Points"
                  control={control}
                  required={true}
                  rules={{
                    pattern: {
                      value: /^[a-zA-Z0-9\s,.:()/-]*$/,
                      message: "Only Alphanumeric & hyphens are allowed",
                    },
                    maxLength: {
                      value: 50,
                      message: "Points cannot exceed 50 characters",
                    },
                    required: "Points is required",
                  }}
                />
              </Grid>
              <Grid item xs={3}>
                <CustomTextField
                  name="percentageTraining"
                  label="Percentage"
                  placeholder="Auto Calculated"
                  control={control}
                  disabled={true}
                />
              </Grid>
            </React.Fragment>
          </Grid>

          <Grid container spacing={2} mb={2}>
            <React.Fragment>
              <Grid item xs={9}>
                <CustomTextField
                  name="eventAndInitiatives"
                  label="Events & Initiatives"
                  placeholder="Enter Points"
                  control={control}
                  required={true}
                  rules={{
                    pattern: {
                      value: /^[a-zA-Z0-9\s,.:()/-]*$/,
                      message: "Only Alphanumeric & hyphens are allowed",
                    },
                    maxLength: {
                      value: 50,
                      message: "Points cannot exceed 50 characters",
                    },
                    required: "Points is required",
                  }}
                />
              </Grid>
              <Grid item xs={3}>
                <CustomTextField
                  name="percentageEvents"
                  label="Percentage"
                  placeholder="Auto Calculated"
                  control={control}
                  disabled={true}
                />
              </Grid>
            </React.Fragment>
          </Grid>

          <Grid container spacing={2} mb={2}>
            <React.Fragment>
              <Grid item xs={9}>
                <CustomTextField
                  name="competitions"
                  label="Competitions"
                  placeholder="Enter Points"
                  control={control}
                  required={true}
                  rules={{
                    pattern: {
                      value: /^[a-zA-Z0-9\s,.:()/-]*$/,
                      message: "Only Alphanumeric & hyphens are allowed",
                    },
                    maxLength: {
                      value: 50,
                      message: "Points cannot exceed 50 characters",
                    },
                    required: "Points is required",
                  }}
                />
              </Grid>
              <Grid item xs={3}>
                <CustomTextField
                  name="percentageCompetitions"
                  label="Percentage"
                  placeholder="Auto Calculated"
                  control={control}
                  disabled={true}
                />
              </Grid>
            </React.Fragment>
          </Grid>

          <Box display="flex" justifyContent="flex-end" mt={5} gap={2}>
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
              Cancel
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
              update
            </Button>
          </Box>
        </Paper>
      </form>
    </Box>
  )
}

export default ParticipationAndEngagement