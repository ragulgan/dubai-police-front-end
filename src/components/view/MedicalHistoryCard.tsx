import {
  Box,
  Fade,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/material/styles";

interface MedicalHistoryCardProps {
  label: string;
  expanded: boolean;
  onClick: React.MouseEventHandler<HTMLDivElement>;
}

const MedicalHistoryCard: React.FC<MedicalHistoryCardProps> = ({
  label,
  expanded,
  onClick,
}) => {
  const sectionContainerStyle = {
    backgroundColor: "#FFFFFF",
    marginTop: 1,
    padding: 1,
    borderRadius: "8px",
    borderBottomLeftRadius: expanded ? "8px" : "8px",
    borderBottomRightRadius: expanded ? "8px" : "8px",
  };

  const topBarStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
  };

  const topBarButtonContainerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const injuries: any = [
    {
      id: 1,
      type: "Sprained Ankle",
      injuredDateTime: "11/12/2024 3:30 PM",
      expectedRecoveryDateTime: "12/30/2024",
      actualRecoveryDateTime: "12/25/2024",
      status: "Recovered",
    },
    {
      id: 2,
      type: "Torn ACL",
      injuredDateTime: "09/15/2024 10:00 AM",
      expectedRecoveryDateTime: "12/01/2024",
      actualRecoveryDateTime: "N/A",
      status: "Ongoing",
    },
    {
      id: 3,
      type: "Fractured Arm",
      injuredDateTime: "07/20/2024 1:00 PM",
      expectedRecoveryDateTime: "09/15/2024",
      actualRecoveryDateTime: "09/10/2024",
      status: "Recovered",
    },
    {
      id: 4,
      type: "Dislocated Shoulder",
      injuredDateTime: "05/10/2024 11:00 AM",
      expectedRecoveryDateTime: "08/05/2024",
      actualRecoveryDateTime: "08/01/2024	",
      status: "Pending",
    },
    {
      id: 5,
      type: "Muscle Strain",
      injuredDateTime: "03/02/2024 4:30 PM",
      expectedRecoveryDateTime: "04/20/2024",
      actualRecoveryDateTime: "N/A",
      status: "Ongoing",
    },
  ];

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: "#58585B",
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 16,
      padding: 16,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: "#B1E4E333",
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  return (
    <Box sx={sectionContainerStyle}>
      <Box sx={topBarStyle} onClick={onClick}>
        <Typography
          variant="subtitle1"
          className="bukra-semi-bold"
          sx={{
            padding: 1,
            fontSize: 18,
            color: "#008755",
          }}
        >
          {label}
        </Typography>
        <Box sx={topBarButtonContainerStyle}>
          {expanded && (
            <span onClick={onClick}>
              <ExpandMoreIcon sx={{ cursor: "pointer" }} />
            </span>
          )}
        </Box>
      </Box>
      <Box p={1}>
        <TableContainer
          component={Paper}
          sx={{ border: "1px solid rgba(88, 88, 91, 0.2)" }}
        >
          <Table stickyHeader aria-label="team table">
            <TableHead>
              <TableRow
                sx={{
                  "&:nth-of-type(even)": { backgroundColor: "#EFFAF9" },
                }}
              >
                <TableCell
                  sx={{ fontWeight: 500, fontSize: 16, padding: 2 }}
                  className="bukra"
                >
                  Type of Injury
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 500, fontSize: 16, padding: 2 }}
                  className="bukra"
                >
                  Date and Time of Injury
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 500, fontSize: 16, padding: 2 }}
                  className="bukra"
                >
                  Expected Recovery Date
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 500, fontSize: 16, padding: 2 }}
                  className="bukra"
                >
                  Actual Recovery Date
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 500, fontSize: 16, padding: 2 }}
                  className="bukra"
                >
                  Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {injuries.map((row: any) => (
                <StyledTableRow key={row.id}>
                  <StyledTableCell
                    component="th"
                    scope="row"
                    className="dubai-regular"
                    sx={{ fontWeight: 400, fontSize: 16, color: "#58585B" }}
                  >
                    {row.type}
                  </StyledTableCell>
                  <StyledTableCell
                    component="th"
                    scope="row"
                    className="dubai-regular"
                    sx={{ fontWeight: 400, fontSize: 16, color: "#58585B" }}
                  >
                    {row.injuredDateTime}
                  </StyledTableCell>
                  <StyledTableCell
                    component="th"
                    scope="row"
                    className="dubai-regular"
                    sx={{ fontWeight: 400, fontSize: 16, color: "#58585B" }}
                  >
                    {row.expectedRecoveryDateTime}
                  </StyledTableCell>
                  <StyledTableCell
                    component="th"
                    scope="row"
                    className="dubai-regular"
                    sx={{ fontWeight: 400, fontSize: 16, color: "#58585B" }}
                  >
                    {row.actualRecoveryDateTime}
                  </StyledTableCell>
                  <StyledTableCell
                    component="th"
                    scope="row"
                    className="dubai-regular"
                    sx={{ fontWeight: 400, fontSize: 16, color: "#58585B" }}
                  >
                    {row.status}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default MedicalHistoryCard;
