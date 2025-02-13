import axios from "axios";
import { useCallback, useEffect } from "react";
import { URL } from "../../src/utils/socket";

interface IUserData {
  userName: string;
  avatar: string;
  _id: string;
}

export function useSetUserData(userData: IUserData) {
  const setUserData = useCallback(async () => {
    try {
      const { data } = await axios.post<IUserData, { data: IUserData }>(
        `${URL}/user`,
        userData
      );

      if (data) {
        localStorage.setItem("user", JSON.stringify(data));
      }
    } catch (error) {
      console.log(error);
    }
  }, [userData]);

  useEffect(() => {
    setUserData();
  }, []);
}
