// redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./slices/appSplice"; // Adjust the path as needed
import loginReducer from "./slices/loginSplice";
import StaffAddSlice from "./slices/staff/staffAddSlice";
import singleFileUpload from "./slices/fileupload/singleFileUpload";
import foodFileUpload from "./slices/fileupload/foodFileUpload";
import trainingCampFileUpload from "./slices/fileupload/trainingCampFileUpload";
import editStaff from "./slices/staff/staffEditSlice";
import deleteStaff from "./slices/staff/staffDeleteSlice";
import UpdateStaff from "./slices/staff/staffUpdateSlice";
import athleteAddReducer from "./slices/athlete/athleteAddSlice";
import editAthleteReducer from "./slices/athlete/athleteEditSlice";
import getAthleteIDReducer from "./slices/athlete/getAthleteIDSlice";
import getAthleteListReducer from "./slices/athlete/getAthleteListSlice";
import athleteUpdateReducer from "./slices/athlete/athleteUpdateSlice";
import coachCommentsReducer from "./slices/athlete/coachCommentsSlice";
import StaffListSlice from "./slices/staff/staffListSlice";
import athleteListReducer from "./slices/athlete/athleteListSlice";
import deleteAthleteReducer from "./slices/athlete/athleteDeleteSlice";
import listGoalsTargetsReducer from "./slices/goalsTargets/goalsTargetsListSlice";
import AddGoalsTargetsReducer from "./slices/goalsTargets/goalsTargetsAddSlice";
import IndividualMilestoneReducer from "./slices/goalsTargets/individualMilestoneAddSlice";
import IndividualMilestoneEditReducer from "./slices/goalsTargets/individualMilestoneEditSlice";
import EditGoalsTargetsReducer from "./slices/goalsTargets/goalsTargetsEditSlice";
import UpdateGoalsTargetsReducer from "./slices/goalsTargets/goalsTargetsUpdateSlice";
import DeleteGoalsTargetsReducer from "./slices/goalsTargets/goalsTargetsDeleteSlice";
import fileDeleteReducer from "./slices/fileupload/deleteFile";
import roleReducer from "./slices/settingSlice/roleSlice/roleSlice";
import getContractTypeReducer from "./slices/settingSlice/contractTypeSlice/getContractTypeSlice";
import getRewardsType from "./slices/settingSlice/rewardsType/getRewardsTypeSlice";
import getFacilityType from "./slices/settingSlice/facilityType/getFacilityTypeSlice";
import getSportListReducer from "./slices/sportsMenu/getSportsListSlice";
import listSeasonReducer from "./slices/season/SeasonListSlice";
import AddSeasonReducer from "./slices/season/SeasonAddSlice";
import EditSeasonReducer from "./slices/season/SeasonEditSlice";
import UpdateSeasonReducer from "./slices/season/SeasonUpdateSlice";
import DeleteSeasonReducer from "./slices/season/SeasonDeleteSlice";
import LanguageListReducer from "./slices/language/getLanguageListSlice";
import raceCalendarAddSlice from "./slices/raceCalendar/raceCalendarAddSlice";
import ChartListSliceReducer from "./slices/goalsTargets/chartListSlice";
import getRaceCalendarListSlice from "./slices/raceCalendar/getRaceCalendarListSlice";
import getRaceYearlyCalendarListSlice from "./slices/raceCalendar/getRaceCalendarYearlyListSlice";
import GetRaceCalendarByIDSlice from "./slices/raceCalendar/getRaceCalendarIDSlice";
import updateRaceCalendarSlice from "./slices/raceCalendar/updateRaceCalendarSlice";
import TrainingPlansAddReducer from "./slices/trainingPlans/TrainingPlansAddSlice";
import editTrainingPlansReducer from "./slices/trainingPlans/TrainingPlansEditSlice";
import TrainingPlansUpdateReducer from "./slices/trainingPlans/TrainingPlansUpdateSlice";
import TrainingPlansListReducer from "./slices/trainingPlans/TrainingPlansListSlice";
import deleteTrainingPlansReducer from "./slices/trainingPlans/TrainingPlansDeleteSlice";
import DeleteRaceCalendarReducer from "./slices/raceCalendar/deleteRaceCalendarSlice";
import listPlanTemplateReducer from "./slices/nutrition/PlanTemplateListSlice";
import DeletePlanTemplateReducer from "./slices/nutrition/PlanTemplateDeleteSlice";
import UpdateTrainingResultByIDReducer from "./slices/trainingPlans/UpdateResultsSlice";
import listNutritionReducer from "./slices/nutrition/NutritionListSlice";
import AddNutritionReducer from "./slices/nutrition/NutritionAddSlice";
import EditNutritionReducer from "./slices/nutrition/NutritionEditSlice";
import EditPlanTemplateReducer from "./slices/nutrition/PlanTemplateEditSlice";
import UpdateNutritionReducer from "./slices/nutrition/NutritionUpdateSlice";
import DeleteNutritionReducer from "./slices/nutrition/NutritionDeleteSlice";
import listFoodReducer from "./slices/food/FoodListSlice";
import addFoodReducer from "./slices/food/FoodAddSlice";
import editFoodReducer from "./slices/food/FoodEditSlice";
import updateFoodReducer from "./slices/food/FoodUpdateSlice";
import deleteFoodReducer from "./slices/food/FoodDeleteSlice";
import getNationalityReducer from "./slices/nationality/getNationalityListSlice";
import addAcademicQualificationReducer from "./slices/athlete/athleteAcademicQualification";
import DeleteAcademicQualificationReducer from "./slices/athlete/deleteAcademicQualification";
import academicFileUploadReducer from "./slices/fileupload/academicFileUpload";
import getNationalityLisReducer from "./slices/nationality/getNationalityListSlice";
import getPlanListReducer from "./slices/planMenu/getPlanListSlice";
import AddNutritionTemplateReducer from "./slices/nutrition/NutritionTemplateAddSlice";
import UpdateNutritionTemplateReducer from "./slices/nutrition/NutritionPlanUpdateSlice";
import getNutritionPlanDetailByIdReducer from "./slices/nutrition/NutritionPlanDetailsByIdSlice";
import AddTrainingCampReducer from "./slices/trainingCamp/trainingCampAddSlice";
import AddTrainingCampCompetitionReducer from "./slices/trainingCamp/trainingCampCompetition";
import UpdateTrainingCampReducer from "./slices/trainingCamp/trainingCampUpdateSlice";
import GetTraningCampsListSliceReducer from "./slices/trainingCamp/getTrainingCampListSlice";
import DeleteTraningCampSliceReducer from "./slices/trainingCamp/trainingCampDeleteSlice";
import EditTrainingCampReducer from "./slices/trainingCamp/trainingCampEditSlice";
import getTrainingCampByIDReducer from "./slices/trainingCamp/getTrainingCampByIdSlice";
import UpdateTrainingCampByIDReducer from "./slices/trainingCamp/UpdateTrainingCampSlice";
import AddProgramReducer from "./slices/program/AddProgram";
import UpdateProgramReducer from "./slices/program/ProgramUpdateSlice";
import GetProgramByIDReducer from "./slices/program/getRaceCalendarIDSlice";
import ListProgramReducer from "./slices/program/ProgramListSlice";
import CategoryListReducer from "./slices/news/CategoryListSlice";
import NewsAddReducer from "./slices/news/NewsAddSlice";
import NewsEditReducer from "./slices/news/NewsEditSlice";
import NewsUpdateReducer from "./slices/news/NewsUpdateSlice";
import NewsListReducer from "./slices/news/NewsListSlice";
import NewsDeleteReducer from "./slices/news/NewsDeleteSlice";
import AddResultReducer from "./slices/results/ResultAddSlice";
import UpdateResultReducer from "./slices/results/ResultUpdateSlice";
import EditResultReducer from "./slices/results/ResultEditSlice";
import getResultByIDReducer from "./slices/results/ResultEditSlice";
import GetTResultListSliceReducer from "./slices/results/ResultListSlice";
import DeleteResultLisSliceReducer from "./slices/results/ResultDeleteSlice";
import UpdateTrainingPerformanceReducer from "./slices/results/UpdateResultsSlice";
import TeamPerformanceReducer from "./slices/results/TeamPerformanceList";
import AddTestAndMedicalChecksReducer from "./slices/testAndMedicalChecks/TestAndMedicalChecksAddSlice";
import UpdateTestAndMedicalChecksReducer from "./slices/testAndMedicalChecks/TestAndMedicalChecksUpdateSlice";
import getTestAndMedicalChecksByIDReducer from "./slices/testAndMedicalChecks/TestAndMedicalChecksEditSlice";
import GetTTestAndMedicalChecksListSliceReducer from "./slices/testAndMedicalChecks/TestAndMedicalChecksListSlice";
import DeleteTestAndMedicalChecksLisSliceReducer from "./slices/testAndMedicalChecks/TestAndMedicalChecksDeleteSlice";
import TestAndMedicalByAtheleteByIdSliceReducer from "./slices/testAndMedicalChecks/TestAndMedicalChecksByAtheleteEditSlice";
import RulesListReducer from "./slices/rules/RulesListSlice";
import RulesAddReducer from "./slices/rules/RulesAddSlice";
import RulesEditReducer from "./slices/rules/RulesEditSlice";
import RulesUpdateReducer from "./slices/rules/RulesUpdateSlice";
import RulesDeleteReducer from "./slices/rules/RulesDeleteSlice";
import SuggestionsAndPollsListReducer from "./slices/suggestionsAndPolls/SuggestionsAndPollsListSlice";
import SuggestionsAndPollsAddReducer from "./slices/suggestionsAndPolls/SuggestionsAndPollsAddSlice";
import SuggestionsAndPollsEditReducer from "./slices/suggestionsAndPolls/SuggestionsAndPollsEditSlice";
import SuggestionsAndPollsUpdateReducer from "./slices/suggestionsAndPolls/SuggestionsAndPollsUpdateSlice";
import SuggestionsAndPollsDeleteReducer from "./slices/suggestionsAndPolls/SuggestionsAndPollsDeleteSlice";
import PollsAddReducer from "./slices/suggestionsAndPolls/pollsOption/PollsOptionsAddSlice";
import VoteAddReducer from "./slices/suggestionsAndPolls/VoteAddSlice";
import StatusUpdatedReducer from "./slices/suggestionsAndPolls/StatusUpdated";
import RewardsListReducer from "./slices/rewards/rewardsListSlice";
import RewardsAddReducer from "./slices/rewards/rewardsAddSlice";
import RewardsEditReducer from "./slices/rewards/rewardsEditSlice";
import RewardsUpdateReducer from "./slices/rewards/rewardsUpdateSlice";
import RewardsDeleteReducer from "./slices/rewards/rewardsDeleteSlice";
import RewardDropdownListReducer from "./slices/rewards/rewardsDropdownList";
import EventListReducer from "./slices/rewards/eventList";
import CompetitionListReducer from "./slices/rewards/competitionList";
import GetTeamRequirementListSliceReducer from "./slices/teamRequirement/getTeamRequirementListSlice";
import GetTeamRequirementByIDReducer from "./slices/teamRequirement/getTeamRequirementByIdSlice";
import GetListForTypeDropDownReducer from "./slices/teamRequirement/getListForTypeDropDown";
import AddTeamRequirementReducer from "./slices/teamRequirement/teamRequirementAddSlice";
import DeleteTeamRequirementSliceReducer from "./slices/teamRequirement/teamRequirementDeleteSlice";
import UpdateTeamRequirementReducer from "./slices/teamRequirement/teamRequirementUpdateSlice";
import UpdateShippingReducer from "./slices/teamRequirement/updateShippingSlice";
import UpdateTeamRequirementStatusReducer from "./slices/teamRequirement/updateTeamRequirementStatus";
import BudgetListReducer from "./slices/budget/budgetListSlice";
import BudgetAddReducer from "./slices/budget/budgetAddSlice";
import BudgetEditReducer from "./slices/budget/budgetEditSlice";
import BudgetUpdateReducer from "./slices/budget/budgetUpdateSlice";
import BudgetUpdateStatusReducer from "./slices/budget/budgetUpdateStatusSlice";
import AddResearchAndFacilitiesReducer from "./slices/researchFacilities/researchFacilitiesAddSlice";
import ResearchListSliceReducer from "./slices/researchFacilities/researchListSlice";
import UpdateResearchAndFacilitiesReducer from "./slices/researchFacilities/researchFacilitiesUpdateSlice";
import EditResearchAndFacilitiesReducer from "./slices/researchFacilities/researchFacilitiesEditSlice";
import ResearchDeleteSliceReducer from "./slices/researchFacilities/researchDeleteSlice";
import FacilitiesSliceReducer from "./slices/researchFacilities/facilitiesListSlice";
import GetFacilitiesTypesListReducer from "./slices/researchFacilities/GetFacilitiesTypesList";
import CheckFacilitiesAvailablilityReducer from "./slices/researchFacilities/CheckFacilitiesAvailablility";
import FacilitiesUpdateStatusReducer from "./slices/researchFacilities/UpdateFacilitiesStatus";
import RejectFacilityByIDReducer from "./slices/researchFacilities/rejectFacilitiesByID";
import CancelFacilitiesByIDReducer from "./slices/researchFacilities/cancellingFacilitiesByID";
import NotificationListReducer from "./slices/notification/getNotificationSlice";
import NotificationUpdateReducer from "./slices/notification/updateNotificationByIdSlice";
import GetNotificationModuleByIDReducer from "./slices/notification/getNotificationModuleByID";
import NotificationAddReducer from "./slices/notification/NotificationAddSlice";
import StaffAndAthleteListReducer from "./slices/staffAndAthlete/StaffAndAthleteListSlice";
import StaffAndAthleteIdReducer from "./slices/staffAndAthlete/StaffAndAthleteIdSlice";
import StaffAndAthleteFileDeleteReducer from "./slices/staffAndAthlete/StaffAndAthleteFileDeleteSlice";
import GetTopScorerReducer from "./slices/dashboard/getTopScorerSlice";
import GetGlobalDataReducer from "./slices/dashboard/getGlobalDataSlice";
import GetLatestResultReducer from "./slices/dashboard/getLatestResultSlice";
import GetTopPerformingAthleteReducer from "./slices/dashboard/getTopPerformingAthlete";
import GetCompetitionReducer from "./slices/dashboard/getCompetitionSlice";
import GetDashBoardCountsReducer from "./slices/dashboard/getDashBoardCountsSlice";
import GetCompetitionListReducer from "./slices/dashboard/getCompetitionListSlice";
import GetActiveCompetitionListReducer from "./slices/dashboard/getActiveCompetitionListSlice";
import GetTotalTrainingReducer from "./slices/dashboard/getTotalTrainingSlice";
import GetTopPerformingSportsReducer from "./slices/dashboard/getTopPerformingSportsSlice";
import GetRaceTrendsReducer from "./slices/dashboard/getRaceTrendsSlice";
import GetTeamOverviewCountReducer from "./slices/dashboard/getTeamOverviewCountSlice";
import UserListSliceReducer from "./slices/users/userListslice";
import UpdateUserAsAdminReducer from "./slices/users/updateUserAsAdminSlice";
import UserRoleReducer from "./slices/rolesAndPermissions/userRoleSlice";
import UserAccessByRoleReducer from "./slices/rolesAndPermissions/userAccessByRoleSlice";
import GetSeasonCategoryReducer from "./slices/seasonSettings/getSeasonCategorySlice";
import UpdateSeasonCategoryReducer from "./slices/seasonSettings/updateSeasonCategorySlice";
import ReportAddSliceReducer from "./slices/reports/reportAddSlice";
import AthleteGetListSliceReducer from "./slices/reports/getAthleteListSlice";
import RaceReportGetListSliceReducer from "./slices/reports/getRaceReportListSlice";
import ReportUpdateSliceReducer from "./slices/reports/reportUpdateSlice";
import ReportGetByIDSliceReducer from "./slices/reports/reportGetByIDSlice";
import ReportFileUploadSliceReducer from "./slices/reports/reportFileUploadSlice";

