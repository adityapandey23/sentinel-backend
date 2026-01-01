import type { IpApiResponse } from "@/dto/ip-api-response";

export interface IpService {
  getDetails(ip: string): Promise<IpApiResponse | undefined> 
}