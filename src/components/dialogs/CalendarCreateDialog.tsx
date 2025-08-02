import { Box, Button, Dialog, DialogContent } from "@mui/material";
import Competition from "../../../public/Competition.svg";
import Training from "../../../public/Training.svg";
import Events from "../../../public/Events.svg";
import Remainder from "../../../public/Remainder.svg";
import Meetings from "../../../public/Meetings.svg";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { isEmpty } from "lodash";

interface CalendarCreateDialogProps {
  openDialog: boolean;
  handleClose: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleMenuSelect: (selected: string) => void;
}

const CalendarCreateDialog: React.FC<CalendarCreateDialogProps> = ({
  openDialog,
  handleClose,
  handleMenuSelect,
}) => {
  const router = useRouter();
  const { teamID } = router.query;
  const { create }: any = router.query;

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
                  width: "166px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  height: "80px",
                  padding: "10px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "8px",
                  textAlign: "center",
                }}
                // onClick={() => handleMenuSelect("tournament")}
                onClick={() => router.push(`/teams/${teamID}/raceCalendar/add`)}
              >
                Tournament / Competition
              </Button>
              <Button
                variant="contained"
                className="dubai-med text-capitalize"
                startIcon={<Training />}
                sx={{
                  width: "166px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  height: "80px",
                  padding: "16px",
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
                Training
              </Button>
              <Button
                variant="contained"
                className="dubai-med text-capitalize"
                startIcon={<Events />}
                sx={{
                  width: "166px",
                  height: "80px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  padding: "12px",
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
              >
                Events
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
                startIcon={<Remainder />}
                sx={{
                  width: "166px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  height: "80px",
                  padding: "12px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "8px",
                  "& .MuiButton-startIcon": {
                    margin: 0,
                  },
                }}
                onClick={() => handleMenuSelect("remainder")}
              >
                Reminders
              </Button>
              <Button
                variant="contained"
                className="dubai-med text-capitalize"
                startIcon={<Meetings />}
                sx={{
                  width: "166px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  height: "80px",
                  padding: "12px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "8px",
                  "& .MuiButton-startIcon": {
                    margin: 0,
                  },
                }}
                onClick={() => handleMenuSelect("meeting")}
              >
                Meetings
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CalendarCreateDialog;
