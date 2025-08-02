"use client";
import {
  Box,
  Button,
  CircularProgress,
  DialogContent,
  DialogTitle,
  IconButton,
  Popover,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import CloneIcon from "../../../public/CloneIcon.svg";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Image from "next/image";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import CloseIcon from "@mui/icons-material/Close";

interface FilterDialogProps {
  open: boolean;
  anchorEl: null | HTMLElement;
  onClose: () => void;
  setEdit?: any;
  setClone?: any;
  setTabValue?: any;
  handleDelete?: any;
  FoodDelete?: any;
}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const SelectPopover: React.FC<FilterDialogProps> = ({
  open,
  anchorEl,
  onClose,
  setEdit,
  setClone,
  setTabValue,
  handleDelete,
  FoodDelete,
}) => {
  const [openDialog, setOpenDialog] = useState<any>(false);
  const handleClose = () => {
    setOpenDialog(false);
    onClose();
  };

  return (
    <>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={openDialog}
        className="dialog-width"
        onClick={(e: any) => {
          e.stopPropagation();
        }}
        style={{ zIndex: 10010 }}
      >
        <DialogTitle
          sx={{ m: 0, p: 2 }}
          id="customized-dialog-title"
          className="bukra dialogBox-delete-title"
        >
          Delete Food
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          {FoodDelete?.code === 200 ? (
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
                {FoodDelete?.message}
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
                  <br /> Do you want to delete the food from this list?
                </Typography>
                <Typography className="dubai-med secondary-color format-text">
                  Once the Food is deleted, you cannot not revert.
                </Typography>
              </Box>
              <Box sx={{ m: 1, mx: 2, textAlign: "center" }}>
                <Button
                  autoFocus
                  onClick={() => handleDelete()}
                  color="error"
                  variant="outlined"
                  className="dubai-med text-capitalize"
                  sx={{ mr: 1 }}
                  disabled={FoodDelete?.loading}
                >
                  {FoodDelete?.loading ? (
                    <CircularProgress color="error" size="25px" />
                  ) : (
                    "Yes, delete"
                  )}
                </Button>
                <Button
                  variant="contained"
                  className="dubai-med text-capitalize"
                  onClick={handleClose}
                  disabled={FoodDelete?.loading}
                >
                  No, I want to Keep
                </Button>
              </Box>
            </>
          )}
        </DialogContent>
      </BootstrapDialog>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        sx={{ boxShadow: "none" }}
        className="box-shadow-add-food"
      >
        <Box width={"160px"}>
          <Box
            display={"flex"}
            alignItems={"center"}
            p={2}
            py={1.5}
            sx={{ cursor: "pointer" }}
            onClick={() => {
              setEdit(false);
              setClone(true);
              setTabValue("manageFood");
              onClose();
            }}
          >
            <CloneIcon width="20px" height="20px" />
            <Typography className="dubai-med primary-color" sx={{ ml: 1 }}>
              Clone
            </Typography>
          </Box>
          <Box
            display={"flex"}
            alignItems={"center"}
            p={2}
            py={1.5}
            sx={{
              borderBottom: "1px solid #DCDCDC",
              borderTop: "1px solid #DCDCDC",
              cursor: "pointer",
            }}
            onClick={() => {
              setEdit(true);
              setClone(false);
              setTabValue("manageFood");
              onClose();
            }}
          >
            <EditOutlinedIcon
              width="20px"
              height="20px"
              sx={{ color: "#008755" }}
            />
            <Typography className="dubai-med primary-color" sx={{ ml: 1 }}>
              Edit
            </Typography>
          </Box>
          <Box
            display={"flex"}
            alignItems={"center"}
            p={2}
            py={1.5}
            sx={{ cursor: "pointer" }}
            onClick={() => setOpenDialog(true)}
          >
            <DeleteOutlineOutlinedIcon
              width="20px"
              height="20px"
              sx={{ color: "#008755" }}
            />
            <Typography className="dubai-med primary-color" sx={{ ml: 1 }}>
              Delete
            </Typography>
          </Box>
        </Box>
      </Popover>
    </>
  );
};

export default SelectPopover;
