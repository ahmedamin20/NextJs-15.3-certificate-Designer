"use server";

import HttpClient from "@/utils/fetch";
import { certificateEndpoints } from "../../constants/api";
import appendToFormData from "@/utils/appendToFormData";

const submitImgUpload = async (id: string, data: {
  template: File;
  imgNatural: { w: number; h: number };
}) => {
  const http = new HttpClient();
  const formData = new FormData();
  formData.append('template', data.template);
  formData.append('imgNatural.w', data.imgNatural.w.toString());
  formData.append('imgNatural.h', data.imgNatural.h.toString());

  return http.post(certificateEndpoints.certificateEndPoint(id), formData);
};

export default submitImgUpload;
