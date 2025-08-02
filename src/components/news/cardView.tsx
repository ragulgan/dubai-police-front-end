import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import RenderHtmlContent from "../common/RenderHtmlContent";
import { useRouter } from "next/router";
import NewsBannerImg from "../../../public/staticFoodImage.svg";
import _ from "lodash";
import { checkAccess } from "@/utils/acessscheck";
import { USER_PERMISSION } from "@/utils/constants";

const CardView = (props: any) => {
  const { title, date, paragraph, image, id } = props;
  const router = useRouter();
  return (
    <Card sx={{ width: "100%" }}>
      <CardActionArea
        onClick={() => {
          if (checkAccess(USER_PERMISSION.NewsView)) {
            router.replace(`/news/view/${id && id}`);
          }
        }}
      >
        {_.isEmpty(image) ? (
          <NewsBannerImg
            style={{
              width: "100%",
              borderRadius: "8px",
              height: "199px",
            }}
            className="static-image"
          />
        ) : (
          <CardMedia
            component="img"
            height="199"
            image={_.isEmpty(image) ? NewsBannerImg : image}
            alt={title && title}
          />
        )}
        <CardContent sx={{ height: "160px" }}>
          <Typography
            gutterBottom
            className="bukra-semi-bold webkit-line-clamp webkit-2"
          >
            {title && title}
          </Typography>
          <Typography gutterBottom className="dubai-regular" fontWeight={400}>
            {date && date}
          </Typography>
          <Typography
            variant="body2"
            className="dubai-med webkit-line-clamp webkit-2"
          >
            <RenderHtmlContent content={paragraph && paragraph} />
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default CardView;
