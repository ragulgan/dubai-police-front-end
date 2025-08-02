import _ from "lodash";
import moment from "moment";
import { validateDateOfBirth, validateSingleDates } from "../helper";

const focusFirstErrorField = (errors: any) => {
  const errorFields = [
    "testName",
    "weight",
    "height",
    "testTime",
    "testDate",
  ];

  for (const field of errorFields) {
    if (errors[field]) {
      const input = document.getElementById(field);
      if (input) {
        (input as HTMLInputElement).focus();
        break;
      }
    }
  }
};


export const MedicalsFormValidation = (formData: any, setErrors: any) => {
  const validate = () => {
    const newErrors: any = {};
    const hasLeadingOrTrailingSpace = (value: string) => /^\s|\s+$/g.test(value);
    const containsSpecialCharacters = (value: string) => /[^a-zA-Z0-9\u0600-\u06FF\s]/.test(value);
    const containsCharacters = (value: string) => /[a-zA-Z\u0600-\u06FF]/.test(value.replace(/\s/g, ''));
    const isAlphaWithSpaces = (value: any) => /^[a-zA-Z\u0600-\u06FF\s]+$/.test(value);
    const containsNumbers = (value: string) => /\d/.test(value);
    if (!formData.sports) {
      newErrors.sports = "Sport is required.";
    }
    if (!formData.athleteName) {
      newErrors.athleteName = "Athlete Name is required.";
    }
    if (_.isEmpty(formData.testName)) {
      newErrors.testName = "Test Name is required.";
    }
    if (_.isEmpty(formData.kpiName)) {
      newErrors.kpiName = "KPI Name is required.";
    }
    if (_.isEmpty(formData.kpiPoint)) {
      newErrors.kpiPoint = "KPI Point is required.";
    }
    if (!_.isEmpty(formData.testName)) {
      if (!/^[a-zA-Z\u0600-\u06FF\s]+$/.test(formData.testName)) {
        newErrors.testName = "Test Name should not contain special characters and numeric.";
      } else if (hasLeadingOrTrailingSpace(formData.testName)) {
        newErrors.testName = "Test Name should not have leading or trailing spaces.";
      }
    }
    if (!_.isEmpty(formData.weight)) {
      if (containsCharacters(formData.weight)) {
        newErrors.weight = "Weight should not contain characters.";
      } else if (hasLeadingOrTrailingSpace(formData.weight)) {
        newErrors.weight = "Weight should not have leading or trailing spaces.";
      }
    }
    if (!_.isEmpty(formData.height)) {
      if (containsCharacters(formData.height)) {
        newErrors.height = "Height should not contain characters.";
      } else if (hasLeadingOrTrailingSpace(formData.height)) {
        newErrors.height = "Height should not have leading or trailing spaces.";
      }
    }
    if (!_.isEmpty(formData.testTime)) {
      if (!moment(formData.testTime, "hh:mm A", true).isValid()) {
        newErrors.testTime = "Invalid Test Time format. Use HH:mm AM/PM.";
      }
    }

    const fieldsToValidate = ["location", "conductingStaff", "recoveryPlan"];

    fieldsToValidate.forEach((field) => {
      const formattedField = field.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());
      if (!_.isEmpty(formData[field])) {
        if (!/^[a-zA-Z\u0600-\u06FF\s]+$/.test(formData[field])) {
          newErrors[field] = `${formattedField} should not contain special characters and numeric.`;
        } else if (hasLeadingOrTrailingSpace(formData[field])) {
          newErrors[field] = `${formattedField} should not have leading or trailing spaces.`;
        }
      }
    });


    if (!_.isEmpty(formData.testResult)) {
      const VALID_TEST_RESULT_REGEX = /^[a-zA-Z0-9\s.,<>=/:%+-]*$/;
      if (!VALID_TEST_RESULT_REGEX.test(formData.testResult)) {
        newErrors.testResult = "Test Result contains invalid characters.";
      } else if (hasLeadingOrTrailingSpace(formData.testResult)) {
        newErrors.testResult = "Test Result should not have leading or trailing spaces.";
      }
    }

    if (_.isEmpty(formData.testDate)) {
      newErrors.testDate = `Test Date is required`;
    } else if (!_.isEmpty(formData.testDate)) {
      if (!moment(formData.testDate, "DD/MM/YYYY", true).isValid()) {
        newErrors.testDate = `Test Date has an invalid date format.`;
      } else {
        const selectedDate = moment(formData.testDate, "DD/MM/YYYY");
        const today = moment();
        const oneYearAgo = moment().subtract(1, "year");
        if (selectedDate.isAfter(today, "day")) {
          newErrors.testDate = `Test Date cannot be a future date.`;
        } else if (selectedDate.isBefore(oneYearAgo, "day")) {
          newErrors.testDate = `Test Date must be within the last 1 year.`;
        }
      }
    }
    const birthErrors = validateDateOfBirth(
      formData.dob,
      18,
      60,
      "Date of Birth",
      false,
      "dob"
    );
    Object.assign(newErrors, birthErrors);

    if (
      formData.unitOfMeasurement === "custom" &&
      (!formData.customUnitOfMeasurement || formData.customUnitOfMeasurement.trim() === "")
    ) {
      newErrors.customUnitOfMeasurement = "Custom Unit of Measurement is required.";
    }

    // const fieldsToValidate = [
    //   "raceRelevanceAndImportance",
    //   "discipline",
    //   "categoryRanking",
    //   "generalRanking",
    //   "achievement",
    //   "seasonalLeagueRanking",
    //   "performance"
    // ];

    // fieldsToValidate.forEach((field) => {
    //   if (!_.isEmpty(formData[field])) {
    //     if (hasLeadingOrTrailingSpace(formData[field])) {
    //       newErrors[field] = `${field.replace(/([A-Z])/g, ' $1')} should not have leading or trailing spaces.`;
    //     } else if (!isAlphaWithSpaces(formData[field])) {
    //       newErrors[field] = `${field.replace(/([A-Z])/g, ' $1')} should not contain special characters and numeric. & numbers.`;
    //     }
    //   }
    // });

    setErrors((prevErrors: any) => ({
      ...prevErrors,
      ...newErrors
    }));
    focusFirstErrorField(newErrors);
    return newErrors;
  };
  return { validate };
};


