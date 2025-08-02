import { REGEX, USER_ERROR } from "@/utils/constants";
import _ from "lodash";
import moment from "moment";
import { capitalizeFirstLetter, validateDateOfBirth, validateNewSingleDates } from "../helper";

const hasLeadingOrTrailingSpace = (value: string) => /^\s|\s+$/g.test(value);
const containsSpecialCharacters = (value: string) => /[^a-zA-Z0-9\u0600-\u06FF\s]/.test(value);
const containsCharacters = (value: string) => /[a-zA-Z\u0600-\u06FF]/.test(value.replace(/\s/g, ''));
const isAlphaWithSpaces = (value: any) => /^[a-zA-Z\u0600-\u06FF\s]+$/.test(value);
const containsNumbers = (value: string) => /\d/.test(value);
const alphaPattern = /^[a-zA-Z_.,()/:\s ]*$/

type UserErrorKey = keyof typeof USER_ERROR;

const validateNameField = (fieldName: any, fieldValue: any, errorLabel: UserErrorKey) => {
  if (!fieldValue || _.trim(fieldValue) === "") {
    return USER_ERROR[errorLabel];
  } else if (!/^[a-zA-Z\u0600-\u06FF\s]+$/.test(fieldValue)) {
    return `${fieldName} should not contain special characters & numbers.`;
  } else if (hasLeadingOrTrailingSpace(fieldValue)) {
    return `${fieldName} should not have leading or trailing spaces.`;
  } else if (containsNumbers(fieldValue)) {
    return `${fieldName} should not contain numbers.`;
  }
  return null;
};

export const useFormValidation = (formData: any, setErrors: any) => {
  const validate = () => {
    const newErrors: any = {};

    if (!formData.address || _.trim(formData.address) === "") {
      newErrors.address = USER_ERROR.ADDRESS;
    }
    if (!formData.area || _.trim(formData.area) === "") {
      newErrors.area = "Area is required.";
    }
    if (!formData.city || _.trim(formData.city) === "") {
      newErrors.city = "City is required.";
    }
    if (!formData.country || _.trim(formData.country) === "") {
      newErrors.country = "Country is required.";
    }
    if (_.isEmpty(formData.personalEmail)) {
      newErrors.personalEmail = USER_ERROR.PERSONAL_EMAIL_REQUIRED;
    } else if (!formData.personalEmail.includes("@")){
      newErrors.personalEmail = USER_ERROR.EMAIL_INVALID;
    } else if (hasLeadingOrTrailingSpace(formData.personalEmail)) {
      newErrors.personalEmail = `Personal Email should not have leading or trailing spaces.`;
    }
    if (!_.isEmpty(formData.dubaiPoliceEmail)) {
      if (!REGEX.GOVERMENT_EMAIL.test(formData.dubaiPoliceEmail)) {
        newErrors.dubaiPoliceEmail = "Enter the Valid Dubai police email id example: adam@dubaipolice.gov.ae ";
      }
    }
    if (!formData.phoneNo || _.trim(formData.phoneNo) === "") {
      newErrors.phoneNo = USER_ERROR.PHONE_NUMBER_REQUIRED;
    } else if (!/^\d+$/.test(formData.phoneNo.replace(/\s/g, ""))) {
      newErrors.phoneNo = USER_ERROR.INVALID_PHONE_NUMBER;
    }
    if (!formData.emergencyContactNumber || _.trim(formData.emergencyContactNumber) === "") {
      newErrors.emergencyContactNumber = USER_ERROR.EMERGENCY_CONTACT_NUMBER_REQUIRED;
    } else if (!/^\d+$/.test(formData.emergencyContactNumber.replace(/\s/g, ""))) {
      newErrors.emergencyContactNumber = USER_ERROR.INVALID_PHONE_NUMBER;
    }
    if (!formData.emergencyContactName || _.trim(formData.emergencyContactName) === "") {
      newErrors.emergencyContactName = USER_ERROR.EMERGENCY_CONTACT_NAME_REQUIRED;
    } else if (!REGEX.TEXT.test(formData.emergencyContactName)) {
      newErrors.emergencyContactName = "Emergency Contact Name should not contain special characters."
    }

    const fieldsToValidate = [
      "country",
      "area",
      "city",
      "emergencyContactName",
      "dubaiPoliceEmail",
      "personalEmail"
    ];
    fieldsToValidate.forEach((field) => {
      const value = formData[field];
      if (!_.isEmpty(value)) {
        if (hasLeadingOrTrailingSpace(value)) {
          newErrors[field] = `${capitalizeFirstLetter(field.replace(/([A-Z])/g, ' $1'))} should not have leading or trailing spaces.`;
        }
      }
    });
    setErrors(newErrors);
    return newErrors;
  };
  return { validate };
};

