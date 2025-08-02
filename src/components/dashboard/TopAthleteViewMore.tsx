import React from 'react'
import { Box, Avatar, Typography, Card, DialogTitle, IconButton } from '@mui/material';
import DialogContent from '@mui/material/DialogContent';
import CountAnimation from "../common/CounterAnimation";
import CloseIcon from '@mui/icons-material/Close';

interface AthleteViewMoreProps {
  onClose?: any;
  getTopPerformingAthleteData?: any;
  setIsUpdated?: any;
  teamID?: any;
}

const AthleteViewMorePage: React.FC<AthleteViewMoreProps> = ({
  getTopPerformingAthleteData,
  teamID,
  onClose
}) => {

  return (
    <>
      <DialogTitle sx={{ m: 0, p: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography sx={{ fontSize: "18px" }} className="bukra">
            Top Performing Athletes
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
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", flexGrow: 0 }}>
              {getTopPerformingAthleteData?.data?.map((data: any, index: number) => (
                <Box key={index} sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 42,
                      borderRadius: "50%",
                      border: "2px solid #008755",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "16px",
                      color: "#008755",
                      background: "white",
                    }}
                    className="bukra-semi-bold"
                  >
                    {index + 1}
                  </Box>
                  {index !== getTopPerformingAthleteData?.data.length - 1 && (
                    <Box sx={{ width: 2, height: "55px", bgcolor: "#008755" }} />
                  )}
                </Box>
              ))}
            </Box>

            {/* Athlete Cards */}
            <Box flexGrow={2}>
              {getTopPerformingAthleteData?.data?.map((athlete: any, index: number) => (
                <Box key={index} sx={{ display: "flex", alignItems: "center", marginBottom: "25px", marginTop: "18px" }}>
                  <Box sx={{ width: 60, height: 2, bgcolor: "#008755", marginBottom: "12px", marginTop: "17px" }} />
                  <Card
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      bgcolor: "#008755",
                      color: "white",
                      p: 1.1,
                      borderRadius: 2,
                      width: "100%",
                    }}
                  >
                    <Avatar
                      src={athlete?.athleteImage}
                      sx={{ width: 32, height: 32, mr: 1.5, border: "1px solid #fff" }}
                    />
                    <Box sx={{ flex: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Box>
                        <Typography sx={{ fontSize: "16px" }} className="dubai-bold text-capitalize">
                          {athlete?.athleteName}
                        </Typography>
                        {!teamID && (
                          <Typography sx={{ fontSize: "12px" }} className="dubai-regular text-capitalize">
                            {athlete?.sportName}
                          </Typography>
                        )}
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
                          <Typography sx={{ fontSize: "18px" }} className="bukra-semi-bold">
                            <CountAnimation value={Number(athlete?.totalMedals)} />
                          </Typography>
                          <Typography sx={{ fontSize: "12px" }} className="dubai-regular">
                            Medal
                          </Typography>
                        </Box>
                        <Box sx={{ width: "1px", height: "50px", backgroundColor: "#b7b0b0" }} />
                        <Box sx={{ textAlign: "center" }}>
                          <Typography sx={{ fontSize: "18px" }} className="bukra-semi-bold">
                            <CountAnimation value={Number(athlete?.totalScore)} />
                          </Typography>
                          <Typography sx={{ fontSize: "12px" }} className="dubai-regular">
                            Overall Score
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

export default AthleteViewMorePage