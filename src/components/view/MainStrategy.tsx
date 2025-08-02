"use client";
import { Box } from "@mui/material";

interface MainStrategyProps {
  data?: any;
  module?: any;
}

const MainStrategy: React.FC<MainStrategyProps> = ({ data, module }) => {
  const RenderEditorContent = ({ content }: { content: string }) => {
    return (
      <div
       data-testid="main-strategy"
        dangerouslySetInnerHTML={{ __html: content }}
        style={{
          padding: "10px",
          border: "1px dashed #26D07C",
          borderRadius: "4px",
          backgroundColor: "rgba(38, 208, 124, 0.1)",
          fontSize: "16px",
          fontWeight: 500,
          color: "#58585B",
        }}
        className="dubai-med"
      />
    );
  };
  return (
    <Box py={1} px={0.5}>
      <RenderEditorContent content={data?.mainStrategy} />
    </Box>
  );
};

export default MainStrategy;