export const PersonalFormValidation = (formData: any, setErrors: any) => {
  const dobMoment = moment(formData.dob, "DD-MM-YYYY", true);
  const validate = () => {
    const newErrors: Record<string, string | null> = {};
    const firstNameError = validateNameField("First Name", formData.firstName, "F_NAME");
    if (firstNameError) newErrors.firstName = firstNameError;
    const surnameError = validateNameField("Surname", formData.surname, "L_NAME");
    if (surnameError) newErrors.surname = surnameError;
    const middleNameError = validateNameField("Middle Name", formData.middleName, "M_NAME");
    if (middleNameError) newErrors.middleName = middleNameError;
    if (!_.isEmpty(formData.placeOfBirth)) {
      if (!REGEX.TEXT.test(formData.placeOfBirth)) {
        newErrors.placeOfBirth = `place Of Birth should not contain special characters & numbers.`;
      }
    }
    if (!_.isEmpty(formData.emiratesID)) {
      if (hasLeadingOrTrailingSpace(formData.emiratesID)) {
        newErrors.emiratesID = `Emirates ID should not have leading or trailing spaces.`;
      }
      if (!REGEX.SPECIALCHARCTERS.test(formData.emiratesID)) {
        newErrors.emiratesID = `Emirates ID should not contain special characters & numbers.`;
      }
    }
    if (!_.isEmpty(formData.passportNo)) {
      if (!REGEX.SPECIALCHARCTERS.test(formData.passportNo)) {
        newErrors.passportNo = `Passport No should not contain special characters & numbers.`;
      }
    }
    if (!formData.nationality || _.trim(formData.nationality) === "") {
      newErrors.nationality = USER_ERROR.NATIONALITY;
    }
    if (_.isEmpty(formData.gender)) {
      newErrors.gender = USER_ERROR.GENDER;
    }
    const birthErrors = validateDateOfBirth(
      formData.dob,
      18,
      76,
      "Date of Birth",
      true,
      "dob"
    );
    const passportExpirationDateErrors = validateNewSingleDates(formData.passportExpirationDate, 10, "Passport Expiration Date", false, "passportExpirationDate", 10);
    const emiratesExpiryDatedateErrors = validateNewSingleDates(formData.emiratesExpiryDate, 10, "Passport Expiration Date", false, "emiratesExpiryDate", 10);
    Object.assign(newErrors, birthErrors, passportExpirationDateErrors, emiratesExpiryDatedateErrors);
    if (!formData.languagesSpoken || _.trim(formData.languagesSpoken) === "") {
      newErrors.languagesSpoken = "Please Select at least one spoken language.";
    }
    const fieldsToValidate = [
      "placeOfBirth",
      "passportNo",
    ];
    fieldsToValidate.forEach((field) => {
      const value = formData[field];
      if (!_.isEmpty(value)) {
        if (hasLeadingOrTrailingSpace(value)) {
          newErrors[field] = `${capitalizeFirstLetter(field.replace(/([A-Z])/g, ' $1'))} should not have leading or trailing spaces.`;
        }
      }
    });
    setErrors(newErrors);
    return newErrors;
  };
  return { validate };
};

export const ProfessionalFormValidation = (
  formData: any,
  setErrors: any,
  editAthleteData: any
) => {
  const validate = () => {
    const newErrors: any = {};
    // if (!formData.role || _.trim(formData.role) === "") {
    //   newErrors.role = USER_ERROR.ROLE;
    // }
    const isAcademicQualificationListEmpty =
      editAthleteData?.academicQualificationList?.length === 0;
    if (isAcademicQualificationListEmpty) {
      if (!formData.academicQualification || _.trim(formData.academicQualification) === "") {
        newErrors.academicQualification = "Academic Qualification is required.";
      }
      if (!_.isEmpty(formData.academicQualification)) {
        if (!formData.uploadDegree || _.trim(formData.uploadDegree) === "") {
          newErrors.uploadDegree = "Upload Certificate is required.";
        }
        if (!formData.fieldOfStudy || _.trim(formData.fieldOfStudy) === "") {
          newErrors.fieldOfStudy = "Field of Study is required.";
        } else if (!REGEX.TEXT.test(formData.fieldOfStudy)) {
          newErrors.fieldOfStudy = `Field Of Study should not contain special characters & numbers.`;
        }
        if (!formData.universityName || _.trim(formData.universityName) === "") {
          newErrors.universityName = "Educational Institution Name is required.";
        } else if (!REGEX.TEXT.test(formData.universityName)) {
          newErrors.universityName = `Educational Institution Name should not contain special characters & numbers.`;
        }
        if (!formData.location || _.trim(formData.location) === "") {
          newErrors.location = "Location is required.";
        } else if (!REGEX.TEXT.test(formData.placeOfBirth)) {
          newErrors.placeOfBirth = `location should not contain special characters & numbers.`;
        }
      }
    }

    if (formData.externalClubs === "yes") {
      if (!formData.sportClubAssociation || _.trim(formData.sportClubAssociation) === "") {
        newErrors.sportClubAssociation = "Sport Club Association Name is required.";
      } else if (!REGEX.TEXT.test(formData.sportClubAssociation)) {
        newErrors.sportClubAssociation = `Sport Club Association Name should not contain special characters & numbers.`;
      }
      if (!formData.roleAssignedClub || _.trim(formData.roleAssignedClub) === "") {
        newErrors.roleAssignedClub = "Role Assignedin Club is required.";
      } else if (!REGEX.TEXT.test(formData.sportClubAssociation)) {
        newErrors.sportClubAssociation = `Role Assignedin Club Name should not contain special characters & numbers.`;
      }
    }
    if (!formData.sportsCategory || _.trim(formData.sportsCategory) === "") {
      newErrors.sportsCategory = USER_ERROR.SPORT_CATEGORY;
    } else if (!REGEX.TEXT.test(formData.sportsCategory)) {
      newErrors.sportsCategory = `Sports Category should not contain special characters & numbers.`;
    }
    if (!formData.disciplinePracticed || _.trim(formData.disciplinePracticed) === "") {
      newErrors.disciplinePracticed = USER_ERROR.DISCIPLINE;
    } else if (!REGEX.TEXT.test(formData.disciplinePracticed)) {
      newErrors.disciplinePracticed = `Discipline Practiced should not contain special characters & numbers.`;
    }
    if (_.isEmpty(formData.performanceLevel)) {
      newErrors.performanceLevel = USER_ERROR.PERFORMANCE;
    }
    const fieldsToValidate = [
      "sportsCategory",
      "disciplinePracticed",
      "sportClubAssociation",
      "roleAssignedClub",
      "fieldOfStudy",
      "universityName",
      "location"
    ];
    fieldsToValidate.forEach((field) => {
      const value = formData[field];
      if (!_.isEmpty(value)) {
        if (hasLeadingOrTrailingSpace(value)) {
          newErrors[field] = `${capitalizeFirstLetter(field.replace(/([A-Z])/g, ' $1'))} should not have leading or trailing spaces.`;
        }
      }
    });
    const federationExpiryDateErrors = validateNewSingleDates(formData.federationExpiryDate, 10, "Federation Expiry Date", false, "federationExpiryDate", 1);
    Object.assign(newErrors, federationExpiryDateErrors);
    setErrors(newErrors);
    return newErrors;
  };
  return { validate };
};

