import { SxProps, Theme, Typography } from "@mui/material";

interface RenderHtmlContentProps {
  content: string;
  sx?: SxProps<Theme>;
}

const RenderHtmlContent: React.FC<RenderHtmlContentProps> = ({
  content,
  sx,
}) => {
  return (
    <Typography className="dubai-med" sx={{ ...sx }}>
      {content ? <div dangerouslySetInnerHTML={{ __html: content }} /> : "--"}
    </Typography>
  );
};

export default RenderHtmlContent;
