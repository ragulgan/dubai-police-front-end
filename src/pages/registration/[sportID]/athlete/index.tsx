import AthleteStepperForm from "@/pages/teams/[teamID]/athletes/add";
import { handleSubMenu } from "@/redux/slices/appSplice";
import { fetchRoles } from "@/redux/slices/settingSlice/roleSlice/roleSlice";
import { getSportsListAPI } from "@/redux/slices/sportsMenu/getSportsListSlice";
import { AppDispatch } from "@/redux/store";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

const RegistrationAthlete = () => {
   const dispatch: AppDispatch = useDispatch();
    useEffect(() => {
      dispatch(handleSubMenu(true));
      const param: any = {
        moduleName: "athlete",
      };
      const getSportpayload = {
        searchText: "",
      };
      dispatch(getSportsListAPI(getSportpayload));
      dispatch(fetchRoles(param));
    }, []);
  return (
    <div>
      <AthleteStepperForm registration={true} />
    </div>
  );
};

export default RegistrationAthlete;