export const PhysicalAndMedicalFormValidation = (formData: any, setErrors: any) => {
  const validate = () => {
    const newErrors: any = {};
    if (_.isEmpty(formData.height) || isNaN(Number(formData.height))) {
      newErrors.height = "Height is required and must be a valid number.";
    }
    if (_.isEmpty(formData.weight) || isNaN(Number(formData.weight))) {
      newErrors.weight = "Weight is required and must be a valid number.";
    }
    if (!_.isEmpty(formData.height) && Number(formData.height) > 255) {
      newErrors.height = "Height cannot exceed 255 CM"
    }
    if (!_.isEmpty(formData.weight) && Number(formData.weight) > 640) {
      newErrors.weight = "Weight cannot exceed 640 KG"
    }
    if (_.isEmpty(formData.bloodType)) {
      newErrors.bloodType = 'Blood type is required.';
    }
    if (_.isEmpty(formData.sizeOfShoe)) {
      newErrors.sizeOfShoe = 'Shoe size is required.';
    }

    if (_.isEmpty(formData.sizeOfJersey)) {
      newErrors.sizeOfJersey = 'Jersey size is required.';
    }
    if (_.isEmpty(formData.sizeOfGloves)) {
      newErrors.sizeOfGloves = 'Gloves size is required.';
    }
    if (_.isEmpty(formData.sizeOfTrousers)) {
      newErrors.sizeOfTrousers = 'Trousers size is required.';
    }
    const testDateErrors = validateNewSingleDates(formData.testDate, 10, "Test Date", false, "testDate", 10);
    const testExpiryDateErrors = validateNewSingleDates(formData.testExpiryDate, 10, "Test Expiry Date", false, "testExpiryDate", 10);
    Object.assign(newErrors, testDateErrors, testExpiryDateErrors);
    if (!_.isEmpty(formData.previousInjuries)) {
      if (!REGEX.TEXT.test(formData.previousInjuries)) {
        newErrors.previousInjuries = `Previous Injuries should not contain special characters & numbers.`;
      }
    }
    if (!_.isEmpty(formData.sizeOfHelmet)) {
      if (!REGEX.ALPHA_NUMERIC.test(formData.sizeOfHelmet)) {
        newErrors.sizeOfHelmet = `Size Of Helmet should not contain special characters & numbers.`;
      }
    }
    if (!_.isEmpty(formData.sizeOfGloves)) {
      if (!REGEX.ALPHA_NUMERIC.test(formData.sizeOfGloves)) {
        newErrors.sizeOfGloves = `Size Of Gloves should not contain special characters & numbers.`;
      }
    }
      const fieldsToValidate = [
        "sizeOfShoe",
        "sizeOfGloves",
        "fieldOfStudy",
        "previousInjuries",
        "sizeOfHelmet",
        "sizeOfGloves"
      ];
      fieldsToValidate.forEach((field) => {
        const value = formData[field];
        if (!_.isEmpty(value)) {
          if (hasLeadingOrTrailingSpace(value)) {
            newErrors[field] = `${capitalizeFirstLetter(field.replace(/([A-Z])/g, ' $1'))} should not have leading or trailing spaces.`;
          }
        }
      });
      setErrors(newErrors);
      return newErrors;
    };

    return { validate };
  };
