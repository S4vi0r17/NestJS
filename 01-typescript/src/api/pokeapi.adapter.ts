import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

// Interfaz mejorada
export interface HttpAdapter {
    get<T>(url: string, config?: any): Promise<T>;
    post<T>(url: string, data: any, config?: any): Promise<T>;
    patch<T>(url: string, data: any, config?: any): Promise<T>;
    delete<T>(url: string, config?: any): Promise<T>;
}

// Adapter usando fetch
export class PokeapiFetchAdapter implements HttpAdapter {
    async get<T>(url: string, config?: RequestInit): Promise<T> {
        try {
            const resp = await fetch(url, { ...config, method: 'GET' });
            if (!resp.ok) throw new Error(`Fetch GET error: ${resp.status}`);
            const data: T = await resp.json();
            console.log('con fetch');
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async post<T>(url: string, data: any, config?: RequestInit): Promise<T> {
        try {
            const resp = await fetch(url, {
                ...config,
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...(config?.headers || {}) },
                body: JSON.stringify(data),
            });
            if (!resp.ok) throw new Error(`Fetch POST error: ${resp.status}`);
            return await resp.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async patch<T>(url: string, data: any, config?: RequestInit): Promise<T> {
        try {
            const resp = await fetch(url, {
                ...config,
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', ...(config?.headers || {}) },
                body: JSON.stringify(data),
            });
            if (!resp.ok) throw new Error(`Fetch PATCH error: ${resp.status}`);
            return await resp.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async delete<T>(url: string, config?: RequestInit): Promise<T> {
        try {
            const resp = await fetch(url, { ...config, method: 'DELETE' });
            if (!resp.ok) throw new Error(`Fetch DELETE error: ${resp.status}`);
            return await resp.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

// Adapter usando axios
export class PokeapiAdapter implements HttpAdapter {
    private readonly axios: AxiosInstance;

    constructor(config?: AxiosRequestConfig) {
        this.axios = axios.create(config);
    }

    async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        try {
            const { data } = await this.axios.get<T>(url, config);
            console.log('con axios');
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async post<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<T> {
        try {
            const resp = await this.axios.post<T>(url, data, config);
            return resp.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async patch<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<T> {
        try {
            const resp = await this.axios.patch<T>(url, data, config);
            return resp.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        try {
            const resp = await this.axios.delete<T>(url, config);
            return resp.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}
