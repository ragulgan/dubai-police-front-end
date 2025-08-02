"use client"
import { Card, CardContent, CardHeader, Grid, Typography } from "@mui/material"
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import ViewTestCardValue from "./ViewTestCardValue";

interface ViewTestCardProps {
  title: string;
  data: any;
}

const ViewTestCard: React.FC<ViewTestCardProps> = ({ title, data }) => {

  const RenderEditorContentHtml = ({ content }: { content: string }) => {
    const stripHtmlTags = (html: string) => {
      const div = document.createElement("div");
      div.innerHTML = html;
      return div.textContent || div.innerText || "";
    };
    const plainText = stripHtmlTags(content);
    return (
      <div
      >
        {plainText}
      </div>
    );
  };
  const commentData: any = <RenderEditorContentHtml content={data.comments} />;

  return (
    <Card sx={{}}>
      <CardHeader
        avatar={<ListOutlinedIcon />}
        title={title}
        className="primary-color card-header"
      />
      <CardContent sx={{}}>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <ViewTestCardValue label={"Test Result"} value={data.testResult} />
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
            <ViewTestCardValue label={"Medical Clearance Status"} value={data.medicalStatus} />
          </Grid>
          <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
            <ViewTestCardValue label={"Recovery Plan"} value={data.recoveryPlan} />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <ViewTestCardValue label={"Supporting Documents"} value={data.supportingDocuments} isLink={data.supportingDocuments ? true : false} />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <ViewTestCardValue label={"Comments"} value={commentData} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default ViewTestCard;