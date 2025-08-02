// New feature branch
import {
  Alert,
  Box,
  Button,
  Grid,
  Skeleton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import CardView from "@/components/rules/cardView";
import { debounce, isEmpty } from "lodash";
import { clearRulesListState, listRules } from "@/redux/slices/rules/RulesListSlice";
import PaginationComponent from "@/components/PaginationComponent";
import React from "react";
import _ from "lodash";
import AppAddButton from "@/components/buttons/AppAddButton";
import ModuleSearchInput from "@/components/search/ModuleSearchInput";
import { checkAccess } from "@/utils/acessscheck";
import { USER_PERMISSION } from "@/utils/constants";

const debounceTime = 500;

function Page() {
  const router = useRouter();
  const { module } = router.query;
  const [searchText, setSearchText] = useState("");
  const [tabValue, setTabValue] = useState<"rules" | "mou">("rules");
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [isUpdated, setIsUpdated] = useState(false);
  const is2K = useMediaQuery("(min-width:1535px)");
  const is3K = useMediaQuery("(min-width:1700px)");
  const dispatch: any = useDispatch();
  const listRulesData = useSelector((state: any) => {
    return state.rulesList;
  });

  const handleTabSelect = (value: any) => {
    router.push(`/rules?module=${value}`);
  };

  const handleCreate = () => {
    if (tabValue === "rules") {
      router.push(`/rules/create`);
    } else {
      router.push(`/rules/mous/create`);
    }
  };

  useEffect(() => {
    if (module === "mou") {
      setTabValue("mou");
    } else {
      setTabValue("rules");
    }
  }, [module]);

  const getRuleOrMouList = () => {
    const payload = {
      section: tabValue,
      searchText: searchText,
      filteredBy: "",
      paginationIndex: page,
      paginationCount: rowsPerPage,
    };
    dispatch(listRules({ url: "/GetRulesAndAgreementsList", payload }));
  }

  const debounceGetRuleOrMouList = debounce(
    () => getRuleOrMouList(),
    debounceTime
  );

  useEffect(() => {
    dispatch(clearRulesListState());
    debounceGetRuleOrMouList();
    return () => {
      debounceGetRuleOrMouList.cancel();
    }
  }, [tabValue, searchText, page, rowsPerPage, isUpdated]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  useEffect(() => {
    setPage(1);
    setRowsPerPage(10);
    setSearchText("");
  }, [tabValue]);

  const startIndex = (page - 1) * rowsPerPage + 1;
  const endIndex = startIndex + rowsPerPage - 1;

  return (
    <Box p={1}>
      <Box
        p={1.5}
        className="dubai-med primary-color"
        bgcolor={"#fff"}
        borderRadius={"4px"}
        fontSize={"18px"}
      >
        Rules & Agreements
      </Box>
      <Box mt={1} className="bg-white" borderRadius={1}>
        <Box display={"flex"}>
          <Button
            sx={{
              flexGrow: 0,
              width: "auto",
              minWidth: 0,
              px: 2,
              border: 0,
              borderRadius: 0,
              boxShadow: "none",
              fontSize: "16px",
              borderTopLeftRadius: "4px",
            }}
            className="bukra header-border-right text-capitalize"
            onClick={() => handleTabSelect("rules")}
            variant={tabValue === "rules" ? "contained" : "text"}
          >
            Rules
          </Button>
          <Button
            sx={{
              flexGrow: 0,
              width: "auto",
              minWidth: 0,
              px: 2,
              border: 0,
              borderRadius: 0,
              boxShadow: "none",
              fontSize: "16px",
              whiteSpace: "nowrap",
            }}
            className="bukra header-border-right text-capitalize"
            onClick={() => handleTabSelect("mou")}
            variant={tabValue === "mou" ? "contained" : "text"}
          >
            MOUs & Partnership
          </Button>
          <Typography
            p={2}
            sx={{ flexGrow: 2 }}
            className="table-count-header dubai-regular header-border-right"
          >
            {!isEmpty(searchText)
              ? listRulesData &&
              listRulesData?.data &&
              listRulesData?.data?.length
              : Number(listRulesData && listRulesData?.totalRecords)}{" "}
            {tabValue === "mou" ? "MoU's" : "Rules"}
          </Typography>
          <ModuleSearchInput
            searchText={searchText}
            setSearchText={setSearchText}
            placeholder={"Search by Title..."}
            flexGrow={{ flexGrow: 0.25 }}
          />
          {(tabValue !== "mou" &&
            checkAccess(USER_PERMISSION.RulesAgreementsAdd)) ||
            (tabValue === "mou" &&
              checkAccess(USER_PERMISSION.MousPartnershipAdd)) ? (
            <AppAddButton label="Create" onClick={handleCreate} />
          ) : null}
        </Box>
        <Box
          className="bg-white"
          borderRadius={1}
          sx={{
            width: "100%",
            height: is3K ? "73vh" : is2K ? "67vh" : "73vh",
            overflow: "scroll",
          }}
          p={3}
        >
          <Grid container spacing={2}>
            {listRulesData && listRulesData?.loading ? (
              <>
                {Array.from({ length: 6 }).map((_, index) => (
                  <Grid item key={index} sx={{ borderRadius: "8px" }}>
                    <Box sx={{ width: "412px", height: "332px" }}>
                      <Skeleton
                        variant="rectangular"
                        height={200}
                        animation="wave"
                      />
                      <Box sx={{ pt: 1 }}>
                        <Skeleton variant="text" width="60%" />
                        <Skeleton variant="text" width="80%" />
                        <Skeleton variant="text" width="40%" />
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </>
            ) : listRulesData && listRulesData?.code === 200 ? (
              isEmpty(listRulesData?.data) ? (
                <Box width={"100%"}>
                  {!isEmpty(searchText) ? (
                    <Alert className="dubai-med" severity="info">
                      No record(s) found.
                    </Alert>
                  ) : (
                    <Alert className="dubai-med" severity="info">
                      {`No ${tabValue === "rules" ? "Rules" : "MoU's"
                        } are created yet.`}
                    </Alert>
                  )}
                </Box>
              ) : (
                listRulesData?.data.map((item: any, index: any) => (
                  <>
                    <Grid item key={index} sx={{ borderRadius: "8px" }}>
                      <CardView
                        tabValue={tabValue}
                        data={item}
                        setIsUpdated={setIsUpdated}
                      />
                    </Grid>
                  </>
                ))
              )
            ) : null}
          </Grid>
          {!listRulesData?.loading && listRulesData && listRulesData?.code === 200 ? (
            <Box mt={3}>
              <PaginationComponent
                rowsPerPage={rowsPerPage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
                page={page}
                handleChangePage={handleChangePage}
                startIndex={startIndex}
                endIndex={
                  !isEmpty(searchText)
                    ? listRulesData &&
                    listRulesData?.data &&
                    listRulesData?.data?.length
                    : endIndex > listRulesData?.totalRecords
                      ? listRulesData?.totalRecords
                      : endIndex
                }
                totalItems={
                  !isEmpty(searchText)
                    ? listRulesData &&
                    listRulesData?.data &&
                    listRulesData?.data?.length
                    : Number(listRulesData && listRulesData?.totalRecords)
                }
              />
            </Box>) : null}
        </Box>
      </Box >
    </Box >
  );
}

export default Page;
