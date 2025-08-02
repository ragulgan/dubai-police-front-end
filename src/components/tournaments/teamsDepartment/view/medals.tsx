import React, { useEffect, useRef, useState } from "react";
import {
	Card,
	Grid,
	Box,
	Typography,
	Skeleton,
	CardContent,
	Avatar,
} from "@mui/material";
import Link from "next/link";
import ArrowOutwardOutlinedIcon from "@mui/icons-material/ArrowOutwardOutlined";
import { useRouter } from "next/router";


const MedalCounts: React.FC<any> = ({ phases }) => {
	const goldMedal = "/team-department/Gold.svg";
  	const silverMedal = "/team-department/Silvet.svg";
  	const brozeMedal = "/team-department/Bronze.svg";

	return (
		<>
			{/* {getLatestResultData && getLatestResultData?.loading && (
                <Card
                  sx={{
                    p: 2,
                    boxShadow: "none",
                    borderRadius: "8px",
                    height: "280px",
                  }}
                >
                  <Skeleton variant="text" sx={{ fontSize: "1rem" }} width={"40%"} />
                  <Skeleton variant="text" sx={{ fontSize: "0.5rem" }} width={"30%"} />
                  <Skeleton
                    variant="rectangular"
                    width={"100%"}
                    height={"204px"}
                    sx={{ mt: 1, borderRadius: "20px" }}
                  />
                </Card>
              )} */}
			<Card
				sx={{
					backgroundColor: "#FFFFFF",
					maxWidth: "100%",
					height: "280px",
					borderRadius: '8px',

				}}>
				<CardContent sx={{ p: 2 }}>
					<Grid item md={12}>
						<Box
							sx={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								mb: 2,
							}}
						>
							<Typography
								sx={{
									fontSize: "18px",
								}}
								className="bukra"
							>
								Medals
							</Typography>
							<Link
								href={""}
								style={{
									fontSize: "18px",
									color: "#58585B",
									cursor: "pointer",
									textDecoration: "none",
									display: "flex",
								}}
								className="dubai-regular"
							>
								<ArrowOutwardOutlinedIcon />
							</Link>
						</Box>
					</Grid>
					<Grid item md={12}>
						<Box
							sx={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
							}}
						>
							<Card className="view-medal-gold" sx={{display: 'grid', position: 'relative', placeContent:'end', placeItems: 'end'}}>
								<Avatar
									src={goldMedal}
									alt={"Gold Medal"}
									sx={{
										position: 'absolute', 
										top: 0, 
										left: 0, 
										opacity: '75%',
										width: '74px',
										height: '117px'

									}}
									variant="square"
								/>
								<Typography className="bukra view-medal-font" p={1}>
									Gold
								</Typography>
								<Typography className="bukara view-medal-count-gold" p={1}>
									 10
								</Typography>
							</Card>
							<Card className="view-medal-sliver" sx={{display: 'grid', position: 'relative', placeContent:'end', placeItems: 'end'}}>
								<Avatar
									src={silverMedal}
									alt={"Silver Medal"}
									sx={{
										position: 'absolute', 
										top: 0, 
										left: 0, 
										opacity: '75%',
										width: '72px',
										height: '117px'

									}}
									variant="square"
								/>
								<Typography className="bukra view-medal-font" p={1}>
									Silver
								</Typography>
								<Typography className="bukra view-medal-count-silver" p={1}>
									12
								</Typography>
							</Card>
							<Card className="view-medal-bronze" sx={{display: 'grid', position: 'relative', placeContent:'end', placeItems: 'end'}}>
								<Avatar
									src={brozeMedal}
									alt={"Broze Medal"}
									sx={{
										position: 'absolute', 
										top: 0, 
										left: 0, 
										opacity: '75%',
										width: '62px',
										height: '111px',
										ml: 0.5

									}}
									variant="square"
								/>
								<Typography className="bukra view-medal-font" p={1}>
									Bronze
								</Typography>
								<Typography className="bukara view-medal-count-bronze" p={1}>
									18
								</Typography>
							</Card>
						</Box>
					</Grid>
				</CardContent>
			</Card>
		</>
	);
};

export default MedalCounts;