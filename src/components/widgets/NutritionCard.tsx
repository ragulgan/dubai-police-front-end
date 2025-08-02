import { Box, Grid, Typography } from "@mui/material";
import Image from "next/image";

import _ from "lodash";
import StaticFoodImage from "../../../public/staticFoodImage.svg";
import foulAndPizza from "../../../public/foulAndPizza.png";
import shakshuka from "../../../public/shakshuka.png";
import labnehPita from "../../../public/labnehPita.png";

const cardContainerStyle = {
  border: 1,
  borderColor: "#B1E4E3",
  borderRadius: 2,
};

const titleTextLeftStyle = {
  fontWeight: 500,
  fontSize: 16,
  color: "#FFFFFF",
  fontFamily: "29LT Bukra",
};

const titleTextRightStyle = {
  fontWeight: 700,
  fontSize: 13,
  color: "#FFFFFF",
  fontFamily: "Dubai-med",
};

const foodItemContainer = {
  display: "flex",
  alignItems: "center",
  justifyContent: "start",
  paddingLeft: 2,
};

const foodItemImageContainer = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "50%",
  overflow: "hidden",
  width: 40,
  height: 40,
};

const foodItemTextStyle = {
  padding: 1,
  fontWeight: 400,
  fontSize: 13,
  color: "#000000 ",
  fontFamily: "Dubai-med",
};

const NutritionText = {
  fontSize: 12,
  fontFamily: "Dubai-med",
  fontWeight: 400,
  color: "#58585B",
};

interface NutritionCardProps {
  title: string;
  time: string;
  items: any[];
}

const NutritionCard: React.FC<NutritionCardProps> = ({
  title,
  time,
  items,
}) => {
  const totalNutrition = items?.reduce(
    (acc, item) => {
      acc.calories += parseFloat(item.calories);
      acc.proteins += parseFloat(item.proteins);
      acc.carbs += parseFloat(item.carbs);
      acc.fats += parseFloat(item.fats);
      return acc;
    },
    { calories: 0, proteins: 0, carbs: 0, fats: 0 }
  );
  return (
    <>
      <Box sx={cardContainerStyle}>
        <Box
          sx={{
            backgroundColor: "#008755",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 2,
            borderTopLeftRadius: "8px",
            borderTopRightRadius: "8px",
          }}
        >
          <Typography
            variant="caption"
            sx={titleTextLeftStyle}
            className="bukra"
          >
            {title}
          </Typography>
          {/* <Typography variant="caption" sx={titleTextRightStyle}>
            {time}
          </Typography> */}
        </Box>
        <Box
          sx={{
            py: 1,
            px: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #E0E0E0",
          }}
        >
          <Typography
            variant="subtitle2"
            sx={NutritionText}
            className="dubai-med"
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: "#E88F00",
                display: "inline-block",
                marginRight: "4px",
              }}
            ></span>
            {`Calories ${totalNutrition?.calories}`}
          </Typography>
          <Typography
            variant="subtitle2"
            sx={NutritionText}
            className="dubai-med"
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: "#00205B",
                display: "inline-block",
                marginRight: "4px",
              }}
            ></span>
            {`Protein ${totalNutrition?.proteins}`}
          </Typography>
          <Typography
            variant="subtitle2"
            sx={NutritionText}
            className="dubai-med"
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: "#008755",
                display: "inline-block",
                marginRight: "4px",
              }}
            ></span>
            {`Carb ${totalNutrition?.carbs}`}
          </Typography>
          <Typography
            variant="subtitle2"
            sx={NutritionText}
            className="dubai-med"
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: "#E4002B",
                display: "inline-block",
                marginRight: "4px",
              }}
            ></span>
            {`Fat ${totalNutrition?.fats}`}
          </Typography>
        </Box>
        <Grid container spacing={1}>
          <Grid item xs={12} md={12}>
            {items?.map((item, index) => (
              <Box
                sx={{
                  ...foodItemContainer,
                  marginTop: 1,
                  marginBottom: 1,
                }}
                key={index}
              >
                <Box sx={{ ...foodItemImageContainer, marginRight: 1 }}>
                  {item?.filePath ? (
                    <Image
                      src={item?.filePath}
                      alt={item?.foodName}
                      width={40}
                      height={40}
                    />
                  ) : (
                    <StaticFoodImage
                      width={104}
                      height={130}
                      style={{ objectFit: "cover" }}
                    />
                  )}
                </Box>
                <Box>
                  <Typography
                    variant="subtitle1"
                    sx={foodItemTextStyle}
                    className="dubai-med"
                  >
                    {item?.foodName}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default NutritionCard;
