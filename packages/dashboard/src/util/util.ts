import { Observable, of } from 'rxjs';

export interface RemoteResponse {
    status: "SUCCESS" | "ERROR";
    data?: any
}

type Method = 'GET' | 'POST';

export async function apiCall(
  endpoint: string,
  method: Method,
  params?: Record<string, string>,
  body?: object
): Promise<any> {
  return fetch(`${endpoint}?${new URLSearchParams(params).toString()}`, {
    method: method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then((response) => response.json());
}

export function handleErrors(data: any) {
  if (
    data.errors &&
    data.errors.length &&
    data.errors.length > 0 &&
    data.errors[0].message
  ) {
    throw new Error(data.errors[0].message);
  }
  if (!data.status || data.status !== 'SUCCESS') {
    throw new Error("Response doesn't have a SUCCESS status");
  }
}

/**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
export function handleError<T>(operation = 'operation', result?: T) {
  return (error: any): Observable<T> => {
    console.error(error);
    return of(result as T);
  };
}
