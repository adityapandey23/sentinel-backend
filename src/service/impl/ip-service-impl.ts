import type { IpApiResponse } from "@/dto/ip-api-response";
import type { IpService } from "../ip-service.interface";
import axios from 'axios'
import { injectable } from "inversify";


@injectable()
export class IpServiceImpl implements IpService {

  async getDetails(ip: string): Promise<IpApiResponse | undefined> {
    try {
      const response = await axios.get(`http://ip-api.com/json/${ip}?fields=status,message,countrycode,region,city,lat,lon,timezone,offset`);
      const data = <IpApiResponse>response.data;
      return data;
    } catch(error) {
      console.error('error:', error); // Should be replaced with a more robust logging system, but I'll let it slide for now
      return undefined;
    }
  }
}