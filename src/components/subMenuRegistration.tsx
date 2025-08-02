"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { Avatar, Chip, Skeleton, Stack } from "@mui/material";
import SearchField from "./Fields/SearchField";
import { useForm, Controller } from "react-hook-form";
import _, { isEmpty } from "lodash";
import { sportsIconDropData } from "@/utils/constants";
import Tooltip from "@mui/material/Tooltip";
import { useRouter } from "next/navigation";
import { setLocalStorage } from "@/utils/helper";
import { useSelector } from "react-redux";
import { useState } from "react";
import UserCreation from "./UserCreation";

interface RoutePath {
  path: string;
  customSelect: string;
  pathname?: any;
}

const SubMenuRegistration: React.FC<RoutePath> = ({
  path,
  customSelect,
  pathname,
}) => {
  const router = useRouter();
  const [selectedChip, setSelectedChip] = React.useState<string>("All Sports");
  const [selectedSport, setSelectedSport] = React.useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [name, setName] = useState<any>(false);

  const getSportList = useSelector((state: any) => {
    return state.getSportList;
  });

  const { control, watch } = useForm({
    defaultValues: {
      search: "",
    },
  });

  const handleSport = (value: any) => {
    setLocalStorage("sport", value);
    setSelectedSport(value);
  };

  const renderIconGrid = (data: any) => {
    if (!Array.isArray(data)) {
      console.error("Expected data to be an array, but received:", data);
      return [];
    }
    return data.map((item: any) => (
      <Grid item xs={6} sm={3} md={3} lg={2} xl={2} key={item.id}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Tooltip title={item.label}>
            <Avatar
              sx={{
                width: "60px",
                height: "60px",
                backgroundColor: "#EFFAF9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                border: "1px solid #008755",
                cursor: "pointer",
              }}
              onClick={() => handleSport(item.sportID)}
            >
              {_.isEmpty(item.sportProfile) ? (
                sportsIconDropData[20].icon
              ) : (
                <img
                  src={item.sportProfile}
                  alt={item.sportName || "Team Profile"}
                  style={{ width: "40px", height: "40px" }}
                />
              )}
            </Avatar>
          </Tooltip>
          <Typography
            variant="caption"
            className="dubai-med"
            sx={{
              mt: 1,
              textAlign: "center",
              color: "#58585B",
              fontWeight: "400",
              fontSize: "18px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: "2",
              WebkitBoxOrient: "vertical",
            }}
          >
            {item.sportName}
          </Typography>
        </Box>
      </Grid>
    ));
  };

  const searchValue = watch("search");

  const filteredIconData = React.useMemo(() => {
    let filteredData = _.filter(getSportList.data, (item) =>
      item.sportName.toLowerCase().includes(searchValue.toLowerCase())
    );
    if (selectedChip !== "All Sports") {
      filteredData = filteredData.filter(
        (item) => item.categoryType === selectedChip[selectedChip.length - 1]
      );
    }
    return filteredData;
  }, [searchValue, selectedChip]);

  const handleChipClick = (label: string) => {
    setSelectedChip(label);
  };

  const getChipStyles = (label: string) => ({
    color: selectedChip === label ? "#EFFAF9" : "#008755",
    background: selectedChip === label ? "#008755" : "#FFFFFF",
    "&:hover": {
      background: selectedChip === label ? "#008755" : "#FFFFFF",
    },
    fontWeight: "500",
    fontSize: "16px",
    height: "37px",
    border: "1px solid #008755",
    borderRadius: "33px",
    width: "110px",
  });

  const handleRegisterStaff = (selectedSport: string) => {
    // router.push(`/registration/${selectedSport}/staff`);
    setDialogOpen(true);
    setName("RegisterStaff");
  };

  const handleRegisterAthlete = (selectedSport: string) => {
    // router.push(`/registration/${selectedSport}/athlete`);
    setDialogOpen(true);
    setName("RegisterAthlete");
  };

  const close = () => {
    setDialogOpen(false);
  };

  return (
    <>
      {dialogOpen && (
        <UserCreation
          open={dialogOpen}
          onClose={close}
          teamID={selectedSport}
          module={name}
        />
      )}
      {selectedSport ? (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          height="80vh"
          textAlign="center"
        >
          <Typography
            component="a"
            onClick={() => handleRegisterStaff(selectedSport)}
            sx={{
              fontSize: "1.5rem",
              color: "primary.main",
              cursor: "pointer",
              textDecoration: "underline",
              marginBottom: "0.5rem",
            }}
          >
            Register Staff
          </Typography>

          <Typography
            variant="h6"
            color="textSecondary"
            sx={{ margin: "0.5rem 0" }}
          >
            or
          </Typography>

          <Typography
            component="a"
            onClick={() => handleRegisterAthlete(selectedSport)}
            sx={{
              fontSize: "1.5rem",
              color: "primary.main",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            Register Athlete
          </Typography>
        </Box>
      ) : (
        <Box sx={{ p: 3 }}>
          <Typography
            variant="caption"
            sx={{
              mt: 1,
              textAlign: "center",
              color: "#000000",
              fontWeight: "500",
              fontSize: "22px",
              fontFamily: "29LT Bukra",
              lineHeight: "26.4px",
            }}
            className="bukra"
          >
            All Sports
          </Typography>
          <Controller
            name="search"
            control={control}
            render={({ field }) => (
              <SearchField
                label="Search"
                value={field.value}
                onChange={field.onChange}
                placeholder="Search Sport..."
                sx={{ mt: 2 }}
              />
            )}
          />
          <Stack direction="row" spacing={1} sx={{ mt: 2, mb: 3 }}>
            {["All Sports", "Category A", "Category B", "Category C"].map(
              (category) => (
                <Chip
                  key={category}
                  label={category}
                  sx={getChipStyles(category)}
                  onClick={() => handleChipClick(category)}
                />
              )
            )}
          </Stack>
          <Grid container spacing={2}>
            {getSportList.loading
              ? Array.from({ length: 30 }).map((_, index) => (
                  <Grid item xs={6} sm={3} md={3} lg={2} xl={2} key={index}>
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                    >
                      <Skeleton variant="circular" width={60} height={60} />
                      <Skeleton animation="wave" sx={{ mt: 1 }} width={80} />
                    </Box>
                  </Grid>
                ))
              : renderIconGrid(
                  isEmpty(filteredIconData)
                    ? getSportList.data
                    : filteredIconData
                )}
          </Grid>
        </Box>
      )}
    </>
  );
};
export default SubMenuRegistration;
