"use client";
import { Card, CardContent, CardHeader, Grid, Typography } from "@mui/material";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import ViewTestCardValue from "../ViewTestCardValue";
import { usePathname } from "next/navigation";

interface ViewTestCardProps {
  title: string;
  data: any;
}

const ViewTestCard: React.FC<ViewTestCardProps> = ({ title, data }) => {
  const currentNav = usePathname();
  const currentPath = currentNav?.split("/")[3];
  const dynamicLabel = currentPath === "fitness" ? "Final Comments" : "Comments";

  const RenderEditorContentHtml = ({ content }: { content: string }) => {
    const stripHtmlTags = (html: string) => {
      const div = document.createElement("div");
      div.innerHTML = html;
      return div.textContent || div.innerText || "";
    };
    const plainText = stripHtmlTags(content);
    return <div>{plainText}</div>;
  };
  const commentData: any = <RenderEditorContentHtml content={data.comments} />;
  function extractFilename(filePath: any) {
    return filePath.replace(/^.*[\\\/]/, "");
  }
  const fileName: any = extractFilename(data.supportingDocuments);
  return (
    <Card sx={{ height: "100%" }}>
      <CardHeader
        avatar={<ListOutlinedIcon />}
        title={title}
        className="primary-color card-header"
      />
      <CardContent>
        <Grid container spacing={2} sx={{ display: "flex", alignItems: "stretch" }}>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <ViewTestCardValue label={"Test Result"} value={data.testResult} />
          </Grid>
          <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
            <ViewTestCardValue label={"KPI Name"} value={data.kpiName} />
          </Grid>
          <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
            <ViewTestCardValue label={"KPI Point"} value={data.kpiPoint} />
          </Grid>
          <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
            <ViewTestCardValue label={"Date"} value={data.date} />
          </Grid>
          <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
            <ViewTestCardValue label={"Time"} value={data.time} />
          </Grid>
          <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
            <ViewTestCardValue label={"Conducting Staff"} value={data.staff} />
          </Grid>
          <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
            <ViewTestCardValue label={"Location"} value={data.location} />
          </Grid>
          <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
            <ViewTestCardValue
              label={"Medical Clearance Status"}
              value={data.medicalStatus}
            />
          </Grid>
          <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
            <ViewTestCardValue
              label={"Recovery Plan"}
              value={data.recoveryPlan}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <ViewTestCardValue
              label={"Supporting Documents"}
              value={fileName}
              isLink={data.supportingDocuments ? true : false}
              isLinkData={data.supportingDocuments}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <ViewTestCardValue label={dynamicLabel} value={commentData} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ViewTestCard;
