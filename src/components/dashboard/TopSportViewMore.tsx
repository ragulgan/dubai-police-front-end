import React from 'react'
import { Box, Avatar, Typography, Card, DialogTitle, IconButton } from '@mui/material';
import DialogContent from '@mui/material/DialogContent';
import CountAnimation from "../common/CounterAnimation";
import CloseIcon from '@mui/icons-material/Close';

interface SportViewMoreProps {
  onClose?: any;
  getTopPerformingSportsData?: any;
  setIsUpdated?: any;
  teamID?: any;
}

const SportViewMorePage: React.FC<SportViewMoreProps> = ({
  getTopPerformingSportsData,
  teamID,
  onClose
}) => {

  return (
    <>
      <DialogTitle sx={{ m: 0, p: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography sx={{ fontSize: "18px" }} className="bukra">
            Top Performing Sports
          </Typography>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={(theme) => ({
              position: 'absolute',
              right: 8,
              top: 8,
              color: theme.palette.grey[500],
            })}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <Box sx={{ width: '100%', typography: 'body1', height: "500px" }}>
        <DialogContent dividers sx={{ maxHeight: '500px', overflowY: 'auto' }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {/* Left Stepper */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
              flexGrow={0}
            >
              {getTopPerformingSportsData &&
                getTopPerformingSportsData?.data &&
                getTopPerformingSportsData?.data?.length > 0 &&
                getTopPerformingSportsData?.data.map((_: any, index: any) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    {/* Number Circle */}
                    <Box
                      sx={{
                        width: 38,
                        height: 37,
                        borderRadius: "50%",
                        border: "2px solid #00205B",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "16px",
                        fontWeight: "bold",
                        color: "#00205B",
                        background: "white",
                      }}
                      className="bukra-semi-bold"
                    >
                      {index + 1}
                    </Box>

                    {/* Vertical Line (Except for Last Item) */}
                    {index !== getTopPerformingSportsData?.data.length - 1 && (
                      <Box sx={{ width: 2, height: "55px", bgcolor: "#00205B" }} />
                    )}
                  </Box>
                ))}
            </Box>

            {/* Cards for Athletes */}
            <Box flexGrow={2}>
              {getTopPerformingSportsData &&
                getTopPerformingSportsData?.data &&
                getTopPerformingSportsData?.data?.length > 0 &&
                getTopPerformingSportsData?.data.map((athlete: any, index: any) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "25px",
                      marginTop: "18px",
                    }}
                  >
                    {/* Horizontal Line Connector */}
                    <Box
                      sx={{
                        width: 60,
                        height: 2,
                        bgcolor: "#00205B",
                        marginBottom: "12px",
                        marginTop: "17px",
                      }}
                    />

                    {/* Athlete Card */}
                    <Card
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        bgcolor: "#00205B",
                        color: "white",
                        p: 1.1,
                        borderRadius: 2,
                        width: "100%",
                      }}
                    >
                      <Avatar
                        src={athlete?.athleteImage}
                        sx={{
                          width: 32,
                          height: 32,
                          mr: 1.5,
                          border: "1px solid #fff",
                        }}
                      />
                      <Box
                        sx={{
                          flex: 1,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Box>
                          <Typography
                            sx={{ fontSize: "16px", width: "200px" }}
                            className="dubai-bold text-capitalize webkit-line-clamp webkit-1"
                          >
                            {athlete?.teamName}
                          </Typography>
                          <Typography
                            sx={{ fontSize: "12px" }}
                            className="dubai-regular text-capitalize"
                          >
                            {athlete?.sportName}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            gap: "8px",
                            color: "#FFFFFF",
                            backgroundColor: "#FFFFFF1A",
                            borderRadius: "5px",
                            padding: "2px 16px",
                            justifyContent: "flex-end",
                          }}
                        >
                          <Box sx={{ textAlign: "center" }}>
                            <Typography
                              sx={{ fontSize: "18px" }}
                              className="bukra-semi-bold"
                            >
                              <CountAnimation
                                value={Number(athlete?.totalWins)}
                              />
                            </Typography>
                            <Typography
                              sx={{ fontSize: "12px" }}
                              className="dubai-regular"
                            >
                              Total Wins
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Card>
                  </Box>
                ))}
            </Box>
          </Box>
        </DialogContent>
      </Box>
    </>
  )
}

export default SportViewMorePage