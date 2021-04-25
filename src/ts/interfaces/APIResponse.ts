interface APIResponse {
  status: number;
  response?: RequestResponse | string;
  type?: string;
  message?: string;
  holder?: string;
}
