// Utility functions for local storage, session storage, cookies, and input handling

import moment from "moment";
import _ from "lodash";
import {
  EventItem,
  SectionMapping,
  Sport,
  EventType,
} from "@/interfaces/AppInterfaces";
import {
  checkIsAfter,
  checkIsBefore,
  checkIsBeforeOrEqual,
  convertDateStringStrict,
  dateAddDays,
  getDateObject,
} from "./datetime";
import { SESSION } from "./constants";

// Local Storage Functions
export const setLocalStorage = (key: string, varToSet: string): void => {
  const encoded = window.btoa(unescape(encodeURIComponent(varToSet)));
  localStorage.setItem(key, encoded);
};

export const removeLocalStorage = (key: string) => localStorage.removeItem(key);

export const getLocalStorage = (key: string): string | false => {
  if (typeof window !== "undefined" && window.localStorage) {
    const getStorage = localStorage.getItem(key);
    try {
      // Decode the Base64 string and then decode the URI component
      return getStorage
        ? decodeURIComponent(escape(window.atob(getStorage)))
        : false;
    } catch (e) {
      return false;
    }
  } else {
    return false;
  }
};

export const safeJSONParse = (data: string | null | undefined) => {
  try {
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("JSON parse error:", error);
    return null;
  }
};

// Function to unset a specific item from local storage
export const unsetLocalStorage = (key: string) => {
  localStorage.removeItem(key);
};

// Session Storage Functions
export const setSessionStorage = (key: string, varToSet: string): void => {
  sessionStorage.setItem(key, window.btoa(varToSet));
};

export const getSessionStorage = (key: string): string | false => {
  const getStorage = sessionStorage.getItem(key);
  try {
    return getStorage ? window.atob(getStorage) : false;
  } catch (error) {
    return false;
  }
};

export const unsetSessionStorage = (): void => {
  sessionStorage.clear();
};

