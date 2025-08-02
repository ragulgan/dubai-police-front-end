import { Box, Card, Chip, Typography } from "@mui/material";
import Carousel from "react-material-ui-carousel";
import RenderHtmlContent from "../common/RenderHtmlContent";
import { useRouter } from "next/router";
import { checkAccess } from "@/utils/acessscheck";
import { USER_PERMISSION } from "@/utils/constants";

const CardCarousel = (props: any) => {
  const { listNewsData, module } = props;
  const router = useRouter();

  return (
    <Carousel
      autoPlay={true}
      interval={3000}
      animation="fade"
      indicators={false}
      navButtonsAlwaysInvisible={false}
    >
      {listNewsData &&
        listNewsData
          .slice(module === "clubNews" ? 4 : 0, module === "clubNews" ? 9 : 4)
          .map((item: any, index: number) => (
            <Card
              key={index}
              sx={{
                height: "550px",
                width: "100%",
                backgroundImage: `url(${item?.filePath})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                color: "white",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                position: "relative",
                overflow: "hidden",
                cursor: "pointer",
                "&:hover .hover-title": {
                  opacity: 1,
                },
              }}
              onClick={() => {
                if (checkAccess(USER_PERMISSION.NewsView)) {
                  router.push(`news/view/${item && item.newsID}`);
                }
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  p: 2,
                  textAlign: "start",
                  height: "406px",
                  background:
                    "linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1))",
                  width: "100%",
                  alignContent: "end",
                  zIndex: 2,
                }}
              >
                <Typography
                  className="bukra-semi-bold webkit-line-clamp webkit-2"
                  fontSize={"28px"}
                >
                  {item?.articleTitle}
                </Typography>
                <Typography className="dubai-regular" fontSize={"16px"}>
                  {item?.newsDate}
                </Typography>
                <Typography
                  className="dubai-regular webkit-line-clamp webkit-2"
                  fontSize={"16px"}
                  lineHeight={"25.6px"}
                  width={"80%"}
                  my={3}
                >
                  <RenderHtmlContent content={item && item?.paragraph} />
                </Typography>
              </Box>
              <Box
                sx={{
                  position: "absolute",
                  bottom: "10%",
                  right: "1%",
                  transform: "translate(-50%, -50%)",
                  display: "flex",
                  gap: 1,
                  zIndex: 99999,
                }}
              >
                {listNewsData &&
                  listNewsData
                    .slice(
                      module === "clubNews" ? 4 : 0,
                      module === "clubNews" ? 9 : 4
                    )
                    .map((_: any, idx: any) => (
                      <Chip
                        key={idx}
                        size="small"
                        sx={{
                          width: 16,
                          height: 6,
                          borderRadius: "8px",
                          bgcolor: idx === index ? "#008755" : "#ffffff",
                        }}
                      />
                    ))}
              </Box>
            </Card>
          ))}
    </Carousel>
  );
};

export default CardCarousel;
