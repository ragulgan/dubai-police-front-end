import { Tooltip, Typography } from "@mui/material";

type CardDescriptionTypographyProps = {
  text: string;
}
const CardDescriptionTypography: React.FC<CardDescriptionTypographyProps> = ({ text }) => {
  return (
    <Tooltip title={text}>
      <Typography
        sx={{
          marginTop: 1,
          fontSize: "16px",
          color: "#58585B",
        }}
        className="dubai-regular webkit-line-clamp webkit-1"
      >
        {text}
      </Typography>
    </Tooltip>
  )
}

export default CardDescriptionTypography;
