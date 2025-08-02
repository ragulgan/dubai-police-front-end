import React, { useEffect, useState } from "react";
import {
    Card,
    Grid,
    Typography,
    Button,
    Box,
    Divider,
    Step,
    StepLabel,
    Stepper,
    Paper,
    StepContent,
} from "@mui/material";
import TableChart from "@mui/icons-material/ArrowDownward";
import Image from "next/image";
import XLS from "../../../public/svg/xls.svg";
import Vector from "../../../public/svg/Vector.svg";
import SettingsIcon from "@mui/icons-material/Settings";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { LineChart } from "@mui/x-charts";
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

interface ViewPageNavProps {
    label?: string;
    expanded?: boolean;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
}
const TeamOverviewResultsAchieved: React.FC<ViewPageNavProps> = ({
    label,
    expanded,
    onClick,
}) => {
    const steps = [
        {
            label: "Regional Championship Winner",
            description:
                "Led Dubai Police Football Team to victory in the Dubai Region Championship.",
            color: "#663259",
            date: "15 Oct 2024"
        },
        {
            label: "Best Coach Award -",
            description: "Received the Best Coach Award for exceptional leadership.",
            color: "#1BC5BD",
            date: "15 Oct 2024"
        },
        {
            label: "UAE Cup Finalist",
            description: "Successfully guided the team to the finals of the UAE Cup, showcasing tactical excellence and team cohesion.",
            color: "#F64E60",
            date: "15 Oct 2024"
        },
        {
            label: "Increased Win Rate",
            description: `Improved the team's win rate from 60% to 78% over two seasons through enhanced training regimens.`,
            color: "#EF6327",
            date: "15 Oct 2024"
        },
        {
            label: "Youth Development Program",
            description: `Implemented a youth development program that resulted in three players being promoted to the senior team.`,
            color: "#8950FC",
            date: "15 Oct 2024"
        },
    ];
    const [chartHeight, setChartHeight] = useState<any>(0);
    const [activeStep, setActiveStep] = useState(0);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    const data = [2, 4, 6, 8, 6];
    const xData = [
        "12 Sep",
        "15 Sep",
        "25 Sep",
        "1 Oct",
        "15 Oct"
    ];
    const yData = [8, 6, 4, 2, 0];

    type ViewBox = {
        x?: number;
        y?: number;
        width?: number;
        height?: number;
    };

    const viewBox: ViewBox = {
        x: 0,
        y: 0,
        height: chartHeight + 20
    };

    useEffect(() => {
        const height: any = document?.getElementById('chartHeight')?.clientHeight;
        setChartHeight(height)
    }, [])

    return (
        <>
            <Box
                className="bg-white"
                sx={{
                    marginTop: 1,
                    marginBottom: 1,
                    padding: 1,
                    borderRadius: "8px",
                }}
                pt={2}
            >
                <Grid
                    container
                    alignItems="center"
                    spacing={1}
                    sx={{ cursor: "pointer" }}
                    onClick={onClick}
                >
                    <Grid item xs={4}>
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                        >
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    padding: 1,
                                    fontWeight: 700,
                                    fontSize: "18px",
                                    color: "#008755",
                                    fontFamily: "29LT Bukra",
                                    lineHeight: "21.6px",
                                    textAlign: "left",
                                }}
                                className="bukra"
                            >
                                {label}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={8}>
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="flex-end"
                            sx={{ gap: 1, height: 36 }}
                        >
                            <Typography
                                sx={{
                                    fontFamily: "'29LT Bukra', sans-serif",
                                    fontSize: "18px",
                                    fontWeight: 700,
                                    lineHeight: "21.6px",
                                    textAlign: "left",
                                    color: "#008755",
                                }}
                                className="bukra"
                            >
                                Team Performance in Latest Matches
                            </Typography>
                            <Button
                                variant="outlined"
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    // width: '130px',
                                    height: "29px",
                                    padding: "3px 10px",
                                    borderRadius: "6px",
                                    border: "1px solid rgba(0, 135, 85, 1)",
                                    backgroundColor: "rgba(0, 135, 85, 0.1)",
                                    color: "#008755",
                                    fontFamily: "Dubai",
                                    fontSize: "13px",
                                    fontWeight: 500,
                                    lineHeight: "21.94px",
                                    textAlign: "left",
                                    textTransform: "none",
                                }}
                                className="dubai-med"
                                startIcon={
                                    <XLS
                                        alt="xls"
                                        style={{
                                            width: "19.48px",
                                            height: "20.22px",
                                            color: "#008755",
                                            marginLeft: "6px",
                                        }}
                                    />
                                }
                                onClick={(e) => { e.stopPropagation() }}
                            >
                                Export to Excel
                            </Button>
                            <Button
                                variant="outlined"
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    // width: '84px',
                                    height: "29px",
                                    padding: "3px 10px",
                                    borderRadius: "6px",
                                    border: "1px solid rgba(0, 135, 85, 1)",
                                    backgroundColor: "#008755",
                                    color: "#FFFFFF",
                                    fontFamily: "Dubai",
                                    fontSize: "13px",
                                    fontWeight: 500,
                                    lineHeight: "21.94px",
                                    textAlign: "left",
                                    textTransform: "none",
                                }}
                                onClick={(e) => { e.stopPropagation() }}
                                className="dubai-med"
                                startIcon={
                                    <Vector
                                        alt="xls"
                                        style={{
                                            width: "14.4px",
                                            height: "15.30px",
                                            color: "#FFFFFF",
                                            marginLeft: "6px",
                                        }}
                                    />
                                }
                            >
                                Update
                            </Button>
                            {!expanded ? (
                                <Box><NavigateNextIcon sx={{ cursor: "pointer" }} /></Box>
                            ) : (
                                <Box><ExpandMoreIcon sx={{ cursor: "pointer" }} /></Box>
                            )}
                        </Box>
                    </Grid>
                </Grid>
                <Grid container alignItems="center" spacing={1}>
                    <Grid item sm={6} md={5.5} lg={5} xl={4} justifyContent={"center"} id='chartHeight'>
                        <Box px={1}>
                            <Stepper orientation="vertical" className="vertical-line">
                                {steps.map((step, index) => (
                                    <Step key={step.label} sx={{ display: 'flex', alignItems: 'center', my: 1, minHeight: '61px' }}>
                                        <Box width={'15%'}>
                                            <Typography className="dubai-med stepper-description-view secondary-color" px={1} textAlign={'center'}>
                                                {step.date}
                                            </Typography>
                                        </Box>
                                        <StepLabel
                                            icon={
                                                <RadioButtonUncheckedIcon
                                                    style={{
                                                        color: `${step.color}`,
                                                        width: 12,
                                                        height: 12
                                                    }}
                                                />
                                            }
                                            sx={{ width: '85%', p: 0 }}
                                        >
                                            <Typography className="dubai-med stepper-label-view primary-color">
                                                {step.label}
                                            </Typography>
                                            <Typography className="dubai-med stepper-description-view secondary-color">
                                                {step.description}
                                            </Typography>
                                        </StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                        </Box>
                    </Grid>
                    <Grid item sm={6} md={6.5} lg={7} xl={8} p={2} className="dubai-med">
                        <LineChart
                            xAxis={[{ data: xData, scaleType: "point", label: 'Latest Matches' }]}
                            yAxis={[{ data: yData, scaleType: "point", label: 'Score Points' }]}
                            series={[
                                { data, showMark: false, area: true, connectNulls: true, color: "#26D07C" },
                            ]}
                            height={chartHeight}
                            viewBox={viewBox}
                            margin={{ top: 10, bottom: 20 }}
                            className="chart-liner-list"
                        />
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

export default TeamOverviewResultsAchieved;