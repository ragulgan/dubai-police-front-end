import { useState } from "react";
import { Box, ListItem, ListItemText, TextField, InputAdornment, Button, IconButton, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface EditableListItemProps {
  id: number;
  value: string;
  isEditing: boolean;
  onEditClick: (id: number, value: string) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUpdate: () => void;
}
const isDisabled = (disabled: string) => {
  if (disabled === 'Collaboration Contracts' || disabled === 'Permanent Contract') {
    return true
  }
}
const EditDeleteListItem: React.FC<any> = ({ id, value, isEditing, onEditClick, onChange, onUpdate, updatedTitle, onDeleteClick }) => {
  return (
    <ListItem key={id} sx={{ display: "flex", justifyContent: "space-between" }}>
      {isEditing ? (
        <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
          <TextField
            fullWidth
            size="small"
            value={updatedTitle}
            onChange={onChange}
            InputProps={{
              sx: {
                fontSize: "16px", // Adjust text size
                fontWeight: 500, // Adjust font weight
                color: "#333333", // Adjust text color
                fontFamily: "Dubai !important", // Apply custom font if needed
              },
              endAdornment: (
                <InputAdornment position="end" sx={{ p: 0, m: 0 }}>
                  {/* <IconButton onClick={handleUpdate} color="primary"   edge="end"> */}
                  <Button
                    type="submit"
                    variant="contained"
                    className="text-capitalize dubai-med"
                    onClick={onUpdate}
                    sx={{
                      fontSize: "14px",
                      fontWeight: 500,
                      textTransform: "capitalize",
                      borderRadius: "0 8px 8px 0",
                      height: "100%",
                      minWidth: "80px",
                      padding: "8px 1px",
                      marginRight: -1.6
                    }}
                    disabled={!updatedTitle.trim()}
                  >
                    Update
                  </Button>
                  {/* </IconButton> */}

                </InputAdornment>
              ),
            }}
            sx={{
              flex: 1,
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                height: '100%',
                borderColor: '#D9D9D9 !important'
              },
            }}
          />
        </Box>
      ) : (
        <>
          <ListItemText
            primary={
              <Typography
                className="dubai-regular"
                sx={{
                  color: "#58585B",
                  fontSize: "16px",
                  fontWeight: 500,
                }}
              >
                {value}
              </Typography>
            }
          />
          {/* <ListItemText primary={value} sx={{ flex: "1" }} /> */}
          {<IconButton onClick={() => onEditClick(id, value)}
            disabled={isDisabled(value)}
          >
            <EditIcon />
          </IconButton>

          }
          <IconButton onClick={() => onDeleteClick(id)}
            disabled={isDisabled(value)}
          >
            <DeleteIcon />
          </IconButton>
        </>
      )}
    </ListItem>
  );
};

export default EditDeleteListItem;



{/* <TextField
                   fullWidth
                   size="small"
                   value={updatedTitle}
                   onChange={onChange}
                
                   sx={{
                    flex: 1,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      height: "100%",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#D9D9D9", // Default border color
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#D9D9D9", // Prevent hover border change
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "red", // Change border color on focus
                      },
                    },
                  }}
                 /> */}