import UpdateUserAccessByRoleReducer from "./slices/rolesAndPermissions/updateUserAccessByRoleSlice";
import CommentAddReducer from "./slices/suggestionsAndPolls/comment/CommentAddSlice";
import CommentEditReducer from "./slices/suggestionsAndPolls/comment/CommentEditSlice";
import CommentUpdateReducer from "./slices/suggestionsAndPolls/comment/CommentUpdateSlice";
import CommentListReducer from "./slices/suggestionsAndPolls/comment/CommentListSlice";
import CommentDeleteReducer from "./slices/suggestionsAndPolls/comment/CommentDeleteSlice";
import GetMedicalTestKpiListReducer from "./slices/kpi/GetMedicalTestKpiList";
import UpdateTrainingCampStatusReducer from "./slices/trainingCamp/updateTrainingCampStatusSlice";
import CompetitionAddReducer from "./slices/competition/competitionAddSlice";
import ListCompetitionReducer from "./slices/competition/getCompetitionListSlice";
import MatchAddReducer from "./slices/competition/matchAddSlice";
import TimeslotAddReducer from "./slices/competition/timeslotAddSlice";
import DepartmentAddReducer from "./slices/commander-shield-department/departmentAddSlice";
import ListDepartmentReducer from "./slices/commander-shield-department/getDepartmentListSlice";