export const AnotherTestFormValidation = (formData: any, setErrors: any) => {
  const validateTest = () => {
    const newErrors: any = {};
    const hasLeadingOrTrailingSpace = (value: string) => /^\s|\s+$/g.test(value);
    const containsCharacters = (value: string) => /[a-zA-Z\u0600-\u06FF]/.test(value.replace(/\s/g, ''));
    if (_.isEmpty(formData.testName)) {
      newErrors.testName = "Test Name is required.";
    }
    if (_.isEmpty(formData.kpiName)) {
      newErrors.kpiName = "KPI Name is required.";
    }
    if (_.isEmpty(formData.kpiPoint)) {
      newErrors.kpiPoint = "KPI Point is required.";
    }
    if (!_.isEmpty(formData.testName)) {
      if (!/^[a-zA-Z\u0600-\u06FF\s]+$/.test(formData.testName)) {
        newErrors.testName = "Test Name should not contain special characters and numeric.";
      } else if (hasLeadingOrTrailingSpace(formData.testName)) {
        newErrors.testName = "Test Name should not have leading or trailing spaces.";
      }
    }
    const fieldsToValidate = ["location", "conductingStaff", "recoveryPlan"];
    fieldsToValidate.forEach((field) => {
      const formattedField = field.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());
      if (!_.isEmpty(formData[field])) {
        if (!/^[a-zA-Z\u0600-\u06FF\s]+$/.test(formData[field])) {
          newErrors[field] = `${formattedField} should not contain special characters and numeric.`;
        } else if (hasLeadingOrTrailingSpace(formData[field])) {
          newErrors[field] = `${formattedField} should not have leading or trailing spaces.`;
        }
      }
    });
    if (!_.isEmpty(formData.testTime)) {
      if (!moment(formData.testTime, "hh:mm A", true).isValid()) {
        newErrors.testTime = "Invalid Test Time format. Use HH:mm AM/PM.";
      }
    }
    if (_.isEmpty(formData.testDate)) {
      newErrors.testDate = `Test Date is required`;
    } else if (!_.isEmpty(formData.testDate)) {
      if (!moment(formData.testDate, "DD/MM/YYYY", true).isValid()) {
        newErrors.testDate = `Test Date has an invalid date format.`;
      } else {
        const selectedDate = moment(formData.testDate, "DD/MM/YYYY");
        const today = moment();
        const oneYearAgo = moment().subtract(1, "year");
        if (selectedDate.isAfter(today, "day")) {
          newErrors.testDate = `Test Date cannot be a future date.`;
        } else if (selectedDate.isBefore(oneYearAgo, "day")) {
          newErrors.testDate = `Test Date must be within the last 1 year.`;
        }
      }
    }

    if (!_.isEmpty(formData.testResult)) {
      const VALID_TEST_RESULT_REGEX = /^[a-zA-Z0-9\s.,<>=/:%+-]*$/;
      if (!VALID_TEST_RESULT_REGEX.test(formData.testResult)) {
        newErrors.testResult = "Test Result contains invalid characters.";
      } else if (hasLeadingOrTrailingSpace(formData.testResult)) {
        newErrors.testResult = "Test Result should not have leading or trailing spaces.";
      }
    }
    if (
      formData.unitOfMeasurement === "custom" &&
      (!formData.customUnitOfMeasurement || formData.customUnitOfMeasurement.trim() === "")
    ) {
      newErrors.customUnitOfMeasurement = "Custom Unit of Measurement is required.";
    }    
    setErrors((prevErrors: any) => ({
      ...prevErrors,
      ...newErrors
    }));
    focusFirstErrorField(newErrors);
    return newErrors;
  };
  return { validateTest };
};


