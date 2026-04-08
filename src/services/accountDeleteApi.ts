import { urls } from "../Environment";
import { API } from "./api";

export const deleteAccountApi = async () => {
  return API.put(
    urls.deleteAcoountUrl,
    {},
    {
      validateStatus: () => true,
    }
  );
};