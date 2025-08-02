import { useState } from "react";
import { Box, ListItem, ListItemText, TextField, InputAdornment, Button, IconButton, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

interface EditableListItemProps {
  id: number;
  value: string;
  isEditing: boolean;
  onEditClick: (id: number, value: string) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUpdate: () => void;
}

const EditableListItem: React.FC<any> = ({ id, value, isEditing, onEditClick, onChange, onUpdate,updatedTitle }) => {
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
                       <InputAdornment position="end" sx={{ p: 0, m: 0  }}>
                         {/* <IconButton onClick={handleUpdate} color="primary"   edge="end"> */}
                           <Button
                       type="submit"
                       variant="contained"
                       className="text-capitalize dubai-med"
                       onClick={onUpdate}
                       disabled={!updatedTitle.trim()}
                       sx={{
                         fontSize: "14px",
                         fontWeight: 500,
                         textTransform: "capitalize",
                         borderRadius: "0 8px 8px 0",  
                         height: "100%",  
                         minWidth: "80px",
                         padding: "8px 1px",
                         marginRight: -1.6, 
                       }}
                      
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
                     },
                    //  "&:hover fieldset": {
                    //   borderColor: "#D9D9D9 !important",
                    // },
                   }}
                 />
                 {/* <Button
                   variant="contained"
                   color="primary"
                   size="small"
                   sx={{ ml: 1 }}
                   onClick={handleUpdate}
                 >
                   <CheckIcon />
                 </Button> */}
               </Box>
             ) : (
               <>
               <ListItemText
  primary={
    <Typography
                className="dubai-regular"
                sx={{
                  color:  "#58585B",
                  fontSize: "16px",
                  fontWeight:500
                 
                }}
    >
      {value}
    </Typography>
  }
/>
                 {/* <ListItemText primary={value} sx={{ flex: "1" }} /> */}
                 <IconButton onClick={() => onEditClick(id, value)}>
                   <EditIcon />
                 </IconButton>
               </>
             )}
           </ListItem>
  );
};

export default EditableListItem;