import AddMasterPlanReducer from "./slices/masterPlan/MasterAddSlice";
import EditMasterPlanReducer from "./slices/masterPlan/MasterEditSlice";
import DeleteMasterPlanReducer from "./slices/masterPlan/MasterDeleteSlice";
import ListMasterPlanReducer from "./slices/masterPlan/MasterListSlice";

const store = configureStore({
  reducer: {
    login: loginReducer,
    ui: appReducer,


    //Master Plan Reducers
    addMasterPlan:AddMasterPlanReducer,
    editMasterPlan:EditMasterPlanReducer,
    deleteMasterPlan:DeleteMasterPlanReducer,
    listMasterPlan:ListMasterPlanReducer,
         


    //Suggestion-polls/comments
    commentAddData: CommentAddReducer,
    commentEditData: CommentEditReducer,
    commentUpdateData: CommentUpdateReducer,
    commentListData: CommentListReducer,
    commentDeleteData: CommentDeleteReducer,


    // Dashboard
    getTopScorer: GetTopScorerReducer,
    getGlobalData: GetGlobalDataReducer,
    getLatestResult: GetLatestResultReducer,
    getTopPerformingAthlete: GetTopPerformingAthleteReducer,
    getCompetition: GetCompetitionReducer,
    getDashBoardCounts: GetDashBoardCountsReducer,
    getCompetitionList: GetCompetitionListReducer,
    getActiveCompetitionList: GetActiveCompetitionListReducer,
    getTotalTraining: GetTotalTrainingReducer,
    getTopPerformingSports: GetTopPerformingSportsReducer,
    getRaceTrends: GetRaceTrendsReducer,
    getTeamOverviewCount: GetTeamOverviewCountReducer,

    // Budgets
    budgetsList: BudgetListReducer,
    budgetsAdd: BudgetAddReducer,
    budgetsEdit: BudgetEditReducer,
    budgetsUpdate: BudgetUpdateReducer,
    budgetsUpdateStatus: BudgetUpdateStatusReducer,

    // staff and Athlete
    staffAndAthleteList: StaffAndAthleteListReducer,
    staffAndAthleteIdList: StaffAndAthleteIdReducer,
    staffAndAthleteFile: StaffAndAthleteFileDeleteReducer,

    //PollsList
    pollsAddList: PollsAddReducer,
    voteAddList: VoteAddReducer,
    statusUpdatedData: StatusUpdatedReducer,

    // SuggestionsAndPolls
    suggestionsAndPollsList: SuggestionsAndPollsListReducer,
    suggestionsAndPollsAdd: SuggestionsAndPollsAddReducer,
    suggestionsAndPollsEdit: SuggestionsAndPollsEditReducer,
    suggestionsAndPollsUpdate: SuggestionsAndPollsUpdateReducer,
    suggestionsAndPollsDelete: SuggestionsAndPollsDeleteReducer,

    // rewards
    eventList: EventListReducer,
    competitionList: CompetitionListReducer,
    rewardDropdownList: RewardDropdownListReducer,
    rewardsList: RewardsListReducer,
    rewardsAdd: RewardsAddReducer,
    rewardsEdit: RewardsEditReducer,
    rewardsUpdate: RewardsUpdateReducer,
    rewardsDelete: RewardsDeleteReducer,

    // TestAndMedicalChecks
    addTestAndMedicalChecks: AddTestAndMedicalChecksReducer,
    updateTestAndMedicalChecks: UpdateTestAndMedicalChecksReducer,
    getTestAndMedicalCheckssList: GetTTestAndMedicalChecksListSliceReducer,
    deleteTestAndMedicalCheckss: DeleteTestAndMedicalChecksLisSliceReducer,
    getTestAndMedicalChecksByID: getTestAndMedicalChecksByIDReducer,
    TestAndMedicalByAtheleteById: TestAndMedicalByAtheleteByIdSliceReducer,
    // Program
    addProgram: AddProgramReducer,
    GetProgramById: GetProgramByIDReducer,
    updateProgram: UpdateProgramReducer,
    listProgram: ListProgramReducer,

    // rules & agreements
    rulesList: RulesListReducer,
    rulesAdd: RulesAddReducer,
    rulesEdit: RulesEditReducer,
    rulesUpdate: RulesUpdateReducer,
    rulesDelete: RulesDeleteReducer,

    // News
    categoryList: CategoryListReducer,
    addNews: NewsAddReducer,
    editNews: NewsEditReducer,
    updateNews: NewsUpdateReducer,
    listNews: NewsListReducer,
    deleteNews: NewsDeleteReducer,

    // Result camp
    addResult: AddResultReducer,
    updateResult: UpdateResultReducer,
    getResultsList: GetTResultListSliceReducer,
    deleteResults: DeleteResultLisSliceReducer,
    editTraning: EditResultReducer,
    getResultByID: getResultByIDReducer,
    GetTeamPerformanceList: TeamPerformanceReducer,
    updateTrainingPerformance: UpdateTrainingPerformanceReducer,

    // Training camp
    addTrainingCamp: AddTrainingCampReducer,
    updateTrainingCamp: UpdateTrainingCampReducer,
    addTrainingCampCompetition: AddTrainingCampCompetitionReducer,
    getTraningCampsList: GetTraningCampsListSliceReducer,
    deleteTraningCamps: DeleteTraningCampSliceReducer,
    editTraningCamp: EditTrainingCampReducer,
    getTrainingCampByID: getTrainingCampByIDReducer,
    updateTrainingCampByID: UpdateTrainingCampByIDReducer,
    updateTrainingCampStatus: UpdateTrainingCampStatusReducer,

    //Team Requirement
    getTeamRequirementList: GetTeamRequirementListSliceReducer,
    addTeamRequirement: AddTeamRequirementReducer,
    updateTeamRequirement: UpdateTeamRequirementReducer,
    deleteTeamRequirement: DeleteTeamRequirementSliceReducer,
    getTeamRequirementByID: GetTeamRequirementByIDReducer,
    getListForTypeDropDown: GetListForTypeDropDownReducer,
    shippingUpdate: UpdateShippingReducer,
    updateTeamRequirementStatus: UpdateTeamRequirementStatusReducer,

    //Research and Facilities
    addResearchAndFacilities: AddResearchAndFacilitiesReducer,
    listResearch: ResearchListSliceReducer,
    updateResearchAndFacilities: UpdateResearchAndFacilitiesReducer,
    editResearchAndFacilities: EditResearchAndFacilitiesReducer,
    deleteResearch: ResearchDeleteSliceReducer,
    listFacilities: FacilitiesSliceReducer,
    getFacilitiesTypesList: GetFacilitiesTypesListReducer,
    CheckFacilitiesAvailablility: CheckFacilitiesAvailablilityReducer,
    FacilitiesUpdateStatus: FacilitiesUpdateStatusReducer,
    cancelFacilitiesByID: CancelFacilitiesByIDReducer,
    RejectFacilityByID: RejectFacilityByIDReducer,

    // academicFileUpload
    academicFileUpload: academicFileUploadReducer,

    // Nationality
    listNationality: getNationalityReducer,

    // Food
    listFood: listFoodReducer,
    addFood: addFoodReducer,
    editFood: editFoodReducer,
    updateFood: updateFoodReducer,
    deleteFood: deleteFoodReducer,

    // Nutrition
    listNutrition: listNutritionReducer,
    addNutrition: AddNutritionReducer,
    addNutritionTemplate: AddNutritionTemplateReducer,
    updateNutritionTemplate: UpdateNutritionTemplateReducer,
    editNutrition: EditNutritionReducer,
    editPlanTemplate: EditPlanTemplateReducer,
    updatedNutrition: UpdateNutritionReducer,
    deleteNutrition: DeleteNutritionReducer,
    listPlanTemplate: listPlanTemplateReducer,
    deletePlanTemplate: DeletePlanTemplateReducer,
    getNutritionPlanDetail: getNutritionPlanDetailByIdReducer,

    // Staff
    staffAdd: StaffAddSlice,
    staffList: StaffListSlice,
    staffEdit: editStaff,
    updateStaff: UpdateStaff,
    deleteStaff: deleteStaff,

    //file
    singleUpload: singleFileUpload,
    foodUpload: foodFileUpload,
    trainingCampUpload: trainingCampFileUpload,
    fileDelete: fileDeleteReducer,

    // Athlete
    getAthleteList: getAthleteListReducer,
    athleteAdd: athleteAddReducer,
    athleteEdit: editAthleteReducer,
    getAthleteByID: getAthleteIDReducer,
    athleteUpdateByID: athleteUpdateReducer,
    athleteList: athleteListReducer,
    deleteAthlete: deleteAthleteReducer,
    coachComments: coachCommentsReducer,
    addAcademicQualification: addAcademicQualificationReducer,
    deleteAcademicQualification: DeleteAcademicQualificationReducer,

    // ListGoalsTargets
    listGoalsTargets: listGoalsTargetsReducer,
    addGoalsTargets: AddGoalsTargetsReducer,
    individualMilestone: IndividualMilestoneReducer,
    individualMilestoneEdit: IndividualMilestoneEditReducer,
    editGoalsTargets: EditGoalsTargetsReducer,
    updatedGoalsTargets: UpdateGoalsTargetsReducer,
    deleteGoalsTargets: DeleteGoalsTargetsReducer,
    ListeChart: ChartListSliceReducer,

    //Role
    rolesList: roleReducer,
    getContractTypeList: getContractTypeReducer,
    getRewardsTypeList: getRewardsType,
    getFacilityTypeList: getFacilityType,

    // Sports List
    getSportList: getSportListReducer,

    // ListSeason
    listSeason: listSeasonReducer,
    addSeason: AddSeasonReducer,
    editSeason: EditSeasonReducer,
    updateSeason: UpdateSeasonReducer,
    deleteSeason: DeleteSeasonReducer,

    // Language List
    getLanguagesList: LanguageListReducer,

    // Race Calendar
    addRaceCalendar: raceCalendarAddSlice,
    updateRaceCalendar: updateRaceCalendarSlice,
    getRaceCalendarList: getRaceCalendarListSlice,
    GetRaceCalendarByID: GetRaceCalendarByIDSlice,
    GetRaceYearlyCalendar: getRaceYearlyCalendarListSlice,
    deleteRaceCalendar: DeleteRaceCalendarReducer,

    // TrainingPlans
    TrainingPlansAdd: TrainingPlansAddReducer,
    TrainingPlansEdit: editTrainingPlansReducer,
    TrainingPlansUpdateByID: TrainingPlansUpdateReducer,
    trainingPlansList: TrainingPlansListReducer,
    deleteTrainingPlans: deleteTrainingPlansReducer,
    UpdateTrainingResultByID: UpdateTrainingResultByIDReducer,
    // get Nationality
    getNationalityList: getNationalityLisReducer,
    getPlanList: getPlanListReducer,

    //Notification
    getNotificationList: NotificationListReducer,
    updateNotificationById: NotificationUpdateReducer,
    getNotificationModuleByID: GetNotificationModuleByIDReducer,
    addNotification: NotificationAddReducer,
    // user list
    userList: UserListSliceReducer,
    updateUserAsAdmin: UpdateUserAsAdminReducer,

    // Roles ans permissions
    userRole: UserRoleReducer,
    userAccessByRole: UserAccessByRoleReducer,
    updateUserAccessByRole: UpdateUserAccessByRoleReducer,
    getSeasonCategory: GetSeasonCategoryReducer,
    updateSeasonCategory: UpdateSeasonCategoryReducer,

    // reports
    addReport: ReportAddSliceReducer,
    getReportAthlete: AthleteGetListSliceReducer,
    getRaceReportList: RaceReportGetListSliceReducer,
    updateReport: ReportUpdateSliceReducer,
    getReportByID: ReportGetByIDSliceReducer,
    fileUploadReport: ReportFileUploadSliceReducer,
    //kpi
    GetMedicalTestKpiList: GetMedicalTestKpiListReducer,

    // Tournament
    addCompetition: CompetitionAddReducer,
    getCompetitionListAPI: ListCompetitionReducer,
    addMatch: MatchAddReducer,
    addTimeslot: TimeslotAddReducer,

    // Department
    addDepartment: DepartmentAddReducer,
    getDepartmentListAPI: ListDepartmentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>; // Type for the entire state
export type AppDispatch = typeof store.dispatch; // Type for dispatch
export type DummyDispatch = typeof store.dispatch; // Type for dispatch
export type singleFileUploadDispatch = typeof store.dispatch; // Type for dispatch
export type editStaffDispatch = typeof store.dispatch; // Type for dispatch
export type updateStaffDispatch = typeof store.dispatch; // Type for dispatch
export type getAthleteListDispatch = typeof store.dispatch; // Type for dispatch
export type addRaceCalendarDispatch = typeof store.dispatch; // Type for dispatch
export type updateRaceCalendarDispatch = typeof store.dispatch; // Type for dispatch
export type getRaceCalendarListDispatch = typeof store.dispatch; // Type for dispatch
export type athleteUpdateByIDDispatch = typeof store.dispatch; // Type for dispatch
export type getSportListDispatch = typeof store.dispatch; // Type for dispatch
export type getPlanListDispatch = typeof store.dispatch;

export default store;
