import { BASE_URL, BASE_URL_KEY, URL_API, URL_API_KEY } from '../constants'
export function getURLApi(): string {
	return localStorage.getItem(URL_API_KEY) || URL_API
}

export function setURLApi(url?: string): void {
	localStorage.setItem(URL_API_KEY, url || URL_API)
}

export function setBaseUrl(url?: string): void {
	localStorage.setItem(BASE_URL_KEY, url || BASE_URL)
}

export function getBaseUrl(): string {
	return localStorage.getItem(BASE_URL_KEY) || BASE_URL
}
