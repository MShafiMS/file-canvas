import axios, { AxiosInstance } from 'axios';

export class http {
  public static api_url: string = process.env.NEXT_PUBLIC_BASE_URL as string;
  public static api_key: string = process.env.NEXT_PUBLIC_API_KEY as string;

  // Function to create axios instance with base url and content-type header
  private static createAxiosWithUrl = (url: string): AxiosInstance => {
    console.log(`createAxiosWithUrl ${url}, api_url: ${http.api_url}`);
    const axiosInstance = axios.create({
      baseURL: url,
      headers: {
        'Content-Type': 'application/json',
        key: 'your-api-key-here', // Add your API key here
      },
    });
    return axiosInstance;
  };

  // For making requests with the default axios instance
  public static default = http.createAxiosWithUrl(http.api_url);

  // For setting a different base URL
  public static setBaseUrl = (url: string) => {
    http.api_url = url;
    http.default = http.createAxiosWithUrl(url);
  };
}
