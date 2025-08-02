import { REGEX, USER_ERROR } from "@/utils/constants";
import _ from "lodash";
import moment from "moment";

export const CreateContract = (formData: any, setErrors: any) => {
  const validate = () => {
    const newErrors: any = {};
    if (_.isEmpty(formData.personalEmail)) {
      newErrors.personalEmail = USER_ERROR.PERSONAL_EMAIL_REQUIRED;
    } else if (!REGEX.EMAIL.test(formData.personalEmail)) {
      newErrors.personalEmail = USER_ERROR.EMAIL_INVALID;
    }
    if (_.isEmpty(formData.dubaiPoliceEmail)) {
      newErrors.dubaiPoliceEmail = USER_ERROR.GOVERNMENT_EMAIL_REQUIRED;
    } else if (!REGEX.GOVERMENT_EMAIL.test(formData.dubaiPoliceEmail)) {
      newErrors.dubaiPoliceEmail = USER_ERROR.DP_EMAIL_INVALID;
    }
    if (!formData.residence || _.trim(formData.residence) === "") {
      newErrors.residence = USER_ERROR.RESIDENCE_REQUIRED;
    }
    if (!formData.phoneNo || _.trim(formData.phoneNo) === "") {
      newErrors.phoneNo = USER_ERROR.PHONE_NUMBER_REQUIRED;
    } else if (!/^\d+$/.test(formData.phoneNo)) {
      newErrors.phoneNo = USER_ERROR.INVALID_PHONE_NUMBER;
    }

    if (!formData.emergencyContactName || _.trim(formData.emergencyContactName) === "") {
      newErrors.emergencyContactName = USER_ERROR.EMERGENCY_CONTACT_NAME_REQUIRED;
    }
    if (!formData.emergencyContactNumber || _.trim(formData.emergencyContactNumber) === "") {
      newErrors.emergencyContactNumber = USER_ERROR.EMERGENCY_CONTACT_NUMBER_REQUIRED;
    } else if (!/^\d+$/.test(formData.emergencyContactNumber)) {
      newErrors.emergencyContactNumber = USER_ERROR.INVALID_PHONE_NUMBER;
    }
    setErrors(newErrors);
    return newErrors;
  };
  return { validate };
};

export const PersonalFormValidation = (formData: any, setErrors: any) => {
  const dobMoment = moment(formData.dob, "YYYY-MM-DD", true);

  const validate = () => {
    const newErrors: any = {};
    if (!formData.firstName || _.trim(formData.firstName) === "") {
      newErrors.firstName = USER_ERROR.F_NAME;
    }
    if (!formData.surname || _.trim(formData.surname) === "") {
      newErrors.surname = USER_ERROR.L_NAME;
    }
    if (!formData.middleName || _.trim(formData.middleName) === "") {
      newErrors.middleName = USER_ERROR.M_NAME;
    }
    if (!formData.height || _.trim(formData.height) === "") {
      newErrors.height = USER_ERROR.HEIGHT;
    }
    if (!formData.weight || _.trim(formData.weight) === "") {
      newErrors.weight = USER_ERROR.WEIGHT;
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
    if (_.isNil(formData.age) || formData.age === "") {
      newErrors.age = USER_ERROR.AGE;
    }
    if (_.isEmpty(formData.dob)) {
      newErrors.dob = USER_ERROR.DOB;
    }
    else if (dobMoment.isAfter(moment().subtract(18, "years"))) {
      newErrors.dob = USER_ERROR.EIGHTEENYEARSDOB;
    } else if (dobMoment.isBefore(moment().subtract(80, "years"))) {
      newErrors.dob = USER_ERROR.SIXTYYEARS;
    }
    setErrors(newErrors);
    return newErrors;
  };
  return { validate };
};