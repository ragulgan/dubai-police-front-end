"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Modal,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { useRouter } from "next/router";
import _, { debounce } from "lodash";
import Axios from "../utils/AxiosInterceptor";

const UserCreation: React.FC<any> = ({
  open,
  onClose,
  setOpen,
  teamID,
  module,
}) => {
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<any>();
  const [duplicateCode, setDuplicateCode] = useState<any>();

  // API Call
  const fetchEmployees = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      setLoading(true);
      const response: any = await Axios.post(
        `${process.env.API_BASE_URL}/Login/GetEmployeeInfoByID`,
        {
          employeeID: query,
        }
      );
      setDuplicateCode(response?.responseCode);
      if (response?.responseCode === 409) {
        setSearchResults([]);
        setErrorMessage("Duplicate Entry Not Allowed.");
      }
      if (!_.isEmpty(response?.data)) {
        setSearchResults(response.data);
      } else {
        setSearchResults([]);
      }
    } catch (error: any) {
      setSearchResults([]);
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetch = debounce((query: string) => {
    fetchEmployees(query);
  }, 400); // adjust debounce delay as needed

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setSelectedEmployee(null);
    debouncedFetch(value);
  };

  const onHandelUser = () => {
    if (module === "RegisterStaff" || module === "RegisterAthlete") {
      router.push(
        `/registration/${teamID}/${module === "RegisterStaff" ? "staff" : "athlete"
        }?selectedEmployee=${selectedEmployee}`
      );
    } else {
      router.push(
        `/teams/${teamID}/${module}/add?selectedEmployee=${selectedEmployee}`
      );
    }
  };

  const onHandelCollabrative = () => {
    if (module === "RegisterStaff" || module === "RegisterAthlete") {
      router.push(
        `/registration/${teamID}/${module === "RegisterStaff" ? "staff" : "athlete"
        }`
      );
    } else {
      router.push(`/teams/${teamID}/${module}/add`);
    }
  };

  return (
    <Modal
      open={open}
      onClose={(event, reason) => {
        if (reason !== "backdropClick") {
          onClose();
        }
      }}
      aria-labelledby="add-staff-modal"
    >
      <Box
        sx={{
          width: 500,
          bgcolor: "white",
          p: 4,
          borderRadius: 2,
          boxShadow: 24,
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            transition: "background-color 0.3s ease, color 0.3s ease",
            "&:hover": {
              backgroundColor: "rgba(0, 100, 60, 1)",
              color: "#fff",
            },
          }}
        >
          <CloseIcon />
        </IconButton>

        <Box display="flex" justifyContent="flex-start" mb={1}>
          <Typography
            sx={{
              fontSize: "20px",
              textAlign: "start",
              color: "rgba(0, 135, 85, 1)",
              mb: 1,
            }}
            className="bukra-semi-bold"
          >
            Add{" "}
            {module === "RegisterStaff" || module === "staffs"
              ? "Staff"
              : "Athlete"}{" "}
            to the System
          </Typography>
        </Box>

        <Typography
          variant="body2"
          sx={{
            color: "rgba(88, 88, 91, 1)",
            mb: 2,
            fontSize: "16px",
            textAlign: "start",
          }}
          className="dubai-regular"
        >
          Search for an existing employee by entering their Employee ID or add a
          new collaborator manually if they are not in the system.
        </Typography>

        {/* Search Field */}
        <TextField
          fullWidth
          variant="outlined"
          value={selectedEmployee ? selectedEmployee : searchTerm}
          onChange={handleInputChange}
          placeholder={!selectedEmployee ? "Search by Employee ID..." : ""}
          disabled={!!selectedEmployee}
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              bgcolor: selectedEmployee ? "rgba(155, 227, 191, 0.2)" : "white",
            },
          }}
          className="Text-field-customise dubai-med"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: (<>
              {searchTerm && !selectedEmployee ? (<InputAdornment position="end">
                <IconButton
                  onClick={() => {
                    if (selectedEmployee) {
                      setSelectedEmployee(null);
                    } else {
                      setSearchTerm("");
                      setSearchResults([]);
                    }
                  }}
                  size="small"
                  sx={{
                    backgroundColor: "rgba(0, 135, 85, 1)",
                    color: "white",
                    width: 26,
                    height: 26,
                    transition: "background-color 0.3s ease, color 0.3s ease",
                    "&:hover": {
                      backgroundColor: "rgba(0, 100, 60, 1)",
                      color: "#fff",
                    },
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </InputAdornment>) : null}
            </>
            ),
          }}
        />

        {searchTerm && !selectedEmployee && (
          <List
            sx={{
              maxHeight: 200,
              overflowY: "auto",
              border: "1px solid green",
              borderRadius: "8px",
              mb: 2,
              bgcolor: "white",
            }}
          >
            {loading ? (
              <ListItem sx={{ justifyContent: "center" }} className="dubai-med">
                Loading...
              </ListItem>
            ) : duplicateCode === 409 ? (
              <ListItem sx={{ justifyContent: "center" }} className="dubai-med">
                <ListItemText
                  primary={errorMessage}
                  primaryTypographyProps={{
                    color: "error",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                  className="dubai-med"
                />
              </ListItem>
            ) : searchResults.length > 0 ? (
              searchResults.map((emp: any) => (
                <ListItem
                  key={emp.employeeNo}
                  onClick={() => {
                    setSelectedEmployee(emp.employeeNo);
                    setSearchTerm("");
                    setSearchResults([]);
                    setErrorMessage("");
                  }}
                  sx={{
                    "&:hover": { backgroundColor: "#f1f1f1" },
                    cursor: "pointer",
                  }}
                  className="dubai-med"
                >
                  <ListItemText
                    primary={emp.employeeNo}
                    secondary={emp.fullNameA}
                    className="dubai-med"
                  />
                </ListItem>
              ))
            ) : (
              <ListItem
                sx={{ justifyContent: "center", color: "gray" }}
                className="dubai-med"
              >
                No results found
              </ListItem>
            )}
          </List>
        )}

        <Button
          variant="contained"
          fullWidth
          sx={{
            height: 48,
            borderRadius: "4px",
            color: "white",
            bgcolor: "rgba(0, 135, 85, 1)",
            "&:hover": { bgcolor: "rgba(0, 100, 70, 1)" },
          }}
          disabled={!selectedEmployee}
          onClick={onHandelUser}
          className="dubai-med text-capitalize"
        >
          Continue
        </Button>

        <Divider
          sx={{ my: 3, position: "relative", bgcolor: "rgba(0, 135, 85, 0.3)" }}
        >
          <Typography
            variant="body2"
            sx={{
              position: "absolute",
              top: "-12px",
              left: "50%",
              backgroundColor: "white",
              px: 1,
              transform: "translateX(-50%)",
              color: "rgba(88, 88, 91, 1)",
            }}
            className="bukra"
          >
            (or)
          </Typography>
        </Divider>

        <Button
          variant="outlined"
          fullWidth
          onClick={onHandelCollabrative}
          sx={{
            height: 48,
            borderRadius: "4px",
            color: "rgba(0, 135, 85, 1)",
            borderColor: "rgba(0, 135, 85, 1)",
            "&:hover": { bgcolor: "rgba(0, 135, 85, 0.1)" },
          }}
          className="dubai-med text-capitalize"
        >
          Add New Collaborator
        </Button>
      </Box>
    </Modal>
  );
};

export default UserCreation;
