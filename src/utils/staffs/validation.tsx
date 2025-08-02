import { REGEX, USER_ERROR } from "@/utils/constants";
import _ from "lodash";
import moment from "moment";
import { capitalizeFirstLetter, NewValidateDates, validateDateOfBirth, validateDates, validateNewSingleDates, validateSingleDates } from "../helper";


const hasLeadingOrTrailingSpace = (value: string) => /^\s|\s+$/g.test(value);
const containsSpecialCharacters = (value: string) => /[^a-zA-Z0-9\u0600-\u06FF\s]/.test(value);
const containsCharacters = (value: string) => /[a-zA-Z\u0600-\u06FF]/.test(value.replace(/\s/g, ''));
const isAlphaWithSpaces = (value: any) => /^[a-zA-Z\u0600-\u06FF\s]+$/.test(value);
const containsNumbers = (value: string) => /\d/.test(value);
const alphaPattern = /^[a-zA-Z\u0600-\u06FF\s]+$/;

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
      newErrors.city = "Emirate is required.";
    }
    // if (!formData.country || _.trim(formData.country) === "") {
    //   newErrors.country = "Country is required.";
    // } else if (!/^[a-zA-Z\u0600-\u06FF\s]+$/.test(formData.country)) {
    //   newErrors.country = "Country should not contain special characters.";
    // }
    if (_.isEmpty(formData.personalEmail)) {
      newErrors.personalEmail = USER_ERROR.PERSONAL_EMAIL_REQUIRED;
    } else if (!formData.personalEmail.includes("@")){
      newErrors.personalEmail = USER_ERROR.EMAIL_INVALID;
    }
    if (
      !_.isEmpty(formData.dubaiPoliceEmail) &&
      !REGEX.GOVERMENT_EMAIL.test(formData.dubaiPoliceEmail)
    ) {
      newErrors.dubaiPoliceEmail = USER_ERROR.DP_EMAIL_INVALID;
    }
    if (!formData.phoneNo || _.trim(formData.phoneNo) === "") {
      newErrors.phoneNo = USER_ERROR.PHONE_NUMBER_REQUIRED;
    } else if (!/^\d+$/.test(formData.phoneNo)) {
      newErrors.phoneNo = USER_ERROR.INVALID_PHONE_NUMBER;
    }
    if (
      !formData.emergencyContactName ||
      _.trim(formData.emergencyContactName) === ""
    ) {
      newErrors.emergencyContactName =
        USER_ERROR.EMERGENCY_CONTACT_NAME_REQUIRED;
    }
    if (
      !formData.emergencyContactNumber ||
      _.trim(formData.emergencyContactNumber) === ""
    ) {
      newErrors.emergencyContactNumber =
        USER_ERROR.EMERGENCY_CONTACT_NUMBER_REQUIRED;
    } else if (!/^\d+$/.test(formData.emergencyContactNumber)) {
      newErrors.emergencyContactNumber = USER_ERROR.INVALID_PHONE_NUMBER;
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

type UserErrorKey = keyof typeof USER_ERROR;

const validateNameField = (fieldName: any, fieldValue: any, errorLabel: UserErrorKey) => {
  if (!fieldValue || _.trim(fieldValue) === "") {
    return USER_ERROR[errorLabel];
  } else if (!alphaPattern.test(fieldValue)) {
    return `${fieldName} should not contain special characters & numbers.`;
  } else if (hasLeadingOrTrailingSpace(fieldValue)) {
    return `${fieldName} should not have leading or trailing spaces.`;
  } else if (containsNumbers(fieldValue)) {
    return `${fieldName} should not contain numbers.`;
  }
  return null;
};

export const PersonalFormValidation = (formData: any, setErrors: any, otherStaffShow: any) => {
  const validate = () => {
    const newErrors: Record<string, string | null> = {};
    const firstNameError = validateNameField("First Name", formData.firstName, "F_NAME");
    if (firstNameError) newErrors.firstName = firstNameError;
    const surnameError = validateNameField("Surname", formData.surname, "L_NAME");
    if (surnameError) newErrors.surname = surnameError;
    const middleNameError = validateNameField("Middle Name", formData.middleName, "M_NAME");
    if (middleNameError) newErrors.middleName = middleNameError;
    if (!formData.height || _.trim(formData.height) === "") {
      newErrors.height = USER_ERROR.HEIGHT;
    }
    if (!formData.weight || _.trim(formData.weight) === "") {
      newErrors.weight = USER_ERROR.WEIGHT;
    }
    if (!_.isEmpty(formData.height) && Number(formData.height) > 255) {
      newErrors.height = "Height cannot exceed 255 CM";
    }
    if (!_.isEmpty(formData.weight) && Number(formData.weight) > 640) {
      newErrors.weight = "Weight cannot exceed 640 KG";
    }
    if (!formData.gender || _.trim(formData.gender) === "") {
      newErrors.gender = USER_ERROR.GENDER;
    }
    if (!formData.role || _.trim(formData.role) === "") {
      newErrors.role = USER_ERROR.ROLE;
    }
    if (!formData.nationality || _.trim(formData.nationality) === "") {
      newErrors.nationality = USER_ERROR.NATIONALITY;
    }

    if (_.isEmpty(formData.otherStaff) && otherStaffShow === "Other Team Staff") {
      newErrors.otherStaff = "Please type a role";
    }
    if (_.isNil(formData.age) || formData.age === "") {
      newErrors.age = USER_ERROR.AGE;
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
    Object.assign(newErrors, emiratesExpiryDatedateErrors, passportExpirationDateErrors, birthErrors);
    if (!formData.passportPdf || _.trim(formData.passportPdf) === "") {
      newErrors.passportPdf = "Passport document is required.";
    }
    if (!formData.iDdocumentImage || _.trim(formData.iDdocumentImage) === "") {
      newErrors.iDdocumentImage = "ID document image is required.";
    }
    if (!formData.languagesSpoken || _.trim(formData.languagesSpoken) === "") {
      newErrors.languagesSpoken = "Please Select at least one spoken language.";
    }
    if (!_.isEmpty(formData.placeOfBirth)) {
      if (!REGEX.TEXT.test(formData.placeOfBirth)) {
        newErrors.placeOfBirth = `place Of Birth should not contain special characters & numbers.`;
      }
    }
    const fieldsToValidate = [
      "placeOfBirth"
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

export const EducationFormValidation = (formData: any, setErrors: any, editStaffData: any) => {
  const validate = () => {
    const newErrors: any = {};
    if (editStaffData?.academicQualificationList?.length === 0) {
      if (_.isEmpty(formData.academicQualification)) {
        newErrors.academicQualification = USER_ERROR.QUALIFICATION;
      }
    }
    const fieldsToValidate = [
      "fieldOfStudy",
      "location",
      "universityName",
      "skills",
      "achievementsAsCoach"
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
    const firstErrorKey = Object.keys(newErrors)[0];
    if (firstErrorKey) {
      const errorField = document.querySelector(
        `[name="${firstErrorKey}"]`
      ) as HTMLElement;
      if (errorField) {
        errorField.focus();
      }
    }
    return newErrors;
  };

  return { validate };
};

export const CertificateAndLicence = (formData: any, setErrors: any) => {
  const validate = () => {
    const newErrors: any = {};
    const fieldsToValidate = [
      "coachingCertifications",
      "issuingOrganization",
      "level",
      "federationLicence",
      // "previousSportEthicalConduct"
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
    const firstErrorKey = Object.keys(newErrors)[0];
    if (firstErrorKey) {
      const errorField = document.querySelector(
        `[name="${firstErrorKey}"]`
      ) as HTMLElement;
      if (errorField) {
        errorField.focus();
      }
    }
    return newErrors;
  };

  return { validate };
};

export const EmploymentFormValidation = (formData: any, setErrors: any, showField: any) => {
  const validate = () => {
    const newErrors: any = {};
    if (
      !formData.currentJobPosition ||
      _.trim(formData.currentJobPosition) === ""
    ) {
      newErrors.currentJobPosition = USER_ERROR.CURRENT_JOB_POSITION;
    }
    if (
      !formData.currentJobLocation ||
      _.trim(formData.currentJobLocation) === ""
    ) {
      newErrors.currentJobLocation = USER_ERROR.CURRENT_JOB_LOCATION;
    }
    if (!formData.acknowledgementDoc || _.trim(formData.acknowledgementDoc) === "") {
      newErrors.acknowledgementDoc = "Acknowledgement Document is required.";
    }
    if (!formData.pledgeDoc || _.trim(formData.pledgeDoc) === "") {
      newErrors.pledgeDoc = "Pledge Document is required.";
    }
    if (!formData.certificateOfGoodConductDoc || _.trim(formData.certificateOfGoodConductDoc) === "") {
      newErrors.certificateOfGoodConductDoc = "Certificate Of Good Conduct Document is required.";
    }
    if (showField) {
      if (!formData.department || _.trim(formData.department) === "") {
        newErrors.department = USER_ERROR.DEPARTMENT;
      }
      if (!formData.rankOrGrade || _.trim(formData.rankOrGrade) === "") {
        newErrors.rankOrGrade = USER_ERROR.RANK;
      }
    }
    if (_.isEmpty(formData.dpEmploymentStatus)) {
      newErrors.dpEmploymentStatus = USER_ERROR.EMPLOYMENT_STATUS;
    }
    if (formData.dpEmploymentStatus !== "Permanent Contract") {
      const dateErrors = NewValidateDates(
        formData.contractStartDate,
        10,
        10,
        formData.contractEndDate,
        "Contract Start Date",
        "Contract End Date"
      );

      Object.assign(newErrors, dateErrors);
    }
    const certificateOfGoodConductDateErrors = validateNewSingleDates(formData.certificateOfGoodConduct, 10, "Certificate Of Good Conduct", true, "certificateOfGoodConduct", 10);
    const acknowledgementDateErrors = validateNewSingleDates(formData.acknowledgementDate, 10, "Acknowledgement Date", true, "acknowledgementDate", 10);
    const pledgeDateErrors = validateNewSingleDates(formData.pledgeDate, 10, "Pledge date", true, "pledgeDate", 10);
    Object.assign(newErrors, acknowledgementDateErrors, pledgeDateErrors, certificateOfGoodConductDateErrors);
    const fieldsToValidate = [
      "currentEmployer",
      "currentJobPosition",
      "currentJobLocation",
      "source"
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
