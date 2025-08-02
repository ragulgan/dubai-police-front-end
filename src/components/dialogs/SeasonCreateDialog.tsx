import { Box, Button, Dialog, DialogContent } from "@mui/material";
import Competition from "../../../public/Competition.svg";
import Training from "../../../public/Training.svg";
import Events from "../../../public/Events.svg";
import Remainder from "../../../public/Remainder.svg";
import Meetings from "../../../public/Meetings.svg";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { isEmpty } from "lodash";

interface SeasonCreateDialogProps {
  openDialog: boolean;
  handleClose: (event: React.ChangeEvent<HTMLInputElement>) => void;
  // setType: (value: string) => void;
  handleMenuSelect: (selected: string) => void;
}

const SeasonCreateDialog: React.FC<SeasonCreateDialogProps> = ({
  openDialog,
  handleClose,
  //setType,
  handleMenuSelect,
}) => {
  const router = useRouter();
  const { create }: any = router.query;
  console.log("create ", create);
  useEffect(() => {
    if (!isEmpty(create)) {
      handleMenuSelect(create);
    }
  }, [create]);

  return (
    <>
      <Dialog
        open={openDialog}
        onClose={handleClose}
        sx={{
          borderRadius: "8px",
        }}
      >
        <DialogContent>
          <Box
            display="flex"
            flexDirection="column"
            mt={2}
            mb={2}
            alignItems="center"
          >
            {/* First row */}
            <Box display="flex" justifyContent="center" flexWrap="wrap" gap={1}>
              <Button
                variant="contained"
                className="dubai-med text-capitalize"
                startIcon={<Competition />}
                sx={{
                  width: "152px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  height: "80px",
                  padding: "16px 10px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "8px",
                  textAlign: "center",
                }}
                // onClick={() => router.push(`/tournaments/commander/seasons/add?type=competition`)}
                onClick={() => {
                  //   setType('tournament');
                  handleMenuSelect("tournament");
                }}
              >
                Competition/Tournament
              </Button>
              <Button
                variant="contained"
                className="dubai-med text-capitalize"
                startIcon={<Events />}
                sx={{
                  width: "152px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  height: "80px",
                  padding: "16px 10px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "8px",
                  "& .MuiButton-startIcon": {
                    margin: 0,
                  },
                }}
                onClick={() => handleMenuSelect("event")}
                //  onClick={() => router.push(`/tournaments/commander/seasons/add`)}
              >
                Events/Initiative
              </Button>
              <Button
                variant="contained"
                className="dubai-med text-capitalize"
                startIcon={<Events />}
                sx={{
                  width: "152px",
                  height: "80px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  padding: "16px 10px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "8px",
                  "& .MuiButton-startIcon": {
                    margin: 0,
                  },
                }}
                onClick={() => handleMenuSelect("fitness")}
              >
                Fitness Program
              </Button>
            </Box>
            <Box
              display="flex"
              justifyContent="center"
              flexWrap="wrap"
              gap={1}
              mt={2}
            >
              <Button
                variant="contained"
                className="dubai-med text-capitalize"
                startIcon={<Training />}
                sx={{
                  width: "152px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  height: "80px",
                  padding: "16px 10px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "8px",
                  "& .MuiButton-startIcon": {
                    margin: 0,
                  },
                }}
                onClick={() => handleMenuSelect("training")}
              >
                Training Courses
              </Button>
              <Button
                variant="contained"
                className="dubai-med text-capitalize"
                startIcon={<Meetings />}
                sx={{
                  width: "152px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  height: "80px",
                  padding: "16px 10px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "8px",
                  "& .MuiButton-startIcon": {
                    margin: 0,
                  },
                }}
                onClick={() => handleMenuSelect("awareness")}
              >
                Awareness Activity
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SeasonCreateDialog;
