import axios from "axios";

// Create an Axios instance with default settings (can be customized)
export const axiosInstance = axios.create({});

// Function to dynamically handle API requests
export const apiConnector = (method, url, bodyData, headers, params) => {
  return axiosInstance({
    method: `${method}`,              // HTTP method (GET, POST, PUT, DELETE, etc.)
    url: `${url}`,                    // The URL for the API endpoint
    data: bodyData ? bodyData : null, // The body data for POST/PUT requests
    headers: headers ? headers : null,// Custom headers (optional)
    params: params ? params : null,   // URL parameters for GET requests (optional)
  });
};
