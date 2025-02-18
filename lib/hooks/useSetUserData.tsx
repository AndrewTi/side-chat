import { useCallback, useEffect } from "react";
import { IUserData } from "../../src/service/types";
import { setUserRequest } from "../../src/service";

export function useSetUserData(userData: IUserData) {
  const setUserData = useCallback(async () => {
    try {
      const { data } = await setUserRequest(userData);

      if (data) {
        localStorage.setItem("user", JSON.stringify(data));
      }
    } catch (error) {
      console.log(error);
    }
  }, [userData]);

  useEffect(() => {
    setUserData();
  }, [setUserData]);
}
