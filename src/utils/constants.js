import CyclingSvg from "../../public/svg/Cycling.svg";
import SwatSvg from "../../public/svg/Swat.svg";
import RowingOlympicSvg from "../../public/svg/RowingOlympic.svg";
import AthleticsSvg from "../../public/svg/Athletics.svg";
import BadmintonSvg from "../../public/svg/Badminton.svg";
import BodybuildingSvg from "../../public/svg/Bodybuilding.svg";
import BowlingSvg from "../../public/svg/Bowling.svg";
import CricketSvg from "../../public/svg/Cricket.svg";
import EquestrianSvg from "../../public/svg/Equestrian.svg";
import FirefighterChallengeTeamSvg from "../../public/svg/FirefighterChallengeTeam.svg";
import FitnessSvg from "../../public/svg/Fitness&ObstaclesTeam.svg";
import FootballSvg from "../../public/svg/Football.svg";
import JetSkiSvg from "../../public/svg/Jet-ski.svg";
import JuJitsuSvg from "../../public/svg/Ju-Jitsu.svg";
import KarateSvg from "../../public/svg/Karate.svg";
import MMASvg from "../../public/svg/MMA.svg";
import ShootingSvg from "../../public/svg/Shooting.svg";
import SwimmingSvg from "../../public/svg/Swimming.svg";
import TaekwondoSvg from "../../public/svg/Taekwondo.svg";
import PadelsVG from "../../public/svg/Padel.svg";
import TraditionalRowingSvg from "../../public/svg/TraditionalRowing.svg";
import SkiSvg from "../../public/svg/Ski.svg";
import VerifiedIcon from "@mui/icons-material/Verified";
import ErrorIcon from "@mui/icons-material/Error";
import WarningIcon from "@mui/icons-material/Warning";
import InfoIcon from "@mui/icons-material/Info";
import logo from "../../public/logo.png";

export const SESSION = {
  AUTH_ROLE: "auth_role",
  AUTH_TOKEN: "auth_token",
  TOKEN: "token",
  ACCESS_MATRIX: "access_matrix",
  EXPIRED: "session_expired",
  RESET_TOKEN: "resetToken",
  AUTH_FAILED: "Auth failed",
  LAST_INTERACTION_TIME: "lastInteractionTime",
  IDLE_TIME: 30,
};
export const DATE = {
  TIME: "Time",
  TIME_INTERVAL: 15,
  TWELVE_HRS_FORMAT: "h:mm A",
  DATE_TIME_FORMAT: " D/MM/YYYY, h:mm A",
  DATE_ONLY: "DD/MM/YYYY",
  DATE_FOR_PICKER: "yyyy/MM/dd",
  DATE_MONTH_ONLY: "dd/MM",
  DATE_MONTH_ONLY__: "DD/MM",
  MONTH_ONLY: "MM",
  YEAR_ONLY: "yyyy",
  EXAMPLE_DATE: "2017-03-13",
  DATE_FORMAT: "YYYY-MM-DD",
  DATE_FORMAT_MINS: "MMM-DD-YYYY, hh:mm",
  DATE_FOR_PICKER_MONTH: "MM",
};

export const HEADER = {
  CONTENT_TYPE: "application/json",
  MULTIPART_CONTENT_TYPE:
    "multipart/form-data,boundary=----WebKitFormBoundaryyrV7KO0BoCBuDbTL",
  TIMEOUT: 60000,
};

