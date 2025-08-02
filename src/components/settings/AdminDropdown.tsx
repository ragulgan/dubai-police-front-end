import { useState, MouseEvent } from "react";
import { Menu, MenuItem, IconButton, Button, Box } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useRouter } from "next/router";

interface SubMenuItem {
  title: string;
  menuLink: string;
}

interface AdminDropdownProps {
  isAdmin: boolean;
  adminOpen: boolean;
  item: {
    title: string;
    subMenu?: SubMenuItem[];
  };
}

const AdminDropdown: React.FC<AdminDropdownProps> = ({ isAdmin, adminOpen, item }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuClick = (menuLink: string) => {
    router.push(menuLink);
    handleClose();
  };
// make sure this is active
  if (!isAdmin || !adminOpen) return null;

  return (
    <>
      <Button 
        onClick={handleClick} 
        sx={{ display: "flex", alignItems: "center", textTransform: "none" }}
      >
        {item.title}
        <ExpandMoreIcon sx={{ marginLeft: "5px" }} />
      </Button>
      
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {item.subMenu?.map((subItem) => (
          <MenuItem key={subItem.title} onClick={() => handleMenuClick(subItem.menuLink)}>
            {subItem.title}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default AdminDropdown;