export const MedicalOnlyFormValidation = (formData: any, setErrors: any) => {
  const validateMedicalOnly = () => {
    const newErrors: any = {};
    const hasLeadingOrTrailingSpace = (value: string) => /^\s|\s+$/g.test(value);
    const containsCharacters = (value: string) => /[a-zA-Z\u0600-\u06FF]/.test(value.replace(/\s/g, ''));
    if (!formData.athleteName) {
      newErrors.athleteName = "Athlete Name is required.";
    }

    if (!_.isEmpty(formData.testName)) {
      if (!containsCharacters(formData.testName)) {
        newErrors.testName = "Test Name should not contain special characters or numbers.";
      } else if (hasLeadingOrTrailingSpace(formData.testName)) {
        newErrors.testName = "Test Name should not have leading or trailing spaces.";
      }
    }

    // Test Date Validation
    if (!_.isEmpty(formData.testDate)) {
      if (!moment(formData.testDate, "DD/MM/YYYY", true).isValid()) {
        newErrors.testDate = "Test Date has an invalid format.";
      } else {
        const selectedDate = moment(formData.testDate, "DD/MM/YYYY");
        const today = moment();
        const oneYearAgo = moment().subtract(1, "year");
        if (selectedDate.isAfter(today, "day")) {
          newErrors.testDate = "Test Date cannot be a future date.";
        } else if (selectedDate.isBefore(oneYearAgo, "day")) {
          newErrors.testDate = "Test Date must be within the last 1 year.";
        }
      }
    } else if (!_.isEmpty(formData.testName)) {
      newErrors.testDate = "Test Date is required.";
    }

    if (!_.isEmpty(formData.testDate) && _.isEmpty(formData.testName)) {
      newErrors.testName = "Test Name is required.";
    }
    if (
      formData.unitOfMeasurement === "custom" &&
      (!formData.customUnitOfMeasurement || formData.customUnitOfMeasurement.trim() === "")
    ) {
      newErrors.customUnitOfMeasurement = "Custom Unit of Measurement is required.";
    }
    
    const birthErrors = validateDateOfBirth(
      formData.dob,
      18,
      60,
      "Date of Birth",
      false,
      "dob"
    );
    Object.assign(newErrors, birthErrors);
    setErrors((prevErrors: any) => ({
      ...prevErrors,
      ...birthErrors,
      ...newErrors
    }));
    focusFirstErrorField(newErrors);
    return newErrors;
  };
  return { validateMedicalOnly };
};