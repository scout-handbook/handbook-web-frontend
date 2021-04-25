/* exported APIResponse */

interface APIResponse {
  status: number;
  response?: RequestResponse;
  type?: string;
  message?: string;
  holder?: string;
}
