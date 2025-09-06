"use server";

import HttpClient from "@/utils/fetch";
import { certificateEndpoints } from "../../constants/api";

const submitFields = async (data: any, id: string) => {
  const http = new HttpClient();
  const res = await http.patch(certificateEndpoints.updateCertificateFields(id), data);
  return res;
};
export default submitFields;
