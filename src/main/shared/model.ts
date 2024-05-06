export interface IResponses {
  ID: number;
  completionTime?: string;
  startTime?: string;
  email: string;
  feedback: string;
  name: string;
  rating: number;
  whom: string;
  category: string;
}

export interface IResponsesResult {
  ID: number;
  whom: string;
  rating: number;
  feedback: {givenBy: string, feedback: string, category: string};
}

export interface IResponsesFinalResult {
  ID: number;
  whom: string;
  rating: number;
  feedback: {givenBy: string, feedback: string, category: string}[];
}

export interface IResponsesOtherCases {
  ID: number;
  name: string;
  ratingCount: number;
}
