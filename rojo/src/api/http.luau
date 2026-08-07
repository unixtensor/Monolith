--!strict

const HttpService = game:GetService("HttpService")

const Http = {} :: Constructor
Http.__index = Http
Http.Enabled = HttpService.HttpEnabled

export type HttpOptions = {
	log: boolean;
	retries: number;
}
type Constructor = {
	__index: Constructor;
	Enabled: boolean;
	new: (address: string, token: string, options: HttpOptions) -> Http;
	PostAsync: (self: Http, req: string, body: Json?) -> (boolean, HttpResponseData);
	PutAsync: (self: Http, req: string, body: Json?) -> (boolean, HttpResponseData);
	GetAsync: (self: Http, req: string) -> (boolean, HttpResponseData);
	DeleteAsync: (self: Http, req: string, body: Json?) -> (boolean, HttpResponseData)
}
type Self = {
	address: string;
	token: string;
	options: HttpOptions;
}
export type Http = setmetatable<Self, typeof(Http)>

type HttpMethod = "POST" | "PUT" | "GET" | "DELETE"
export type Json = any
export type HttpResponseData = {
    Body: Json,
    Headers: {
        [string]: string
    },
    StatusCode: number,
    StatusMessage: string,
    Success: boolean
}
type RestDetails = {
	method: HttpMethod;
	request: string;
	body: string?;
}

const api_root:  "/api/v1" = "/api/v1"
local http_delay:   number = 0
local http_retries: number = 0

const function request(self: Http, method: HttpMethod, req: string, body: Json?): (boolean, HttpResponseData)
	const rest: Json = {
		Url = self.address .. api_root .. req;
		Method = method;
		Headers = {
			["Content-Type"] = "application/json";
			["X-API-Key"] = self.token;
		}
	}
	if body then
		rest.Body = HttpService:JSONEncode(body)
	end
	return pcall(HttpService.RequestAsync, HttpService, rest)
end

const function http(self: Http, method: HttpMethod, req: string, body: Json?): (boolean, HttpResponseData)
	if self.options.log then
		print(`[{method}]`, "|", req, "|", body)
	end

	const r_ok, r = request(self, method, req, body)
	if not r_ok and http_retries < self.options.retries then
		http_retries += 1
		http_delay = math.min(http_delay + 2, 30)
		task.wait(http_delay)
		return http(self, method, req)
	end

	http_delay, http_retries = 0, 0
	return r_ok, r
end

const function response_middleware(res: HttpResponseData, req: string, body: Json?): (boolean, HttpResponseData)
	if res.Success and res.Body then
		const ok, d = pcall(HttpService.JSONDecode, HttpService, res.Body)
		if ok then
			res.Body = d
		end
	end
	if not res.Success then
		warn(req, "-", res.StatusCode, res.StatusMessage, res.Body, "\nrequest body=", body)
	end
	return res.Success, res
end

function Http.new(address, token, options)
	const self = {}
	self.address = address
	self.token = token
	self.options = options
	return setmetatable(self, Http)
end

function Http:PostAsync(req, body)
	const r_ok, r = http(self, "POST", req)
	if r_ok then
		return response_middleware(r, req, body)
	end
	return r_ok, r
end

function Http:PutAsync(req, body)
	const r_ok, r = http(self, "PUT", req)
	if r_ok then
		return response_middleware(r, req, body)
	end
	return r_ok, r
end

function Http:GetAsync(req)
	const r_ok, r = http(self, "GET", req)
	if r_ok then
		return response_middleware(r, req)
	end
	return r_ok, r
end

function Http:DeleteAsync(req)
	const r_ok, r = http(self, "DELETE", req)
	if r_ok then
		return response_middleware(r, req)
	end
	return r_ok, r
end

return Http
