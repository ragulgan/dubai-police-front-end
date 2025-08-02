import { useState } from "react";
import { Box, ListItem, ListItemText, TextField, InputAdornment, Button, IconButton, Typography, Chip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

interface EditableListItemProps {
  id: number;
  title: string;
  isEditing: boolean;
  onEditClick: (id: number, title: string) => void;
  onUpdate: () => void;
}

const EditPopUpListItem: React.FC<any> = ({ id, title, category, active, order, onEditClick  }) => {
  return (
    <ListItem
    key={id}
    sx={{
      display: "grid",
      gridTemplateColumns: "10% 35% 20% 20% 20% 0%", // Ensures consistent column width
      alignItems: "center",
      // borderBottom: "1px solid #E0E0E0",
      paddingY: 1,
      px: 2, // Adds padding for spacing
    }}
  >
    {/* Order */}
    <Typography sx={{ fontWeight: 500,color:'#58585B',  fontSize: "16px", }} className="dubai-regular">{order}</Typography>

    {/* Sports List Title */}
    <ListItemText
      primary={
        <Typography
          sx={{
            color: "#58585B",
            fontSize: "16px",
            fontWeight: 500,
          }}
          className="dubai-regular"
        >
          {title}
        </Typography>
      }
    />

    {/* Category */}
    <Typography sx={{ textAlign: "center",  fontSize: "16px",color:'#58585B'}} className="dubai-regular">{category}</Typography>
    <Box sx={{
      alignSelf:'center',
      justifyContent:'center',
      marginLeft:10
    }}>
                             <Chip
                              className="dubai-med"
                              label={active === 1 ? "Active" : "Inactive"}
                              sx={

                                {
                                  fontWeight: "400",
                                  fontSize: "16px",
                                  height: "30px",
                                  border: active === 1 ? "1px solid #008755" : "1px solid #A0A0A0", // Green for active, Gray for inactive
                                  backgroundColor: active === 1 ? "#E5FFF6" : "#F0F0F0", // Light green for active, Light gray for inactive
                                  color: active === 1 ? "#008755" : "#5A5A5A", 
                                  borderRadius: "33px",
                                  width: "80px",
                                 
                                }
                              }
                            />
                            </Box>

    {/* Edit Button */}
    <IconButton onClick={() => onEditClick(id, title)} sx={{ justifySelf: "center" }}>
      <EditIcon />
    </IconButton>
  </ListItem>
  );
};

export default EditPopUpListItem;
