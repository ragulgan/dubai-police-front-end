import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton
} from "@mui/material";
import axios from "axios";
import { isEmpty } from "lodash";
import React, { useEffect } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import CustomTextField from "../Fields/CustomTextField";
import DropDown from "../Fields/DropDown";
import CustomAntSwitch from "./CustomAntSwitch";
import { handleAdminSetting } from "@/redux/slices/appSplice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";

interface UpdateSportDialogProps {
  open: boolean;
  onClose: () => void;
  onUpdate: any;
  sport: any;
}

const UpdateSportDialog: React.FC<UpdateSportDialogProps> = ({ open, onClose, onUpdate, sport }) => {
  console.log({ onUpdate, sport });
  const dispatch: AppDispatch = useDispatch();
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    setFocus,
  } = useForm({
    defaultValues: {
      sportName: "",
      categoryType: "",
      isActive: false,
      orderId: "",

    },
  });

  useEffect(() => {
    if (!isEmpty(sport)) {
      setValue('sportName', sport.sportName);
      setValue('categoryType', sport.categoryType);
      setValue('isActive', sport.isActive);
      setValue('orderId', sport.orderId);
    }
  }, [sport])



  const onSubmit: SubmitHandler<FieldValues> = async (formData) => {
    console.log({ formData });
    const payload = {
      ...formData,
      isActive: formData.isActive ? 1 : 0
    }
    const response = await axios.put(
      `${process.env.API_BASE_URL}/settings/sports/${sport.sportId}`,
      payload
    );

    console.log({ response });

    if (response.data.responseCode === 200) {
      console.log('in----------------------------');

      onUpdate(true)
      dispatch(handleAdminSetting(true));
    }
    onClose();
    // onUpdate(false);
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      {/* Title */}
      <DialogTitle
        sx={{ m: 0, p: 2 }}
        id="customized-dialog-title"
        className="bukra dialogBox-delete-title"
      >Update Sport</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={(theme) => ({
          position: "absolute",
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon color="inherit" />
      </IconButton>
      <Divider />
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}

      >
        {/* Content */}
        <DialogContent sx={{ pt: 2 }}>
          <Grid container spacing={2}>
            {/* Sport Name (Left) */}
            <Grid item xs={6}>
              <CustomTextField
                name="sportName"
                control={control}
                label="Sports Name"
                placeholder="Enter Sports Name"
                rules={{
                  required: "Sports Name is required",
                  pattern: {
                    value: /^[a-zA-Z\u0600-\u06FF\s]+$/,
                    message: "Only letters and spaces are allowed",
                  },
                  maxLength: {
                    value: 50,
                    message: "Sports Name cannot exceed 50 characters",
                  },
                }}
              />
            </Grid>

            {/* Category Dropdown (Right) */}
            <Grid item xs={6}>
              <DropDown
                name="categoryType"
                label="Category Type"
                control={control}
                options={[
                  { label: 'Category A', value: 'A', },
                  { label: 'Category B', value: 'B', },
                  { label: 'Category C', value: 'C', }
                ]}
                variant="outlined"
              //   required={true}
              />
            </Grid>
            <Grid item xs={6}>
              <CustomAntSwitch
                label="Status"
                control={control}
                name='isActive'
              />

            </Grid>
            <Grid item xs={6}>
              <DropDown
                name="orderId"
                label="Sports Order"
                control={control}
                options={Array.from({ length: 27 }, (_, i) => ({
                  label: i + 1,
                  value: i + 1,
                }))}
                variant="outlined"
              //   required={true}
              />
            </Grid>
          </Grid>
        </DialogContent>

        {/* Actions */}
        <DialogActions>
          <Button onClick={onClose} variant="outlined" color="secondary">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
          >
            Update
          </Button>

        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default UpdateSportDialog;
