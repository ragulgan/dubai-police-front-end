import { getGlobalData } from "@/redux/slices/dashboard/getGlobalDataSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { Card, Box, Typography, Skeleton } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";

const GlobalDataTrends: React.FC = () => {
  const cardGraph = useRef<HTMLImageElement>(null);
  const [innerHeight, setInnerHeight] = useState<any>("");
  const dispatch: AppDispatch = useDispatch();
  const getGlobalDataList = useSelector(
    (state: RootState) => state.getGlobalData
  );

  const dispatchGetGlobalData = () => {
    const payload = {
      sportID: 0,
    };
    dispatch(getGlobalData({ url: "/GetGlobalDataList", payload: payload }));
  };

  useEffect(() => {
    dispatchGetGlobalData();
  }, []);

  const mappedMarkers = Array.isArray(getGlobalDataList.data)
    ? getGlobalDataList?.data?.map((country: any) => ({
        ...country,
        markerOffset: 25,
        coordinates: JSON.parse(country.coordinates),
      }))
    : null;

  useEffect(() => {
    setInnerHeight(cardGraph.current?.clientHeight);
  }, [cardGraph]);

  return (
    <>
      {getGlobalDataList && getGlobalDataList?.loading && (
        <Card
          sx={{
            p: 2,
            boxShadow: "none",
            borderRadius: "8px",
            height: "420px",
          }}
        >
          <Skeleton variant="text" sx={{ fontSize: "1rem" }} width={"40%"} />
          <Skeleton variant="text" sx={{ fontSize: "0.5rem" }} width={"30%"} />
          <Skeleton
            variant="rectangular"
            width={"100%"}
            height={"350px"}
            sx={{ mt: 1, borderRadius: "20px" }}
          />
        </Card>
      )}
      {getGlobalDataList && !getGlobalDataList?.loading && (
        <Card
          sx={{
            maxWidth: "100%",
            background: "#FFFFFF",
            color: "#000000",
            borderRadius: 2,
            paddingLeft: "24px",
            paddingRight: "49px",
            paddingTop: "20px",
            paddingBottom: "0px",
            height: "428px",
            boxShadow: "none",
          }}
          ref={cardGraph}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{ fontSize: "18px", fontWeight: 500 }}
              gap={1}
              className="bukra"
            >
              Global Data Trends
            </Typography>
          </Box>
          <Box
            style={{
              height: innerHeight && innerHeight - 100,
              overflow: "hidden",
            }}
          >
            <ComposableMap>
              <Geographies geography="/dashboard/features.json">
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="#E9ECF1"
                      style={{
                        default: { outline: "none" },
                        hover: { outline: "none" },
                        pressed: { outline: "none" },
                      }}
                    />
                  ))
                }
              </Geographies>
              {mappedMarkers?.map((country: any) => (
                <Marker
                  key={country?.countryID}
                  coordinates={country?.coordinates}
                  id={country?.countryID}
                >
                  <circle r={7} fill="#008755" stroke="#fff" strokeWidth={2} />
                  <text
                    textAnchor="middle"
                    y={country?.markerOffset}
                    style={{ fontFamily: "system-ui", fill: "#5D5A6D" }}
                  >
                    {country?.countryName}
                  </text>
                </Marker>
              ))}
            </ComposableMap>
          </Box>
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            mt={3}
          >
            <Box
              sx={{
                width: "8px",
                height: "8px",
                bgcolor: "#008755",
                borderRadius: "50%",
                mr: 0.5,
              }}
            />
            <Typography
              className="dubai-regular"
              sx={{
                fontSize: "16px",
                lineHeight: "100%",
              }}
            >
              Camp
            </Typography>
          </Box>
        </Card>
      )}
    </>
  );
};

export default GlobalDataTrends;
