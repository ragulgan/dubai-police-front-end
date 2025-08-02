import { Tooltip, Typography } from "@mui/material";

type TitleTypographyProps = {
  text: string;
}
const TitleTypography: React.FC<TitleTypographyProps> = ({ text }) => {
  return (
    <Tooltip title={text}>
      <Typography
        sx={{
          marginTop: 2,
          fontWeight: 600,
          fontSize: 16,
          color: "#000000",
        }}
        className="bukra-semi-bold webkit-line-clamp webkit-1"
      >
        {text}
      </Typography>
    </Tooltip>
  )
}

export default TitleTypography;