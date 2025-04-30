import { HttpService } from '@nestjs/axios';
import { HttpAdapter } from '../interfaces/http-adapter.interface';
import { AxiosRequestConfig } from 'axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AxiosAdapter implements HttpAdapter {
  constructor(private readonly httpService: HttpService) {}

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const { data } = await this.httpService.axiosRef.get<T>(url, config);
      return data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(`Error fetching data from ${url}: ${errorMessage}`);
    }
  }
}
