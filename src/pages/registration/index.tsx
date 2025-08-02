import SubMenuRegistration from "@/components/subMenuRegistration";
import { handleSubMenu } from "@/redux/slices/appSplice";
import { fetchRoles } from "@/redux/slices/settingSlice/roleSlice/roleSlice";
import { getSportsListAPI } from "@/redux/slices/sportsMenu/getSportsListSlice";
import { AppDispatch } from "@/redux/store";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

const registration = () => {
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(handleSubMenu(true));
    const param: any = {
      moduleName: "staff",
    };
    const getSportpayload = {
      searchText: "",
    };
    dispatch(getSportsListAPI(getSportpayload));
    dispatch(fetchRoles(param));
  }, []);

  return (
    <div>
      <SubMenuRegistration path={"staffs"} customSelect={"Staff"} />
    </div>
  );
};

export default registration;
