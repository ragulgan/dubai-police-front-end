import _ from "lodash";
import moment from "moment";
import { validateNewSingleDates, validateSingleDates } from "../helper";

const focusFirstErrorField = (errors: any) => {
  const errorFields = [
    "resultType",
    "unit",
    "homeTeamName",
    "awayTeamName",
    "eventName",
    "eventLocation",
    "eventTime",
    "eventDate",
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


export const ResultFormValidation = (formData: any, setErrors: any) => {
  const validate = () => {
    const newErrors: any = {};
    const hasLeadingOrTrailingSpace = (value: string) => /^\s|\s+$/g.test(value);
    const containsSpecialCharacters = (value: string) => /[^a-zA-Z0-9\u0600-\u06FF\s]/.test(value);
    const containsCharacters = (value: string) => /[a-zA-Z\u0600-\u06FF]/.test(value.replace(/\s/g, ''));
    const isAlphaWithSpaces = (value: any) => /^[a-zA-Z\u0600-\u06FF\s]+$/.test(value);

    const minDate = moment().subtract(12, "months");
    const maxDate = moment().add(12, "months");

    const containsNumbers = (value: string) => /\d/.test(value);
    if (_.isEmpty(formData.homeTeamName)) {
      newErrors.homeTeamName = "Home Team Name is required.";
    } else if (!/^[a-zA-Z\u0600-\u06FF\s]+$/.test(formData.homeTeamName)) {
      newErrors.homeTeamName = "Home Team Name should only contain letters and spaces.";
    } else if (hasLeadingOrTrailingSpace(formData.homeTeamName)) {
      newErrors.homeTeamName = "Home Team Name should not have leading or trailing spaces.";
    } else if (containsNumbers(formData.homeTeamName)) {
      newErrors.homeTeamName = "Home Team Name should not contain numbers.";
    }
    // if (!formData.awayTeamName || _.trim(formData.awayTeamName) === "") {
    //   newErrors.awayTeamName = "Away Team Name is required.";
    // } 
    if (!_.isEmpty(formData.awayTeamName)) {
      if (!/^[a-zA-Z\u0600-\u06FF\s]+$/.test(formData.awayTeamName)) {
        newErrors.awayTeamName = "Away Team Name should not contain special characters & numbers.";
      } else if (hasLeadingOrTrailingSpace(formData.awayTeamName)) {
        newErrors.awayTeamName = "Away Team Name should not have leading or trailing spaces.";
      } else if (containsNumbers(formData.awayTeamName)) {
        newErrors.awayTeamName = "Away Team Name should not contain numbers.";
      }
    }

    if (!formData.resultCategory || _.trim(formData.resultCategory) === "") {
      newErrors.resultCategory = "Result Category is required.";
    }
    if (!formData.sportsCategory || _.trim(formData.sportsCategory) === "") {
      newErrors.sportsCategory = "Sports Category is required.";
    }
    if (!formData.eventDate || _.trim(formData.eventDate) === "") {
      newErrors.eventDate = "Event Date is required.";
    }
    if (_.isEmpty(formData.resultType)) {
      newErrors.resultType = "Result Type is required."
    }
    if (!formData.unit || _.trim(formData.unit) === "") {
      newErrors.unit = "Unit is required.";
    }
    if (formData?.resultType === "others") {
      if (!formData.unit || _.trim(formData.unit) === "") {
        newErrors.unit = "Unit is required.";
      } else if (!/^[a-zA-Z\u0600-\u06FF\s]+$/.test(formData.unit)) {
        newErrors.unit = "Unit should not contain special characters & numbers.";
      } else if (hasLeadingOrTrailingSpace(formData.unit)) {
        newErrors.unit = "Unit should not have leading or trailing spaces.";
      } else if (containsNumbers(formData.unit)) {
        newErrors.unit = "Unit should not contain numbers.";
      }
    }


    if (!formData.eventName || _.trim(formData.eventName) === "") {
      newErrors.eventName = "Event Name is required.";
    } else if (!/^[a-zA-Z\u0600-\u06FF\s]+$/.test(formData.eventName)) {
      newErrors.eventName = "Event Name should not contain special characters & numbers.";
    } else if (hasLeadingOrTrailingSpace(formData.eventName)) {
      newErrors.eventName = "Event Name should not have leading or trailing spaces.";
    } else if (containsNumbers(formData.eventName)) {
      newErrors.eventName = "Event Name should not contain numbers.";
    }


    if (!_.isEmpty(formData.homeTeamValue)) {
      if (!/^\d+$/.test(formData.homeTeamValue)) {
        newErrors.homeTeamValue = "Home Team Value should contain only numbers.";
      } else if (hasLeadingOrTrailingSpace(formData.homeTeamValue)) {
        newErrors.homeTeamValue = "Home Team Value should not have leading or trailing spaces.";
      }
    }
    if (!_.isEmpty(formData.awayTeamValue)) {
      if (!/^\d+$/.test(formData.awayTeamValue)) {
        newErrors.awayTeamValue = "Away Team Value should contain only numbers.";
      } else if (hasLeadingOrTrailingSpace(formData.awayTeamValue)) {
        newErrors.awayTeamValue = "Away Team Value should not have leading or trailing spaces.";
      }
    }
    if (!formData.eventTime || _.trim(formData.eventTime) === "") {
      newErrors.eventTime = "Event Time is required.";
    } else if (!moment(formData.eventTime, "hh:mm A", true).isValid()) {
      newErrors.eventTime = "Invalid Event Time format. Use HH:mm AM/PM.";
    }
    if (!formData.eventLocation || _.trim(formData.eventLocation) === "") {
      newErrors.eventLocation = "Event Location is required.";
    } else if (!/^[a-zA-Z\u0600-\u06FF\s]+$/.test(formData.eventLocation)) {
      newErrors.eventLocation = "Event Location should not contain special characters & numbers.";
    } else if (hasLeadingOrTrailingSpace(formData.eventLocation)) {
      newErrors.eventLocation = "Event Location should not have leading or trailing spaces.";
    } else if (containsNumbers(formData.eventLocation)) {
      newErrors.eventLocation = "Event Location should not contain numbers.";
    }
    const dateErrors = validateNewSingleDates(formData.eventDate, 10, "Event Date", false, "eventDate", 10);
    Object.assign(newErrors, dateErrors);
    const fieldsToValidate = [
      "raceRelevanceAndImportance",
      "discipline",
      "categoryRanking",
      "generalRanking",
      "achievement",
      "seasonalLeagueRanking",
      "performance"
    ];

    fieldsToValidate.forEach((field) => {
      if (!_.isEmpty(formData[field])) {
        if (hasLeadingOrTrailingSpace(formData[field])) {
          newErrors[field] = `${capitalizeFirstLetter(field.replace(/([A-Z])/g, ' $1'))} should not have leading or trailing spaces.`;
        } else if (!isAlphaWithSpaces(formData[field])) {
          newErrors[field] = `${capitalizeFirstLetter(field.replace(/([A-Z])/g, ' $1'))} should not contain special characters & numbers.`;
        }
      }
    });
    function capitalizeFirstLetter(string: any) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
    setErrors((prevErrors: any) => ({
      ...prevErrors,
      ...dateErrors,
      ...newErrors
    }));
    focusFirstErrorField(newErrors);
    return newErrors;
  };
  return { validate };
};