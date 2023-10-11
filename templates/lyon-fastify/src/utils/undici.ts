// ANCHOR Undici
import { request, Dispatcher } from 'undici';

type UndiciOption = { dispatcher?: Dispatcher } & Omit<Dispatcher.RequestOptions, 'origin' | 'path'>;

export function GET(
  uri: string,
  options: Partial<UndiciOption>,
): Promise<Dispatcher.ResponseData> {
  return request(uri, {
    ...options,
    method: 'GET',
  })
}

export function POST(
  uri: string,
  payload: Record<any, any>,
  options: Partial<UndiciOption>,
): Promise<Dispatcher.ResponseData> {
  return request(uri, {
    ...options,
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function PUT(
  uri: string,
  payload: Record<any, any>,
  options: Partial<UndiciOption>,
): Promise<Dispatcher.ResponseData> {
  return request(uri, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function PATCH(
  uri: string,
  payload: Record<any, any>,
  options: Partial<UndiciOption>,
): Promise<Dispatcher.ResponseData> {
  return request(uri, {
    ...options,
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export function DELETE(
  uri: string,
  options: Partial<UndiciOption>,
): Promise<Dispatcher.ResponseData> {
  return request(uri, {
    ...options,
    method: 'DELETE',
  })
}

