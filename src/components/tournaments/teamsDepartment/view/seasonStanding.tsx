"use clients";
import React from 'react';
import { Card, CardContent, Typography, Box, LinearProgress, Alert, Grid, Skeleton } from '@mui/material';

const SeasonStandingsChart: React.FC = () => {
  const getLatestResultData = {
    "loading": false,
    "code": 200,
    "message": "Success",
    "data": [
      { 
        "label": 'Competitiveness', 
        "value": 60, 
        "maxValue": 100, 
        "color": '#34457b' 
      },
      { 
        "label": 'Participation & Engagement', 
        "value": 7.5, 
        "maxValue": 10, 
        "color": '#ea5679' 
      },
      { 
        "label": 'Women Empowerment', 
        "value": 6.5, 
        "maxValue": 10, 
        "color": '#fdbd10' 
      },
      { 
        "label": 'Physical Readiness', 
        "value": 5.0, 
        "maxValue": 10, 
        "color": '#a06bac' 
      },
      { 
        "label": 'Assistance and Motivation', 
        "value": 5.0, 
        "maxValue": 10, 
        "color": '#008755' 
      }
    ]
  };

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
            paddingLeft: "24px",
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
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "18px",
                      }}
                      className="bukra"
                    >
                      Season Standings
                    </Typography>
                  </Box>
                  {getLatestResultData.data.map((metric: any) => (
                    <Box key={metric.label} sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                      <Typography variant="subtitle1" sx={{ width: '18%', px: 2, py: 1 }}>
                        {metric.label}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, position: 'relative' }}>
                        <LinearProgress
                          variant="determinate"
                          value={(metric.value / (metric.maxValue || metric.value)) * 100}
                          sx={{
                            height: 35,
                            borderTopRightRadius: 50,
                            borderBottomRightRadius: 50,
                            flexGrow: 1,
                            backgroundColor: '#f8fbfe',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: metric.color,
                              transition: 'width 0.3s ease-in-out',
                              borderTopRightRadius: 5,
                              borderBottomRightRadius: 5,
                            },
                          }}
                        />
                        {/* <Typography variant="body2" sx={{ ml: 2, fontWeight: 'bold', width: '15%', textAlign: 'right' }}>
                          {metric.maxValue !== undefined ? `${metric.value}/${metric.maxValue}` : `${metric.value}`}
                        </Typography> */}
                        <Typography
                          variant="body2"
                          sx={{
                            position: 'absolute',
                            right: 150,
                            color: "#000000",
                            fontSize: '18px',
                            fontWeight: 'bold',
                            ml: 2,
                            width: '15%',
                            textAlign: 'right'
                          }}
                        >
                          {metric.maxValue !== undefined ? `${metric.value}/${metric.maxValue}` : `${metric.value}`}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Grid>
              </CardContent>
            )}
        </Card>
      )}
    </>

  );
};

export default SeasonStandingsChart;