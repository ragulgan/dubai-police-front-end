import _ from "lodash";
import moment from "moment";
import { REGEX } from "../constants";

export const GeneralFormValidation = (
  formData: any,
  setErrors: any,
  frequencyData: any,
  id: any
) => {
  const validate = () => {
    const validationErrors: any = {};
    if (_.isEmpty(frequencyData) && formData.trainingFrequency === "Custom") {
      validationErrors.trainingFrequencycustom =
        "Please select other training frequency or type the custom training frequency";
      document.getElementById("trainingFrequencycustom")?.focus();
    }
    if (
      !_.isEmpty(formData.trainingStartDate) &&
      !_.isEmpty(formData.trainingEndDate) &&
      moment(formData.trainingEndDate, "DD/MM/YYYY").isBefore(
        moment(formData.trainingStartDate, "DD/MM/YYYY")
      )
    ) {
      validationErrors.trainingEndDate =
        "Training End Date cannot be earlier than Start Date";
      document.getElementById("trainingEndDate")?.focus();
    }
    const trainingEndDate = formData.trainingEndDate;
    const trainingStartDate = formData.trainingStartDate;
    if (_.isEmpty(trainingStartDate)) {
      validationErrors.trainingStartDate = "Training Start Date is required.";
      document.getElementById("trainingStartDate")?.focus();
    } else {
      const parsedDate = moment(trainingStartDate, "DD/MM/YYYY", true);
      if (!parsedDate.isValid()) {
        validationErrors.trainingStartDate =
          "Invalid Date. Please provide a valid date in DD MM YYYY format.";
        document.getElementById("trainingStartDate")?.focus();
      } else if (parsedDate.isBefore(moment(), "day") && !id) {
        validationErrors.trainingStartDate =
          "Training Start Date cannot be in the past.";
        document.getElementById("trainingStartDate")?.focus();
      }
    }
    if (_.isEmpty(trainingEndDate)) {
      validationErrors.trainingEndDate = "Training End Date is required.";
      document.getElementById("trainingEndDate")?.focus();
    } else {
      const parsedStartDate = moment(trainingStartDate, "DD/MM/YYYY", true);
      const parsedEndDate = moment(trainingEndDate, "DD/MM/YYYY", true);
      if (!parsedEndDate.isValid()) {
        validationErrors.trainingEndDate =
          "Invalid Date. Please provide a valid date in DD MM YYYY format.";
        document.getElementById("trainingEndDate")?.focus();
      } else if (parsedEndDate.isBefore(moment(), "day") && !id) {
        validationErrors.trainingEndDate =
          "Training End Date cannot be in the past.";
        document.getElementById("trainingEndDate")?.focus();
      } else if (
        parsedStartDate.isValid() &&
        parsedEndDate.isBefore(parsedStartDate, "day")
      ) {
        validationErrors.trainingEndDate =
          "Training End Date cannot be before the Training Start Date.";
        document.getElementById("trainingEndDate")?.focus();
      }
    }
    if (!formData.trainingPlan || _.trim(formData.trainingPlan) === "") {
      validationErrors.trainingPlan = "Training Plan is required";
      document.getElementById("trainingPlan")?.focus();
    } else if (!REGEX.SPECIALCHARCTERS.test(formData.trainingPlan)) {
      validationErrors.trainingPlan =
        "Special characters not allowed other than - . , ( ) / :";
      document.getElementById("trainingPlan")?.focus();
    }
    setErrors(validationErrors);
    return validationErrors;
  };
  return { validate };
};
