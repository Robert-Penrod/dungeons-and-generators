export interface Env {
	FIREBASE_BACKEND_URL: string;
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const backendUrl = new URL(env.FIREBASE_BACKEND_URL);
		const url = new URL(request.url);
		url.hostname = backendUrl.hostname;
		url.protocol = 'https:';
		const proxyRequest = new Request(url.toString(), request);
		return await fetch(proxyRequest);
	},
};
