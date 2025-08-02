import { SESSION } from "./constants";
import { getLocalStorage, safeJSONParse } from "./helper";

export const checkIsAdmin = () => {
  const tokenData: any = getLocalStorage(SESSION.TOKEN);
  const parsedTokenData = safeJSONParse(tokenData);

  // if logged user is admin he has all the access
  if (
    parsedTokenData &&
    parsedTokenData.isAdmin &&
    parsedTokenData.isAdmin == 1
  )
    return true;

  return false;
};

export const checkAccess = (moduleID: number) => {
  const tokenData: any = getLocalStorage(SESSION.TOKEN);
  const parsedTokenData = safeJSONParse(tokenData);
  // if logged user is admin he has all the access
  if (
    parsedTokenData &&
    parsedTokenData.isAdmin &&
    parsedTokenData.isAdmin == 1
  )
    return true;

  const accessData: any = getLocalStorage(SESSION.ACCESS_MATRIX);
  if (accessData) {
    const parsedAccessData = safeJSONParse(accessData);
    if (parsedAccessData) {
      const module: any = parsedAccessData.find(
        (item: any) => item.moduleID === moduleID
      );
      if (module && module.accessable === 1) {
        // 1 means module item accessable
        return true;
      }
    }
  }
  return false; //CHECk change to false once implemnted for all modules
};

export const checkUserEditAccess = (createdBy: number) => {
  const tokenData: any = getLocalStorage(SESSION.TOKEN);
  const parsedTokenData = safeJSONParse(tokenData);
  // if (
  //   parsedTokenData &&
  //   parsedTokenData.isAdmin &&
  //   parsedTokenData.isAdmin == 1
  // )
  //   return true;

  if (parsedTokenData && parsedTokenData?.userID === createdBy) {
    return true;
  }

  // if (parsedTokenData &&
  //   parsedTokenData?.role &&
  //   parsedTokenData?.roleValue === "team_supervisor") {
  //   return true;
  // }

  return false;
};

export const checkUserApproveRejectAccess = () => {
  const tokenData: any = getLocalStorage(SESSION.TOKEN);
  const parsedTokenData = safeJSONParse(tokenData);
  // if (
  //   parsedTokenData &&
  //   parsedTokenData.isAdmin &&
  //   parsedTokenData.isAdmin == 1
  // )
  //   return true;

  return parsedTokenData?.roleValue === "team_supervisor";
};