export const REGEX = {
  EMAIL: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.com$/,
  GOVERMENT_EMAIL: /^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)?gov\.ae$/i,
  // EMAIL: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
  DOB: /^\d{2}[-/.]\d{2}[-/.]\d{4}$/,
  PHONE: /^[0][1-9]\d{9}$|^[1-9]\d{9}$/,
  PHONE_NUMBER_1: /^[0-9]+(-[0-9]+)+$/,
  PHONE_NUMBER:
    /^(1\s?)?((\([0-9]{3}\))|[0-9]{3})[\s-]?[\0-9]{3}[\s-]?[0-9]{4}$/,
  PHONE_NUMBER_2: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im,
  NUMERIC: /^[0-9]+$/,
  WEIGHT: /^\d*\.?\d{0,2}$/,
  NUMERIC_CHARS: /^[0-9-_]+$/,
  PASSWORD: /^[a-zA-Z0-9@#^\-_$]*$/,
  PASSWORD_MIN_MAX_LENGTH:
    /(?=^.{7,14}$)(?=.*\d)(?=.*[!@#$%^&*]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
  PASSWORD_SMALL_CAPITAL_NUMBER_SPECIAL_CHARS:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,14}$/,
  TEXT: /^[a-zA-Z_.,()/:\s ]*$/,
  ALPHA_UPPER_CASE: /^[A-Z]*$/,
  ALPHA_NUMERIC: /^[a-zA-Z0-9 /]*$/,
  ALPHA_NUMERIC_FOURTEEN_CHARS: /^([a-zA-Z0-9_-]){14}$/,
  ALPHA_NUMERIC_CHARS: /^[a-zA-Z0-9@#^\-_$/]*$/,
  ALPHA_NUMERIC_CHARS_SPACE: /^[a-zA-Z0-9@^\-_.,àâçéèêëîïôûùüÿñæœ +g]*$/,
  ALPHA_NUMERIC_SPECIAL_CHARS:
    /^[a-zA-Z0-9@^\-_:/'"{}|.,àâçéèêëîïôûùüÿñæœ +g]*$/,
  ALPHA_CHARS_SPACE: /^[a-zA-Z^-_$.,àâçéèêëîïôûùüÿñæœ +g]*$/,
  ZIP_CODE: /^([0-9]){6}$/,
  ZIP_CODE_1: /^(?=.*\d.*)[A-Za-z0-9]{3,10}$/,
  CAID_NUMBER: /^([0-9]){6,8}$/,
  BIN_NUMBER: /^([0-9]){4,6}$/,
  NUMERIC_SIX_DIGITS: /^([0-9]{6}|[0-9]{8})$/,
  NUMERIC_FOUR_DIGITS: /^([0-9]){4}$/,
  SPACE: / +/g,
  URL: /^(ftp|http|https):\/\/[^ "]+\.[a-zA-Z]{2,4}$/,
  URL_ONE: /^(ftp|http|https):\/\/[^ "]+$/,
  ALPHA_NUMERIC_DOT: /^[a-zA-Z0-9 /.]*$/,
  SPECIALCHARCTERS: /^[a-zA-Z0-9\-\.,()/:\s]*$/,
};

export const AUTH_TOKEN = "sdfa";

export const API_MESSAGES = {
  SOMETHING_WRONG: "Something went wrong. Please try again later!",
};

export const STATIC_PERMISSION = [
  "view",
  "create",
  "update",
  "delete",
  "import",
  "export",
];

export const FILE_DOCUMENT = [
  "application/pdf",
  "text/csv",
  "application/vnd.ms-excel",
  "text/plain",
];

export const IMAGES = {
  logo,
};

export const RESPONSE_STATUS = {
  SUCCESS: "ok",
  ERROR: "error",
};

export const RESPONSE_CODE = {
  SUCCESS: 200,
  ERROR: 500,
};

export const USER_ERROR = {
  EMAIL: "Email is required.",
  FILE: "File is required. ",
  EMAIL_REQUIRED: "Email address is required.",
  EMAIL_INVALID: "Email address is invalid.",
  DP_EMAIL_INVALID: `Enter the Valid Dubai police email id example: "adam@dubaipolice.gov.ae"`,
  PASSWORD_REQUIRED: "Password is required.",
  PASSWORD_MIN_MAX_LENGTH: "Should be greater than 6 or less than 14 digits.",
  PASSWORD_INVALID: "Please enter valid password.",
  CONFIRM_PASSWORD_REQUIRED: "Confirm password is required.",
  PASSWORD_SAME: "Password and Confirm password should be same.",
  ADDRESS: "Address is required.",
  PHONE: "Phone is required.",
  F_NAME: "First Name is required.",
  L_NAME: "Sur Name is required.",
  M_NAME: "Middle Name is required.",
  INVALID_CREDENTIALS: "Invalid credentials. Please try again.",
  RESIDENCE_REQUIRED: "Residence is required.",
  PERSONAL_EMAIL_REQUIRED: "Personal email is required.",
  GOVERNMENT_EMAIL_REQUIRED: `Enter the Valid Dubai police email id example: "adam@dubaipolice.gov.ae"`,
  PHONE_NUMBER_REQUIRED: "Phone number is required.",
  INVALID_PHONE_NUMBER:
    "Phone number must contain only digits (eg: 154450123).",
  EMERGENCY_CONTACT_NAME_REQUIRED: "Emergency contact name is required.",
  EMERGENCY_CONTACT_NUMBER_REQUIRED: "Emergency contact number is required.",
  EMERGENCY_CONTACT_NUMBER_INVALID: "Emergency contact number is invalid.",
  GENDER: "Gender is required.",
  ROLE: "Role is required.",
  AGE: "Age is required.",
  NATIONALITY: "Nationality is required.",
  DOB: "Date of Birth is required.",
  INAVLIDDOB: "Invalid Date of Birth.",
  EIGHTEENYEARSDOB: "You must be at least 18 years old.",
  SIXTYYEARS: "You must be younger than 60 years old.",
  QUALIFICATION: "Qualification is required.",
  FIELD_OF_STUDY: "Field of Study is required.",
  COACH_EXPERIENCE: "Coach Experience is required.",
  CURRENT_JOB_POSITION: "Current job position is required.",
  PreviousAthleteExperience: "Previous Athlete Experience is required.",
  AchievementsAsCoach: "Achievements as Coach is required.",
  AchievementsAsCoach: "Achievements as Coach is required.",
  OrganizationalSkills: "Organizational Skills is required.",
  LeadershipSkills: "Leadership Skills is required.",
  ComputerSkills: "Computer Skills is required.",
  GENDER: "Gender is required.",
  CURRENT_JOB_LOCATION: "Current job location is required.",
  POLICE_EMPLOYEE_NUMBER: "Dubai Police employee number is required.",
  RANK: "Rank is required.",
  RANK_VALIDATE: "Purely numeric values are not allowed.",
  LAST_JOB_PROMOTION_DATE: "Date of last job promotion is required.",
  DEPARTMENT: "Department is required.",
  EMPLOYMENT_STATUS: "Employment status is required.",
  DP_EMPLOYMENT_STATUS: "DP Employment status is required.",
  CONTRACT_START_DATE: "Contract start date is required.",
  CONTRACT_END_DATE: "Contract end date is required.",
  ACKNOWLEDGEMENT_DATE: "Acknowledgement Date is required.",
  PLEDGE_DATE: "Pledge date is required.",
  SPORT: "Sport end date is required.",
  PERFORMANCE: "Performance Level is required.",
  DISCIPLINE: "Discipline Practiced is required.",
  HEIGHT: "Height is required.",
  WEIGHT: "Weight is required.",
  SPORT_CATEGORY: "Sport Category is required.",
  CONTRACT_TYPE: "ContractType is required.",
};

export const RACECALENDER_ERROR = {
  SPORT: "Sports is required.",
};

export const sportsIconDropData = [
  {
    value: 1,
    label: "Cycling",
    icon: (
      <>
        <CyclingSvg width={"35px"} height={"22px"} strokeWidth={0.5} />{" "}
      </>
    ),
    path: "/",
    category: "A",
  },
  {
    value: 2,
    label: "SWAT",
    icon: <SwatSvg width={"35px"} height={"22px"} />,
    path: "/",
    category: "A",
  },
  {
    value: 3,
    label: "Rowing Olympic",
    icon: <RowingOlympicSvg width={"35px"} height={"22px"} />,
    path: "/",
    category: "A",
  },
  {
    value: 4,
    label: "Athletics",
    icon: <AthleticsSvg width={"35px"} height={"22px"} />,
    path: "/",
    category: "A",
  },
  {
    value: 5,
    label: "Badminton",
    icon: <BadmintonSvg width={"35px"} height={"22px"} />,
    path: "/",
  },
  {
    value: 6,
    label: "Bodybuilding",
    icon: <BodybuildingSvg width={"35px"} height={"22px"} />,
    path: "/",
  },
  {
    value: 7,
    label: "Bowling",
    icon: <BowlingSvg width={"35px"} height={"22px"} />,
    path: "/",
  },
  {
    value: 8,
    label: "Cricket",
    icon: <CricketSvg width={"35px"} height={"22px"} />,
    path: "/",
    category: "B",
  },
  {
    value: 9,
    label: "Equestrian",
    icon: <EquestrianSvg width={"35px"} height={"22px"} />,
    path: "/",
    category: "A",
  },
  {
    value: 10,
    label: "Firefighter Challenge Team",
    icon: <FirefighterChallengeTeamSvg width={"35px"} height={"22px"} />,
    path: "/",
    category: "A",
  },
  {
    value: 11,
    label: "Fitness & Obstacles Team",
    icon: <FitnessSvg width={"35px"} height={"22px"} />,
    path: "/",
    category: "A",
  },
  {
    value: 12,
    label: "Football",
    icon: <FootballSvg width={"35px"} height={"22px"} />,
    path: "/",
    category: "B",
  },
  {
    value: 13,
    label: "Jet-ski",
    icon: <JetSkiSvg width={"35px"} height={"22px"} />,
    path: "/",
    category: "B",
  },
  {
    value: 14,
    label: "Padel",
    icon: <PadelsVG width={"35px"} height={"22px"} />,
    path: "/",
    category: "B",
  },
  {
    value: 15,
    label: "Ju-Jitsu",
    icon: <JuJitsuSvg width={"35px"} height={"22px"} />,
    path: "/",
    category: "A",
  },
  {
    value: 16,
    label: "Karate",
    icon: <KarateSvg width={"35px"} height={"22px"} />,
    path: "/",
    category: "A",
  },
  {
    value: 17,
    label: "MMA",
    icon: <MMASvg width={"35px"} height={"22px"} />,
    path: "/",
    category: "A",
  },
  {
    value: 18,
    label: "Shooting",
    icon: <ShootingSvg width={"35px"} height={"22px"} />,
    path: "/",
    category: "A",
  },
  {
    value: 19,
    label: "Swimming",
    icon: <SwimmingSvg width={"35px"} height={"22px"} />,
    path: "/",
    category: "A",
  },
  {
    value: 20,
    label: "Taekwondo",
    icon: <TaekwondoSvg width={"35px"} height={"22px"} />,
    path: "/",
    category: "A",
  },
  {
    value: 21,
    label: "Traditional Rowing",
    icon: <TraditionalRowingSvg width={"35px"} height={"22px"} />,
    path: "/",
    category: "B",
  },
];
export const sportsIconData = [
  {
    value: 1,
    label: "Cycling",
    icon: (
      <>
        <CyclingSvg width={"35px"} height={"22px"} strokeWidth={0.5} />{" "}
      </>
    ),
    path: "/",
    category: "A",
  },
  {
    value: 2,
    label: "SWAT",
    icon: <SwatSvg />,
    path: "/",
    category: "A",
  },
  {
    value: 3,
    label: "Rowing\nOlympic",
    icon: <RowingOlympicSvg />,
    path: "/",
    category: "A",
  },
  {
    value: 4,
    label: "Athletics",
    icon: <AthleticsSvg />,
    path: "/",
    category: "A",
  },
  {
    value: 5,
    label: "Badminton",
    icon: <BadmintonSvg />,
    path: "/",
    category: "C",
  },
  {
    value: 6,
    label: "Bodybuilding",
    icon: <BodybuildingSvg />,
    path: "/",
    category: "B",
  },
  {
    value: 7,
    label: "Bowling",
    icon: <BowlingSvg />,
    path: "/",
    category: "C",
  },
  {
    value: 7,
    label: "Ski",
    icon: <SkiSvg />,
    path: "/",
    category: "C",
  },
  {
    value: 8,
    label: "Cricket",
    icon: <CricketSvg />,
    path: "/",
    category: "B",
  },
  {
    value: 9,
    label: "Equestrian",
    icon: <EquestrianSvg />,
    path: "/",
    category: "A",
  },
  {
    value: 10,
    label: "Firefighter Challenge Team",
    icon: <FirefighterChallengeTeamSvg />,
    path: "/",
    category: "A",
  },
  {
    value: 11,
    label: "Fitness & Obstacles Team",
    icon: <FitnessSvg />,
    path: "/",
    category: "A",
  },
  {
    value: 12,
    label: "Football",
    icon: <FootballSvg />,
    path: "/",
    category: "B",
  },
  {
    value: 13,
    label: "Jet-ski",
    icon: <JetSkiSvg />,
    path: "/",
    category: "B",
  },
  {
    value: 14,
    label: "Padel",
    icon: <PadelsVG />,
    path: "/",
    category: "B",
  },
  {
    value: 15,
    label: "Ju-Jitsu",
    icon: <JuJitsuSvg />,
    path: "/",
    category: "A",
  },
  {
    value: 16,
    label: "Karate",
    icon: <KarateSvg />,
    path: "/",
    category: "A",
  },
  {
    value: 17,
    label: "MMA",
    icon: <MMASvg />,
    path: "/",
    category: "A",
  },
  {
    value: 18,
    label: "Shooting",
    icon: <ShootingSvg />,
    path: "/",
    category: "A",
  },
  {
    value: 19,
    label: "Swimming",
    icon: <SwimmingSvg />,
    path: "/",
    category: "A",
  },
  {
    value: 20,
    label: "Taekwondo",
    icon: <TaekwondoSvg />,
    path: "/",
    category: "A",
  },
  {
    value: 21,
    label: "Traditional Rowing",
    icon: <TraditionalRowingSvg />,
    path: "/",
    category: "B",
  },
];

export const moduleList = [
  { name: "Main Page", path: "/mainPage" },
  { name: "Team Overview", path: "/teamOverview" },
  { name: "Staffs", path: "/staffs" },
  { name: "Athletes", path: "/athletes" },
  { name: "Goals & Targets", path: "/goalsTargets" },
  { name: "Race Calendar", path: "/raceCalendar" },
  { name: "Results", path: "/results" },
  { name: "Training Plans", path: "/trainingPlans" },
  { name: "Training Camp", path: "/trainingCamp" },
  { name: "Test & Medical Checks", path: "/testAndMedicalChecks" },
  { name: "Nutrition", path: "/nutrition" },
  { name: "Reports", path: "/reports" },
  { name: "Budget", path: "/budget" },
  { name: "Team Requirements", path: "/teamRequirements" },
  { name: "Rewards", path: "/rewards" },
];

export const FILE_FORMAT_TYPE = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/JPEG",
  "image/PNG",
  "image/JPG",
];

export const FILE_FORMAT_TYPE_DOCUMENT = [
  "application/pdf",
  "application/msword",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const PDF_FORMAT = ["application/pdf"];

export const FILE_FORMAT_PDF_IMAGE = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/JPEG",
  "image/PNG",
  "image/JPG",
  "application/pdf",
];

export const DROPZONE_IMAGE_NAME_TYPES = {
  IMAGE: "IMAGE",
  PDF_IMG: "PDF_IMG",
  VIDEO: "VIDEO",
  AUDIO: "AUDIO",
  APPUSER: "appuser",
  DOCUMENTS: "FILES",
  USER_PROFILE: "userprofile",
};

export const DROPZONE_MESSAGES = {
  JSON_INVALID: "Uploaded file is not a valid json file.",
  IMAGE_INVALID:
    "Uploaded file is not a valid image. Only JPG, PNG and JPEG files are allowed.",
  VIDEO_INVALID: "Uploaded file is not a valid video format.",
  AUDIO_INVALID: "Uploaded file is not a valid audio format.",
  DOCUMENT_INVALID: "Uploaded file is not a valid document format.",
  CSV_INVALID:
    "Uploaded Document is not a valid document.Only CSV files are allowed",
  EXCEL_INVALID:
    "Uploaded Document is not a valid document.Only Excel files are allowed",
  PDF_INVALID: "Uploaded file is not a valid Pdf format.",
};

export const DROPZONE_IMAGE_FLAG = {
  PROFILES: "ProfileImage",
  HEROIMAGE: "ProfileFullImage",
  UPLOAD_DAILIES: "UPLOAD_DAILIES",
  APPUSER: "appuser",
  STILS: "STILS",
  AUDIO: "AUDIO",
  DOCUMENTS: "FILES",
  PASSPORT: "Passport",
  HERO_PROFILE: "ProfileFullImage",
  ID_DOCUMENT: "IDDocument",
  Level: "Level",
  UPLOAD_CONTRACT: "ContractDocument",
  EMPLOYEE_CERTIFICATE: "Certificate",
  LEVEL: "Level",
  EXTERNAL_CLUBS: "externalClubsContract",
  LICENSE: "License",
  INDIVIDUAL_PLANS: "IndividaulPlans",
  NUTRITION: "Food",
  SIGNATURE: "Signature",
  ACKNOWLEDGEMENT: "Acknowledgement",
  PLEDGE: "Pledge",
  COD: "certificateOfGoodConductDoc",
};

export const ALERT_STATUS = {
  200: "success",
  500: "error",
};

export const iconMapping = {
  success: <VerifiedIcon fontSize="inherit" />,
  error: <ErrorIcon fontSize="inherit" />,
  warning: <WarningIcon fontSize="inherit" />,
  info: <InfoIcon fontSize="inherit" />,
};

export function getPerformanceLevel(performanceLevel) {
  switch (performanceLevel && performanceLevel.toLowerCase()) {
    case "advanced":
      return {
        borderColor: "#B15D15",
        backgroundColor: "rgba(177, 93, 21, 0.03)",
      };
    case "intermediate":
      return {
        borderColor: "#00426A",
        backgroundColor: "rgba(81, 189, 255, 0.04)",
      };
    case "beginner":
      return {
        borderColor: "#26D07C",
        backgroundColor: "rgba(38, 208, 124, 0.04)",
      };
    default:
      return {
        borderColor: "#26D07C",
        backgroundColor: "rgba(38, 208, 124, 0.04)",
      };
  }
}

export function statusColour(status) {
  switch (status) {
    case "Rejected":
      return {
        color: "#E4002B",
        backgroundColor: "rgba(228, 0, 43, 0.1)",
        borderColor: "rgba(228, 0, 43, 1)",
      };
    case "Pending":
      return {
        color: "#rgba(252, 138, 0, 1)",
        backgroundColor: "rgba(252, 138, 0, 1)",
        borderColor: "rgba(252, 138, 0, 1)",
      };
    case "Ended":
      return {
        color: "#tertiary/gray 100",
        backgroundColor: "rgba(88, 88, 91, 1)",
        borderColor: "rgba(252, 138, 0, 1)",
      };
    case "Approved" || "voted":
      return {
        color: "#rgba(229, 255, 246, 1)",
        backgroundColor: "rgba(0, 135, 85, 0.1)",
        borderColor: "rgba(0, 135, 85, 1)",
      };
    default:
      return { color: "#000000", backgroundColor: "#FFFFFF" };
  }
}

export function getRoleColor(role) {
  switch (role) {
    case "team_supervisor":
      return {
        borderColor: "#00776A",
        backgroundColor: "rgba(0, 119, 106, 0.04)",
        viewColor: "rgba(0, 119, 106, 0.04)",
      };
    case "team_manager":
      return {
        borderColor: "#630524",
        backgroundColor: "rgba(99, 5, 36, 0.04)",
        viewColor: "rgba(99, 5, 36, 0.04)",
      };
    case "head_coach":
      return {
        borderColor: "#005133",
        backgroundColor: "rgba(0, 81, 51, 0.04)",
        viewColor: "rgba(0, 81, 51, 0.04)",
      };
    case "strength_and_conditioning_coach":
      return {
        borderColor: "#00273F",
        backgroundColor: "rgba(0, 39, 63, 0.04)",
        viewColor: "rgba(0, 39, 63, 0.04)",
      };
    case "assistant_coach":
      return {
        borderColor: "#167C4A",
        backgroundColor: "rgba(22, 124, 74, 0.04)",
        viewColor: "rgba(22, 124, 74, 0.04)",
      };
    case "team_admin_staff":
      return {
        borderColor: "#035055",
        backgroundColor: "rgba(3, 80, 85, 0.04)",
        viewColor: "rgba(3, 80, 85, 0.04)",
      };
    case "nutritionist":
      return {
        borderColor: "#B15D15",
        backgroundColor: "rgba(177, 93, 21, 0.04)",
        viewColor: "rgba(177, 93, 21, 0.04)",
      };
    case "volunteer":
      return {
        borderColor: "#001336",
        backgroundColor: "rgba(0, 19, 54, 0.04)",
        viewColor: "rgba(0, 19, 54, 0.04)",
      };
    case "athlete":
      return {
        borderColor: "#005844",
        backgroundColor: "rgba(0, 52, 40, 0.04)",
        viewColor: "rgba(0, 52, 40, 0.04)",
      };
    case "higher_management":
      return {
        borderColor: "#8B3D00",
        backgroundColor: "#FFF9F10A",
        viewColor: "rgba(0, 52, 40, 0.04)",
      };
    case "director_sport_excellence_centre":
      return {
        borderColor: "#7A1B1B",
        backgroundColor: "#FFF7F70A",
        viewColor: "rgba(0, 52, 40, 0.04)",
      };
    case "admin_sports_excellence_centre":
      return {
        borderColor: "#4B3C00",
        backgroundColor: "#FCFAF40A",
        viewColor: "rgba(0, 52, 40, 0.04)",
      };
    case "dubai_police_employee":
      return {
        borderColor: "#2C5E1A",
        backgroundColor: "#F9FBF50A",
        viewColor: "rgba(0, 52, 40, 0.04)",
      };
    default:
      return {
        borderColor: "#000000",
        backgroundColor: "#FFFFFF",
        viewColor: "linear-gradient(180deg, #FFFFFF, #FFFFFF)",
      }; // Default as an object
  }
}

export const LANGUAGE = [
  "English",
  "Spanish",
  "French",
  "German",
  "Chinese",
  "Japanese",
  "Russian",
  "Italian",
  "Portuguese",
  "Arabic",
];

export const BLOOD_GROUPS = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
  "ABO",
];

export const GoalsAndTargetsSection = {
  "Long-term Goals": "LongTermGoals",
  "Season's Main Goal": "SeasonsMainGoal",
  "Individual Goals": "IndividualGoals",
};

export const GoalsAndTargets = {
  "Long-term Goals": "longTermGoals",
  "Season's Main Goal": "seasonsMainGoal",
  "Individual Goals": "individualGoals",
};

export const GOALSANDTARGETS = [
  { name: "Long-term Goals" },
  { name: "Season's Main Goal" },
  { name: "Individual Goals" },
];

export const GoalsandTargetChip = [];

export const ContractType = [
  { value: "", label: "Select" },
  { value: "Permanent Contract", label: "Permanent Contract" },
  {
    value: "Collaboration Contract",
    label: "Collaboration Contract",
  },
  { value: "Temporary Contract", label: "Temporary Contract" },
];
export const disciplinePracticed = [
  { value: 1, label: "Running" },
  { value: 2, label: "Swimming" },
  { value: 3, label: "Cycling" },
  { value: 4, label: "Weightlifting" },
  { value: 5, label: "Yoga" },
  { value: 6, label: "Martial Arts" },
  { value: 7, label: "Tennis" },
  { value: 8, label: "Basketball" },
  { value: 9, label: "Football" },
  { value: 10, label: "Gymnastics" },
];

export const SortBy = [
  { value: 1, label: "Asc" },
  { value: 2, label: "Desc" },
];

export const USER_PERMISSION = {
  Dashboard: 1001,
  StaffAdd: 1002,
  StaffView: 1003,
  StaffSentiveDataView: 1004,
  StaffEdit: 1005,
  StaffDelete: 1006,
  AthleteAdd: 1007,
  AthleteView: 1008,
  AthleteSentiveDataView: 1009,
  AthleteEdit: 1010,
  AthleteDelete: 1011,
  GoalsTargetsAdd: 1012,
  GoalsTargetsView: 1013,
  GoalsTargetsEdit: 1014,
  AddIndividualMilestones: 1015,
  GoalsTargetsDelete: 1016,
  RaceCalendarAdd: 1017,
  RaceCalendarView: 1018,
  RaceCalendarEdit: 1019,
  RaceCalendarDelete: 1020,
  RaceApproval: 1021,
  RaceUpdate: 1022,
  ResultAdd: 1023,
  ResultView: 1024,
  ResultEdit: 1025,
  TrainingPlanAdd: 1026,
  TrainingPlanView: 1027,
  TrainingPlanEdit: 1028,
  TrainingPlanDelete: 1029,
  TrainingCampAdd: 1030,
  TrainingCampView: 1031,
  TrainingCampEdit: 1032,
  TrainingCampApproval: 1033,
  TrainingCampDelete: 1034,
  TrainingCampUpdate: 1035,
  TestMedicalChecksAdd: 1036,
  TestMedicalChecksView: 1037,
  TestMedicalChecksEdit: 1038,
  TestMedicalChecksDelete: 1039,
  NutritionPlanAdd: 1040,
  NutritionPlanView: 1041,
  NutritionPlanEdit: 1042,
  NutritionPlanDelete: 1043,
  BudgetAdd: 1044,
  BudgetView: 1045,
  BudgetEdit: 1046,
  BudgetDelete: 1047,
  BudgetApproval: 1048,
  ReportsAdd: 1049,
  ReportsView: 1050,
  ReportsExportDownload: 1051,
  TeamRequirementsAdd: 1052,
  TeamRequirementsView: 1053,
  TeamRequirementsEdit: 1054,
  TeamRequirementsDelete: 1055,
  RewardsAdd: 1056,
  RewardsView: 1057,
  RewardsEdit: 1058,
  RewardsDelete: 1059,
  LatestResultsAdd: 1060,
  LatestResultsView: 1061,
  LatestResultsEdit: 1062,
  CompetitionCalendarAdd: 1063,
  CompetitionCalendarView: 1064,
  CompetitionCalendarEdit: 1065,
  CompetitionCalendarDelete: 1066,
  ProgramsAdd: 1067,
  ProgramsView: 1068,
  ProgramsEdit: 1069,
  ProgramsDelete: 1070,
  RulesAgreementsAdd: 1071,
  RulesAgreementsView: 1072,
  RulesAgreementsEdit: 1073,
  RulesAgreementsDelete: 1074,
  RulesAgreementsDownload: 1075,
  MousPartnershipAdd: 1076,
  MousPartnershipView: 1077,
  MousPartnershipEdit: 1078,
  MousPartnershipDelete: 1079,
  MousPartnershipDownload: 1080,
  NewsAdd: 1081,
  NewsView: 1082,
  NewsEdit: 1083,
  NewsDelete: 1084,
  NewsDownload: 1085,
  FitnessNutritionAdd: 1086,
  FitnessNutritionView: 1087,
  FitnessNutritionEdit: 1088,
  FitnessNutritionDelete: 1089,
  SuggestionPollsAdd: 1090,
  SuggestionPollsView: 1091,
  SuggestionPollsEdit: 1092,
  SuggestionPollsDelete: 1093,
  ResearchFacilitiesAdd: 1094,
  ResearchFacilitiesView: 1095,
  ResearchFacilitiesEdit: 1096,
  ResearchFacilitiesDelete: 1097,
  FacilitiesApproveReject: 1099,
  TeamRequirementsApproveReject: 1100,
  FacilitiesDownload: 1101,
};

export const testOptions = [
  { value: "", label: "Select" },
  { value: "Military Readiness Test", label: "Military Readiness Test" },
  { value: "Performance Test", label: "Performance Test" },
  { value: "Field Test", label: "Field Test" },
  { value: "Medical Test", label: "Medical Test" },
];
export const testStatusOptions = [
  { value: "", label: "Select" },
  { value: "Fit to Play", label: "Fit to Play" },
  { value: "Not fit", label: "Not fit" },
  { value: "Recovering", label: "Recovering" },
  { value: "Injured", label: "Injured" },
];
export const StatusOptions = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

export const SportCategory = [
  { value: "elite", label: "Elite" },
  { value: "amature", label: "Amature" },
  { value: "junior", label: "Junior" },
];
export const DeparatmentOptions = [
  { value: "Traffic Police", label: "Traffic Police" },
  { value: "Cyber Crime Division", label: "Cyber Crime Division" },
  { value: "Narcotics Control Bureau", label: "Narcotics Control Bureau" },
  { value: "Anti-Terrorism Squad", label: "Anti-Terrorism Squad" },
  { value: "Forensic Science Unit", label: "Forensic Science Unit" },
];

export const levelOptions = [
  { value: "", label: "Select" },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];
export const levelTableOptions = [
  { value: "", label: "Select" },
  { value: "Beginner", label: "Beginner" },
  { value: "Intermediate", label: "Intermediate" },
  { value: "Advanced", label: "Advanced" },
];

export const PermissionType = [
  { value: "Hours", label: "Hours" },
  { value: "Daily", label: "Daily" },
];
