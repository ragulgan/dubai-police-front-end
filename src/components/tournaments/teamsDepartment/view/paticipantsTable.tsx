"use clients";
import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  Grid,
  Box,
  Typography,
  Skeleton,
  Alert,
  Divider,
  Accordion,
  AccordionActions,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { getLatestResult } from "@/redux/slices/dashboard/getLatestResultSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";
import PaticipantTeamTable from "./components/accordionTable";

const ParticipantsTableCard: React.FC = ({ }) => {
  const router = useRouter();
  const { teamID, seasonID } = router.query;
  const dispatch: AppDispatch = useDispatch();
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  //   const getLatestResultData = useSelector(
  //     (state: RootState) => state.getLatestResult
  //   );

  const getLatestResultData = {
    "loading": false,
    "code": 200,
    "message": "Success",
    "totalRecords": 10,
    "data": [
      {
        rank: '01',
        name: 'Sergeant Ahmed Al Farsi',
        participation: 18,
        medals: 15,
        imageUrl: '/team-overview/player1.svg'
      },
      {
        rank: '02',
        name: 'Sergeant Fatima Al-Mansoori',
        participation: 20,
        medals: 14,
        imageUrl: '/team-overview/player2.svg'
      },
      {
        rank: '03',
        name: 'Brigadier Rashid Al-Din',
        participation: 17,
        medals: 13,
        imageUrl: '/team-overview/player3.svg'
      },
      {
        rank: '04',
        name: 'Major Khalid Al-Jaberi',
        participation: 19,
        medals: 11,
        imageUrl: '/team-overview/player1.svg'
      },
      {
        rank: '05',
        name: 'Brigadier Yasmin Al-Fahim',
        participation: 16,
        medals: 10,
        imageUrl: '/team-overview/player2.svg'
      },
      {
        rank: '06',
        name: 'Sergeant Faisal Al-Hashimi',
        participation: 15,
        medals: 9,
        imageUrl: '/team-overview/player3.svg'
      },
      {
        rank: '07',
        name: 'Sergeant Ahmed Al Farsi',
        participation: 14,
        medals: 8,
        imageUrl: '/team-overview/player1.svg'
      },
      {
        rank: '08',
        name: 'Sergeant Ahmed Al Farsi',
        participation: 13,
        medals: 7,
        imageUrl: '/team-overview/player2.svg'
      },
      {
        rank: '09',
        name: 'Sergeant Ahmed Al Farsi',
        participation: 12,
        medals: 6,
        imageUrl: '/team-overview/player3.svg'
      },
      {
        rank: '10',
        name: 'Sergeant Ahmed Al Farsi',
        participation: 11,
        medals: 5,
        imageUrl: '/team-overview/player1.svg'
      }
    ]
  }

  return (
    <>
      {getLatestResultData && getLatestResultData?.loading && (
        <Card
          sx={{
            p: 2,
            boxShadow: "none",
            borderRadius: "8px",
            height: "280px",
          }}
        >
          <Skeleton variant="text" sx={{ fontSize: "1rem" }} width={"40%"} />
          <Skeleton variant="text" sx={{ fontSize: "0.5rem" }} width={"30%"} />
          <Skeleton
            variant="rectangular"
            width={"100%"}
            height={"204px"}
            sx={{ mt: 1, borderRadius: "20px" }}
          />
        </Card>
      )}
      {getLatestResultData && !getLatestResultData?.loading && (
        <Card
          sx={{
            maxWidth: "100%",
            background: "#FFFFFF",
            color: "black",
            borderRadius: 2,
            boxShadow: "none",
            paddingTop: "24px",
            paddingRight: "24px",
            paddingLeft: "12px",
          }}
        >
          {getLatestResultData &&
            getLatestResultData?.code &&
            getLatestResultData?.code === 500 && (
              <Alert className="dubai-med" severity="error" sx={{ mb: 3 }}>
                Unable to retrieve latest result records.
              </Alert>
            )}
          {getLatestResultData &&
            getLatestResultData?.data &&
            getLatestResultData?.data.length === 0 && (
              <Alert className="dubai-med" severity="info" sx={{ mb: 3 }}>
                No latest result records found for this sport yet.
              </Alert>
            )}
          {getLatestResultData &&
            getLatestResultData?.data &&
            getLatestResultData?.data.length > 0 && (
              <CardContent sx={{ p: 0 }}>
                <Grid item md={12}>
                  <Accordion sx={{ color: "black", background: "#FFFFFF", boxShadow: "none" }}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1-content"
                      id="panel1-header"
                    >
                      <Typography component="span" sx={{ fontSize: "18px" }} className="bukra">
                        Participants
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {getLatestResultData &&
                      getLatestResultData?.data &&
                      getLatestResultData?.data?.length > 0 ?
                      <PaticipantTeamTable 
                        data={getLatestResultData.data || []}
                        setPage={setPage}
                        page={page}
                        setRowsPerPage={setRowsPerPage}
                        rowsPerPage={rowsPerPage}
                        dataList={getLatestResultData}
                        isLoading={getLatestResultData.loading}
                        module="staff"
                      /> : null}
                    </AccordionDetails>
                  </Accordion>
                </Grid>
              </CardContent>
            )}
        </Card>
      )}
    </>
  );
};

export default ParticipantsTableCard;