export interface PostHogEvent {
  api_key: string;
  event: string;
  properties: {
    distinct_id: string;
    [key: string]: any;
  };
  timestamp?: string;
}
