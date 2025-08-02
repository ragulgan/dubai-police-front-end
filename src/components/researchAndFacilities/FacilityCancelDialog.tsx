import { Box, Button, Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from "@mui/icons-material/Close";
import FormWithSunEditor from '../useFormSunEditor';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { cancelFacilitiesByID } from '@/redux/slices/researchFacilities/cancellingFacilitiesByID';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

type FacilityCancelDialogProps = {
  open: boolean;
  facilityID: number;
  onClose: () => void;
}

const FacilityCancelDialog: React.FC<FacilityCancelDialogProps> = ({ facilityID, open, onClose }) => {
  const dispatch: any = useDispatch();

  const { handleSubmit, control, reset } = useForm<any>({
    defaultValues: {
      reasonForCancelBooking: ""
    },
  });

  const onSubmit = (data: any) => {
    const payload = {
      facilityID: Number(facilityID),
      cancelByID: "40",
      cancelByModule: "Coach",
      cancelReason: data?.reasonForCancelBooking,
      
    };
    dispatch(
      cancelFacilitiesByID({ url: "/CancelingReasonForFacilities", payload: payload })
    );
    reset();
  }


  return (<>
    <BootstrapDialog
      onClose={onClose}
      open={open}
      aria-labelledby="cancel-dialog-title"
      sx={{
        borderRadius: "16px",
        "& .MuiPaper-root": {
          width: "550px",
          height: "422px",
          borderRadius: "16px"
        }
      }}
    >
      <DialogTitle
        className="bukra"
        sx={{ m: 0, p: 2, fontSize: "16px", lineHeight: "19.2px", fontWeight: 500, color: "#000000" }}
      >
        Cancel Reason
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{ position: "absolute", right: 8, top: 8, color: "grey" }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormWithSunEditor
            name="reasonForCancelBooking"
            control={control}
            minHeight={"200px"}
            placeholder="Enter Cancel Reason"
          />
        </form>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button
            className="dubai-med"
            variant="contained"
            sx={{
              textTransform: "none",
              backgroundColor: "#58585B",
              color: "#FFFFFF",
              width: "140px",
              height: "48px",
              gap: "8px",
              borderRadius: "4px",
              padding: "12px 15px",
              fontSize: "16px",
              fontWeight: 500
            }}
            onClick={handleSubmit(onSubmit)}
          >
            Cancel Booking
          </Button>
        </Box>
      </DialogContent>
    </BootstrapDialog>
  </>)
}

export default FacilityCancelDialog;