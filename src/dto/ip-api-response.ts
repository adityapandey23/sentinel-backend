type IpApiSuccess = {
  status: "success";
  countryCode: string;
  region: string;
  city: string;
  lat: number;
  lon: number;
  timezone: string;
  offset: number;
};

type IpApiFail = {
  status: "fail";
  message: string;
};

export type IpApiResponse = IpApiSuccess | IpApiFail;

/*

This is the url to hit to get the details
  http://ip-api.com/json/{ip_address}?fields=status,message,countrycode,region,city,lat,lon,timezone,offset

This is how the response would look like
  {
    "status": "success",
    "countryCode": "CA",
    "region": "QC",
    "city": "Montreal",
    "lat": 45.6085,
    "lon": -73.5493,
    "timezone": "America/Toronto",
    "offset": -18000
  }

*/
