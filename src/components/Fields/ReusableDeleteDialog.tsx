"use client";

import * as React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import { Box, CircularProgress, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Image from "next/image";
import { useEffect } from "react";
import CustomButton from "../buttons/CustomButton";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const ReusableDeleteDialog: React.FC<any> = ({
  title,
  successMessage,
  icon = <DeleteIcon />,
  deleteAction,
  fetchAfterDelete,
  deleteResponse,
  payload,
  revertMessage,
  clearDeleteState,
  width,
  height,
  minHeight,
  css,
  module,
  buttonIcon,
  btnBorderColor,
  btnColor,
  btnBgColor,
  btnLabel,
}) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = (e: React.MouseEvent) => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    clearDeleteState?.();
    // fetchAfterDelete?.();
  };

  useEffect(() => {
    if (deleteResponse?.code === 200) {
      const timer = setTimeout(() => {
        clearDeleteState?.();
        setOpen(false);
        fetchAfterDelete?.();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [deleteResponse]);

  const handleDelete = () => {
    deleteAction?.(payload);
  };

  return (
    <>
      {module === "news" || module === "mou" ? (
        <CustomButton
          sx={{
            backgroundColor: module === "mou" ? "transparent" : "#FFFFFF",
            color: module === "mou" ? "#FFFFFF" : "#58585B",
            borderColor: module === "mou" ? "#FFFFFF" : "#58585B",
            borderWidth: 1,
            fontSize: "16px",
            fontWeight: 500,
          }}
          label="Delete"
          variant="outlined"
          size="large"
          ButtonIcon={DeleteIcon}
          iconPosition="start"
          onClick={handleClickOpen}
          module="news"
        />
      ) : buttonIcon ? (
        <CustomButton
          sx={{
            backgroundColor: btnBgColor,
            color: btnColor,
            borderColor: btnBorderColor,
            borderWidth: 1,
            fontSize: "16px",
            fontWeight: 500,
          }}
          label={btnLabel}
          variant="outlined"
          size="large"
          ButtonIcon={DeleteIcon}
          iconPosition="start"
          onClick={handleClickOpen}
          module="news"
        />
      ) : (
        <Tooltip title={"Delete"}>
          <IconButton
            aria-label="delete"
            size="small"
            onClick={handleClickOpen}
            sx={{
              ...(css
                ? {
                  backgroundColor: "transparent",
                  color: "#008755",
                  border: "1px solid #008755",
                  borderRadius: 1,
                  "&:hover": {
                    backgroundColor: "#fff",
                  },
                  width:
                    title === "Reward"
                      ? "93px"
                      : module === "research"
                        ? "110px"
                        : "75px",
                  padding: "4px 4px",
                  minHeight: minHeight ? minHeight : "48px",
                }
                : {
                  width: width ? width : "16px",
                  height: height ? height : "16px",
                  color: "#05868E",
                }),
            }}
          >
            {icon}
          </IconButton>
        </Tooltip>
      )}

      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        className="dialog-width"
        onClick={(e) => e.stopPropagation()}
        style={{ zIndex: 10010 }}
        PaperProps={{
          sx: { minWidth: 500 },
        }}
      >
        <DialogTitle
          sx={{ m: 0, p: 2 }}
          id="customized-dialog-title"
          className="bukra dialogBox-delete-title"
        >
          Delete {title}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          {deleteResponse?.code === 200 ? (
            <Box p={2} textAlign="center">
              <Image
                src="/delete.png"
                alt="deleted-img"
                width={51}
                height={85}
              />
              <Typography
                className="dubai-med secondary-color deleted-text"
                mt={2}
              >
                {successMessage}
              </Typography>
            </Box>
          ) : (
            <>
              <Box p={2} textAlign="center">
                <Typography
                  className="dubai-med"
                  sx={{
                    color: "#E4002B",
                    fontSize: "20px",
                    fontWeight: 500,
                    lineHeight: "28px",
                  }}
                >
                  Are you sure,
                  <br /> Do you want to delete the {title} from this list?
                </Typography>
                <Typography
                  className="dubai-med secondary-color format-text"
                  sx={{ mt: 2 }}
                >
                  {revertMessage}
                </Typography>
              </Box>
              <Box sx={{ m: 1, mx: 2, textAlign: "center" }}>
                <Button
                  autoFocus
                  onClick={handleDelete}
                  color="error"
                  variant="outlined"
                  className="dubai-med text-capitalize"
                  sx={{ mr: 1 }}
                  disabled={deleteResponse?.loading}
                >
                  {deleteResponse?.loading ? (
                    <CircularProgress color="error" size="25px" />
                  ) : (
                    "Yes, delete"
                  )}
                </Button>
                <Button
                  variant="contained"
                  className="dubai-med text-capitalize"
                  onClick={handleClose}
                  disabled={deleteResponse?.loading}
                >
                  No, I want to keep
                </Button>
              </Box>
            </>
          )}
        </DialogContent>
      </BootstrapDialog>
    </>
  );
};

export default ReusableDeleteDialog;
