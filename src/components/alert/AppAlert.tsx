import { Alert } from "@mui/material";

type AppAlertProps = {
  type: "info" | "error";
  message: string;
}

const AppAlert: React.FC<AppAlertProps> = ({ type, message }) => {
  return (
    <Alert className="dubai-med" severity={type}>
      {message}
    </Alert>
  )
}

export default AppAlert;