'use server';
import HttpClient from "@/utils/fetch";
import { certificateEndpoints } from "../../constants/api";
import { TCertificateLayoutResponse } from "../types";

export const getCertificateById = async (id: string) => {
    const http = new HttpClient();
    const res = await http.get<TCertificateLayoutResponse>(`${certificateEndpoints.certificateEndPoint(id)}`);
    return res.data;
}