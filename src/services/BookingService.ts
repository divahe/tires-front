import type { BookingRequest, BookingListResponse, BookingResponse } from '@/model/index';
import axios, { type AxiosResponse } from 'axios';

export default class BookingService {
  private API_URL = 'http://localhost:8080/api/v1/';
  private LIST_DATA_URL = 'bookings';
  private BOOKING_DATA_URL = 'booking/book';
  private headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  private handleErrorResponse(error: any): {
    status: number;
    error: string;
    data?: any;
  } {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error(`API Error: ${error.response.status} - ${error.response.statusText}`);
        return {
          status: error.response.status,
          error: `API Error: ${error.response.status} - ${error.response.statusText}`,
          data: error.response.data,
        };
      } else if (error.request) {
        console.error('API Error: No response received');
        return {
          status: 0,
          error: 'No server response',
        };
      } else {
        console.error('API Error: Request setup error');
        return {
          status: 0,
          error: 'Unexpected error',
        };
      }
    }
    console.error('Unexpected error:', error);
    return {
      status: 0,
      error: 'An unexpected error occurred',
    };
  }

  private async handleRequest<T>(request: Promise<AxiosResponse<T>>): Promise<{
    status: number;
    data?: T;
    error?: string;
  }> {
    try {
      const response = await request;
      return {
        status: response.status,
        data: response.data,
      };
    } catch (error: any) {
      return this.handleErrorResponse(error);
    }
  }

  getBookings = async (): Promise<{
    status: number;
    data?: BookingListResponse;
    error?: string;
  }> => {
    return this.handleRequest<BookingListResponse>(
      axios.get(this.API_URL + this.LIST_DATA_URL, {
        headers: this.headers,
      })
    );
  };

  makeBooking = async (
    bookingRequest: BookingRequest
  ): Promise<{
    status: number;
    data?: BookingResponse;
    error?: string;
  }> => {
    return this.handleRequest<BookingResponse>(
      axios.put<BookingResponse>(this.API_URL + this.BOOKING_DATA_URL, bookingRequest, {
        headers: this.headers,
      })
    );
  };
}