// Cookie Functions
export const setCookie = (name: string, value: string, days: number): void => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; expires=${expires}; path=/`;
};

export const getCookie = (name: string): string | null => {
  const cookieArray = document.cookie.split("; ");
  return cookieArray.reduce<string | null>((r, c) => {
    const [key, val] = c.split("=");
    return key === name ? decodeURIComponent(val) : r;
  }, null);
};

export const deleteCookie = (name: string): void => {
  setCookie(name, "", -1);
};

// Input Handling Functions
export const handleTrimWhiteSpace = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  name: string,
  setValue: (name: string, value: string) => void
): void => {
  const { value } = e.target;
  if (value && value.length > 1) {
    const getData = value.replace(/ +/g, " ");
    setValue(name, getData.trim());
  } else {
    setValue(name, "");
  }
};

export const handleSetError = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  name: string,
  setError: (name: string, error: { type: string; message: string }) => void,
  pattern: RegExp,
  message: string
): void => {
  const { value } = e.target;
  if (value.length > 2 && !pattern.test(value)) {
    setError(name, { type: "custom", message: message });
  }
};

export function formatDate(dateString: string) {
  // Check if the date is valid with the default parsing
  if (moment(dateString).isValid()) {
    return moment(dateString).format("DD/MM/YYYY");
  }

  // If not valid, try parsing with 'DD/MM/YYYY' format and reformat
  if (moment(dateString, "DD/MM/YYYY").isValid()) {
    return moment(dateString, "DD/MM/YYYY").format("DD/MM/YYYY");
  }

  // Return an empty string or custom message if date is not valid
  return "Invalid date";
}

export function reformatDate(dateString: string) {
  const formattedDate = moment(dateString, "DD/MM/YYYY").format(
    "dddd, DD MMMM YYYY"
  );
  return formattedDate;
}

export function formatDateTime(dateString: string) {
  // Check if the date is valid with the default parsing
  if (moment(dateString).isValid()) {
    return moment(dateString).format("DD/MM/YYYY hh:mm:ss a");
  }

  // If not valid, try parsing with 'DD/MM/YYYY hh:mm:ss a' format and reformat
  if (moment(dateString, "DD/MM/YYYY hh:mm:ss a").isValid()) {
    return moment(dateString, "DD/MM/YYYY hh:mm:ss a").format(
      "DD/MM/YYYY hh:mm:ss a"
    );
  }

  // Return an empty string or custom message if date is not valid
  return "Invalid date";
}

export function formatTime(dateString: string): string {
  // Check if the date is valid with the default parsing
  if (moment(dateString).isValid()) {
    return moment(dateString).format("hh:mm");
  }

  // If not valid, try parsing with 'DD/MM/YYYY hh:mm:ss a' format and reformat
  if (moment(dateString, "DD/MM/YYYY hh:mm:ss a").isValid()) {
    return moment(dateString, "DD/MM/YYYY hh:mm:ss a").format("hh:mm");
  }

  // Return an empty string or custom message if date is not valid
  return "Invalid date";
}

export function isValidField<T extends Record<string, any>>(
  data: T | null | undefined,
  fieldName: keyof T
): boolean {
  return !!(
    data &&
    data[fieldName] !== "" &&
    data[fieldName] !== "-" &&
    data[fieldName]
  );
}

export const filterBySearchTerm = (
  data: any[],
  searchTerm: string,
  keys: string[]
) => {
  return _.filter(data, (item) =>
    _.some(keys, (key) =>
      _.includes(_.toLower(item[key]), _.toLower(searchTerm))
    )
  );
};

export const filterBySearch = (
  data: any[],
  searchTerm: string,
  keys: string[]
) => {
  if (!searchTerm.trim()) return data;
  const normalizedSearchTerm = _.toLower(searchTerm).trim();
  const searchWords = normalizedSearchTerm.split(/\s+/);
  return _.filter(data, (item) => {
    const combinedFields = keys
      .map((key) => String(item[key] || "").toLowerCase())
      .join(" ");
    return searchWords.every((word) => _.includes(combinedFields, word));
  });
};

export const filterBySearchGnT = (data: any[], searchTerm: string) => {
  return _.filter(data, (item) => {
    return (
      _.includes(
        _.toLower(
          `${item["athleteFirstName"]} ${item["athleteMiddleName"]} ${item["athleteSurName"]}`
        ),
        _.toLower(searchTerm)
      ) ||
      _.includes(_.toLower(item["goalName"]), _.toLower(searchTerm)) ||
      _.includes(_.toLower(item["status"]), _.toLower(searchTerm)) ||
      _.includes(_.toLower(item["foodName"]), _.toLower(searchTerm)) ||
      _.includes(
        _.toLower(`${item["goalType"]} ${item["sportName"]}`),
        _.toLower(`team ${searchTerm}`)
      )
    );
  });
};

export function capitalizeFirstLetter(str: any) {
  if (!str) return str; // Handle empty strings
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatDates(inputDate: any) {
  if (moment(inputDate, moment.ISO_8601, true).isValid()) {
    return moment(inputDate).format("DD/MM/YYYY");
  } else if (moment(inputDate, "DD/MM/YYYY", true).isValid()) {
    return moment(inputDate, "DD/MM/YYYY").format("DD/MM/YYYY");
  } else {
    return null;
  }
}

export const trimFormData = (data: any) => {
  return Object.keys(data).reduce((acc: any, key: any) => {
    // Only trim if the value is a string
    acc[key] = typeof data[key] === "string" ? data[key].trim() : data[key];
    return acc;
  }, {});
};
export const validateString = (str: string) => {
  return str !== "" && str !== "-" && str !== " " ? str : "";
};

export const getHeroImage = (data: any) => {
  if (data && data.attachmentList && data.attachmentList.length) {
    const heroImageData = data.attachmentList.find(
      (item: any) =>
        item.documentSection &&
        item.documentSection.toLowerCase() === "profilefullimage"
    );
    if (heroImageData && heroImageData.filePath) {
      return heroImageData.filePath;
    }
  }
  return "";
};

export const dateSorting = (data: any) => {
  const sortedData =
    data &&
    [...data].sort((a, b) => {
      const parseDate = (dateString: any) => {
        const [day, month, year] = dateString.split("/").map(Number);
        return new Date(year, month - 1, day);
      };
      const dateA: any = parseDate(a.milestoneStartDate);
      const dateB: any = parseDate(b.milestoneEndDate);
      return dateA - dateB;
    });
  return sortedData;
};

export const dataCalendarSorting = (data: any) => {
  const sortedData =
    data &&
    data.sort(
      (a: any, b: any) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  return sortedData;
};

export const groupByData = (arr: any[], key: string) => {
  const desiredOrder = [
    "Supervisor",
    "Team Manager",
    "Head Coach",
    "Strength And Conditioning Coach",
    "Assistant Coach",
    "Admin Staff",
    "Other Staff",
    "Nutritionist",
    "Volunteer",
    "Athlete",
  ];
  const grouped = arr.reduce((result: Record<string, any[]>, item: any) => {
    const groupKey = item[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);

    // Sort each group by roleOrder
    result[groupKey].sort((a, b) => a.roleOrder - b.roleOrder);
    return result;
  }, {});
  const sortedGrouped: Record<string, any[]> = {};
  // desiredOrder.forEach((group) => {
  //   if (grouped[group]) {
  //     sortedGrouped[group] = grouped[group];
  //   }
  // });
  // Object.keys(grouped).forEach((group) => {
  //   if (!sortedGrouped[group]) {
  //     sortedGrouped[group] = grouped[group];
  //   }
  // });
  return grouped;
};

const getCalenderEventBGColor = (title: string) => {
  switch (title) {
    case "tournamentList":
      return "#A60A3D";
    case "meetingList":
      return "#008755";
    case "trainingList":
      return "#F1EB9C";
    case "eventList":
      return "#00426A";
    case "reminderList":
      return "#00C7B1";
  }
  return "#F1EB9C";
};

const getCalenderEventTextColor = (title: string) => {
  switch (title) {
    case "tournamentList":
      return "#FFFFFF";
    case "meetingList":
      return "#FFFFFF";
    case "trainingList":
      return "#000000";
    case "eventList":
      return "#FFFFFF";
    case "reminderList":
      return "#000000";
  }
  return "#FFFFFF";
};

export const transformCalendarData = (
  data: any,
  selectdCalenderItems: string[],
  searchText: string
): EventItem[] => {
  const sectionMapping: SectionMapping = {};
  if (selectdCalenderItems.includes("tournaments")) {
    sectionMapping["tournamentList"] = {
      titleKey: "tournamentName",
      startDateKey: "trainingStartDate",
      endDateKey: "trainingEndDate",
      idKey: "tournamentID",
    };
  }
  if (selectdCalenderItems.includes("trainings")) {
    sectionMapping["trainingList"] = {
      titleKey: "trainingPlan",
      startDateKey: "trainingStartDate",
      endDateKey: "trainingEndDate",
      idKey: "trainingID",
    };
  }
  if (selectdCalenderItems.includes("events")) {
    sectionMapping["eventList"] = {
      titleKey: "eventName",
      startDateKey: "eventStartDate",
      endDateKey: "eventEndDate",
      idKey: "eventID",
    };
  }
  if (selectdCalenderItems.includes("reminders")) {
    sectionMapping["reminderList"] = {
      titleKey: "reminderName",
      startDateKey: "date",
      endDateKey: "date",
      idKey: "reminderID",
    };
  }
  if (selectdCalenderItems.includes("meetings")) {
    sectionMapping["meetingList"] = {
      titleKey: "meetingSubject",
      startDateKey: "date",
      endDateKey: "date",
      idKey: "meetingID",
    };
  }

  const transformed: EventItem[] = [];

  data.forEach((sectionData: any) => {
    Object.entries(sectionData).forEach(([sectionName, items]) => {
      if (Array.isArray(items) && sectionMapping[sectionName]) {
        const { titleKey, startDateKey, endDateKey, idKey } =
          sectionMapping[sectionName];
        items.forEach((item) => {
          if (
            checkIsAfter(item[startDateKey], item[endDateKey], "DD/MM/YYYY")
          ) {
            let startDate = getDateObject(item[startDateKey], "DD/MM/YYYY");
            let endDate = getDateObject(item[endDateKey], "DD/MM/YYYY");
            for (
              let date = startDate;
              checkIsBeforeOrEqual(date, endDate);
              date = dateAddDays(date, 1)
            ) {
              transformed.push({
                sportID: item.sportID,
                title: item[titleKey],
                start: date.format("YYYY-MM-DD"),
                end: date.format("YYYY-MM-DD"),
                display: "block",
                section: sectionName.replace(/List/g, ""),
                backgroundColor: getCalenderEventBGColor(sectionName),
                textColor: getCalenderEventTextColor(sectionName),
                className: "long-event-style",
                [idKey]: item[idKey],
              });
            }
          } else {
            transformed.push({
              sportID: item.sportID,
              title: item[titleKey],
              start: convertDateStringStrict(
                item[startDateKey],
                "DD/MM/YYYY",
                "YYYY-MM-DD"
              ),
              end: convertDateStringStrict(
                item[endDateKey],
                "DD/MM/YYYY",
                "YYYY-MM-DD"
              ),
              display: "block",
              section: sectionName.replace(/List/g, ""),
              backgroundColor: getCalenderEventBGColor(sectionName),
              textColor: getCalenderEventTextColor(sectionName),
              className: "long-event-style",
              [idKey]: item[idKey],
            });
          }
        });
      }
    });
  });

  if (searchText) {
    return transformed.filter(
      (item) =>
        item &&
        item.title &&
        item.title.toLowerCase().includes(searchText.toLowerCase())
    );
  }

  return transformed;
};

export const tranformProgramCalendarData = (data: any[]): EventItem[] => {
  const transformed: EventItem[] = [];
  data.forEach((item) => {
    let startDate = getDateObject(item.startDate, "DD/MM/YYYY");
    let endDate = getDateObject(item.endDate, "DD/MM/YYYY");
    for (
      let date = startDate;
      checkIsBeforeOrEqual(date, endDate);
      date = dateAddDays(date, 1)
    ) {
      transformed.push({
        programID: item.programID,
        title: `${moment(item.startTime, "hh:mm A").format("hh:mm")} ${
          item.programName
        }`,
        start: date.format("YYYY-MM-DD"),
        end: date.format("YYYY-MM-DD"),
        display: "block",
        backgroundColor: "#F1EB9C",
        textColor: "#000000",
        section: "program",
        className: "long-event-style",
        ["idKey"]: "programID",
      });
    }
  });
  return transformed;
};

export const tranformFacilitiesCalendarData = (data: any[]): EventItem[] => {
  if (!data) return [];
  if (data && data.length < 1) return [];
  const transformed: EventItem[] = [];
  data.forEach((item) => {
    let startDate = getDateObject(
      `${item.facilityDate} ${item.startTime}`,
      "DD/MM/YYYY hh:mm A"
    );
    let endDate = getDateObject(
      `${item.facilityDate} ${item.endTime}`,
      "DD/MM/YYYY hh:mm A"
    );

    transformed.push({
      facilityID: item.facilityID,
      title: `${item.facilityTypeText}`,
      start: startDate.format("YYYY-MM-DDTHH:mm:ss"),
      end: endDate.format("YYYY-MM-DDTHH:mm:ss"),
      display: "block",
      backgroundColor: "#F1EB9C",
      textColor: "#000000",
      section: "facilities",
      status: item.status,
      className: "long-event-style",
    });
  });
  return transformed;
};

export function getSportIDByName(
  sportsArray: Sport[],
  sportName: string
): number | null {
  const sport = sportsArray.find((s) => s.sportName === sportName);

  return sport ? sport.sportID : null; // Return null if not found
}

export const RenderEditorContentHtml = (content: any) => {
  const stripHtmlTags = (html: any) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };

  return stripHtmlTags(content);
};

export function generateEventID(eventType: EventType): string {
  switch (eventType) {
    case "event":
      return "eventID";
    case "meeting":
      return "meetingID";
    case "reminder":
      return "reminderID";
    case "tournament":
      return "tournamentID";
    case "training":
      return "trainingID";
    default:
      return "unknownID";
  }
}

export async function convertToBinaryFile(url: any) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const urlParts = url.split("/");
    const fileName = urlParts[urlParts.length - 1] || "default_file_name.jpg";
    const blob = await response.blob();
    const file = new File([blob], fileName, { type: blob.type });
    return file;
  } catch (error) {
    console.error("Error fetching and converting image:", error);
  }
}

export const getDefaultOptions = (
  List: any[],
  labelKey: string,
  valueKey: string
) => {
  const defaultOptions = [];
  for (const item of List) {
    defaultOptions.push({
      label: item[labelKey],
      value: item[valueKey],
    });
  }

  return defaultOptions;
};

export const validateDates = (
  startDate: string,
  maxYears: number,
  endDate: string,
  errorFirstName: string,
  errorSecondName: string
) => {
  let validationErrors: Record<string, string> = {};
  const maxAllowedDate = moment().add(maxYears, "years").endOf("day");
  if (_.isEmpty(startDate)) {
    validationErrors.startDate = `${errorFirstName} is required`;
  } else if (!moment(startDate, "DD/MM/YYYY", true).isValid()) {
    validationErrors.startDate = `${errorFirstName} has an invalid date format.`;
  } else if (moment(startDate, "DD/MM/YYYY").isAfter(maxAllowedDate)) {
    validationErrors.startDate = `${errorFirstName} cannot be more than ${maxYears} years from today.`;
  }

  if (_.isEmpty(endDate)) {
    validationErrors.endDate = `${errorSecondName} is required`;
  } else if (!moment(endDate, "DD/MM/YYYY", true).isValid()) {
    validationErrors.endDate = `${errorSecondName} has an invalid date format.`;
  } else if (
    moment(endDate, "DD/MM/YYYY").isBefore(moment(startDate, "DD/MM/YYYY"))
  ) {
    validationErrors.endDate = `${errorSecondName} cannot be earlier than ${errorFirstName}.`;
  } else if (moment(endDate, "DD/MM/YYYY").isAfter(maxAllowedDate)) {
    validationErrors.endDate = `${errorSecondName} cannot be more than ${maxYears} years from today.`;
  }

  return validationErrors;
};

export const validateSingleDates = (
  date: string,
  maxYears: number,
  errorName: string,
  required: boolean,
  dateName: string
) => {
  let validationErrors: Record<string, string> = {};
  const today = moment().startOf("day");
  const maxAllowedDate = moment().add(maxYears, "years").endOf("day");
  if (required && _.isEmpty(date)) {
    validationErrors[dateName] = `${errorName} is required`;
  } else if (!_.isEmpty(date)) {
    if (!moment(date, "DD/MM/YYYY", true).isValid()) {
      validationErrors[dateName] = `${errorName} has an invalid date format.`;
    } else if (moment(date, "DD/MM/YYYY").isBefore(today)) {
      validationErrors[dateName] = `${errorName} cannot be in the past.`;
    } else if (moment(date, "DD/MM/YYYY").isAfter(maxAllowedDate)) {
      validationErrors[
        dateName
      ] = `${errorName} cannot be more than ${maxYears} years from today.`;
    }
  }
  return validationErrors;
};

// search and fiter logic for Team Requirements
export const filterRecordsBySearchTextTeamReq = (
  list: any[],
  searchTerm: string,
  keys: string[],
  statuslist: any[]
) => {
  let filteredList: any = list;

  if (searchTerm) {
    const lowerSearchTerm = searchTerm.trim().toLowerCase();

    filteredList = list?.filter((item) => {
      return keys.some((key) => {
        const value = item[key]?.toString().trim().toLowerCase() || "";
        return value.includes(lowerSearchTerm);
      });
    });
  }

  if (statuslist && statuslist.length && filteredList && filteredList.length) {
    filteredList = filteredList.filter((item: any) =>
      statuslist.includes(item?.shipmentStatus)
    );
  }

  return filteredList;
};

export const formatDay = (dateString: any) => {
  const inputDate = moment(dateString, "DD/MM/YYYY");
  if (!inputDate.isValid()) {
    return "Invalid Date";
  }
  const today = moment();
  const yesterday = moment().subtract(1, "days");

  if (inputDate.isSame(today, "day")) {
    return "Today";
  } else if (inputDate.isSame(yesterday, "day")) {
    return "Yesterday";
  } else {
    return inputDate.format("DD/MM/YYYY");
  }
};

export const getTestName = (testType: string) => {
  if (testType === "militaryReadiness") return "Military Readiness Test";
  if (testType === "performance") return "Performance Test";
  if (testType === "field") return "Field Test";
  if (testType === "medical") return "Medical Test";
  return "Unknown Test";
};

export const validateDateOfBirth = (
  date: string,
  minAge: number,
  maxAge: number,
  errorName: string,
  required: boolean,
  dateName: string
) => {
  let validationErrors: Record<string, string> = {};
  const today = moment().startOf("day");
  const minBirthDate = moment().subtract(minAge, "years").startOf("day");
  const maxBirthDate = moment().subtract(maxAge, "years").endOf("day");
  if (required && _.isEmpty(date)) {
    validationErrors[dateName] = `${errorName} is required`;
  } else if (!_.isEmpty(date)) {
    if (!moment(date, "DD/MM/YYYY", true).isValid()) {
      validationErrors[dateName] = `${errorName} has an invalid date format.`;
    } else if (moment(date, "DD/MM/YYYY").isAfter(today)) {
      validationErrors[dateName] = `${errorName} cannot be in the future.`;
    } else if (moment(date, "DD/MM/YYYY").isAfter(minBirthDate)) {
      validationErrors[
        dateName
      ] = `${errorName} must be at least ${minAge} years old.`;
    } else if (moment(date, "DD/MM/YYYY").isBefore(maxBirthDate)) {
      validationErrors[
        dateName
      ] = `${errorName} must be less than ${maxAge} years old.`;
    }
  }

  return validationErrors;
};

export const filterRecordsBySearchText = (
  list: any[],
  searchTerm: string,
  keys: string[]
) => {
  if (!searchTerm) return list;
  const lowerSearchTerm = searchTerm.toLowerCase();

  return list.filter((item) =>
    keys.some((key) =>
      item[key]?.toString().toLowerCase().includes(lowerSearchTerm)
    )
  );
};

export const validateNewSingleDates = (
  date: string,
  maxFutureYears: number,
  errorName: string,
  required: boolean,
  dateName: string,
  minPastYears: number
) => {
  let validationErrors: Record<string, string> = {};
  const today = moment().startOf("day");
  const maxAllowedFutureDate = moment()
    .add(maxFutureYears, "years")
    .endOf("day");
  const minAllowedPastDate = moment()
    .subtract(minPastYears, "years")
    .startOf("day");
  const formattedMinDate = minAllowedPastDate.format("DD/MM/YYYY");
  const formattedMaxDate = maxAllowedFutureDate.format("DD/MM/YYYY");
  if (required && _.isEmpty(date)) {
    validationErrors[dateName] = `${errorName} is required.`;
  } else if (!_.isEmpty(date)) {
    if (!moment(date, "DD/MM/YYYY", true).isValid()) {
      validationErrors[
        dateName
      ] = `${errorName} has an invalid date format. Use DD/MM/YYYY.`;
    } else {
      const parsedDate = moment(date, "DD/MM/YYYY");
      if (parsedDate.isBefore(minAllowedPastDate)) {
        validationErrors[
          dateName
        ] = `${errorName} cannot be earlier than ${formattedMinDate}.`;
      }
      if (parsedDate.isAfter(maxAllowedFutureDate)) {
        validationErrors[
          dateName
        ] = `${errorName} cannot be later than ${formattedMaxDate}.`;
      }
    }
  }

  return validationErrors;
};

export const NewValidateDates = (
  contractStartDate: string,
  maxPastYears: number, // How far back the contractStartDate can be
  maxFutureYears: number, // How far forward the contractEndDate can be
  contractEndDate: string,
  errorFirstName: string, // Contract Start Date
  errorSecondName: string // Contract End Date
) => {
  let validationErrors: Record<string, string> = {};

  const today = moment().startOf("day");

  const minAllowedStartDate = moment()
    .subtract(maxPastYears, "years")
    .startOf("day"); // can't be older than this
  const maxAllowedEndDate = moment().add(maxFutureYears, "years").endOf("day"); // can't be later than this

  const formattedMinAllowedStartDate = minAllowedStartDate.format("DD/MM/YYYY");
  const formattedMaxAllowedEndDate = maxAllowedEndDate.format("DD/MM/YYYY");

  const parsedStartDate = moment(contractStartDate, "DD/MM/YYYY", true);
  const parsedEndDate = moment(contractEndDate, "DD/MM/YYYY", true);

  // ---- Validate Contract Start Date ----
  if (!contractStartDate) {
    validationErrors.contractStartDate = `${errorFirstName} is required.`;
  } else if (!parsedStartDate.isValid()) {
    validationErrors.contractStartDate = `${errorFirstName} has an invalid date format.`;
  } else if (parsedStartDate.isBefore(minAllowedStartDate)) {
    validationErrors.contractStartDate = `${errorFirstName} cannot be before ${formattedMinAllowedStartDate}.`;
  }
  // else if (parsedStartDate.isAfter(today)) {
  //   validationErrors.contractStartDate = `${errorFirstName} cannot be in the future.`; // Optional
  // }

  // ---- Validate Contract End Date ----
  if (!contractEndDate) {
    validationErrors.contractEndDate = `${errorSecondName} is required.`;
  } else if (!parsedEndDate.isValid()) {
    validationErrors.contractEndDate = `${errorSecondName} has an invalid date format.`;
  } else if (parsedEndDate.isBefore(parsedStartDate)) {
    validationErrors.contractEndDate = `${errorSecondName} cannot be before ${errorFirstName}.`;
  } else if (parsedEndDate.isAfter(maxAllowedEndDate)) {
    validationErrors.contractEndDate = `${errorSecondName} cannot be after ${formattedMaxAllowedEndDate}.`;
  }

  return validationErrors;
};

export const createUserPayload = (
  employeeData: any,
  role: any,
  enteredBy: any,
  userType: any,
  moduleName: any,
  moduleId: any,
  sportID: any
) => ({
  ntLogIn: employeeData.ntLoginName,
  firstName: employeeData.firstName,
  middleName: employeeData.middleName,
  lastName: employeeData.lastName,
  displayName: employeeData.fullNameE,
  email: employeeData.empEmail,
  employeeNumber: employeeData.employeeNo,
  gender: employeeData.gender,
  dob: employeeData.dob,
  nationality: employeeData.nationalityCode,
  role: role,
  userType: userType || "Employee",
  password: "",
  enteredBy: enteredBy || "1",
  moduleName: moduleName,
  moduleID: moduleId,
  sportID: sportID,
});

export const getTokenData = () => {
  const tokenData = getLocalStorage(SESSION.TOKEN);
  return tokenData ? JSON.parse(tokenData) : null;
};

export const formatCount = (count: number): string => {
  if (count >= 1_000_000)
    return `${(count / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (count >= 1_000)
    return `${(count / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return count.toString();
};

export function getUsernameFromEmail(email: string): string {
  return email.split("@")[0];
}
