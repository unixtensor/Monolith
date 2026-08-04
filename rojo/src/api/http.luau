--!strict

const HttpService = game:GetService("HttpService")

const Http = {} :: Constructor
Http.__index = Http
Http.Enabled = HttpService.HttpEnabled

type Constructor = {
	__index: Constructor;
	Enabled: boolean;
	new: (address: string, token: string) -> Http;
	PostAsync: (self: Http, req: string, body: Json?) -> (boolean, HttpResponseData);
	PutAsync: (self: Http, req: string, body: Json?) -> (boolean, HttpResponseData);
	GetAsync: (self: Http, req: string) -> (boolean, HttpResponseData);
	DeleteAsync: (self: Http, req: string, body: Json?) -> (boolean, HttpResponseData)
}
type Self = {
	address: string;
	token: string;
}
export type Http = setmetatable<Self, typeof(Http)>

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
type HttpMethod = "POST" | "PUT" | "GET" | "DELETE"
type RestDetails = {
	method: HttpMethod;
	request: string;
	body: string?;
}

const api_root:   "/api/v1" = "/api/v1"
local http_delay: number = 0

const function request(self: Http, method: HttpMethod, req: string, body: Json?): (boolean, HttpResponseData)
	return pcall(HttpService.RequestAsync, HttpService, {
		Url = self.address .. api_root .. req;
		Method = method;
		Headers = {
			["Content-Type"] = "application/json";
			["X-API-Key"] = self.token;
		},
		Body = HttpService:JSONEncode(body or {});
	} :: Json)
end

const function http_async(self: Http, method: HttpMethod, req: string, body: Json?): HttpResponseData?
	const r_ok, r = request(self, method, req, body)
	if not r_ok then
		http_delay = math.max(http_delay + 2, 30)
		task.wait(http_delay)
		return http_async(self, method, req)
	end
	http_delay = 0
	return r
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

function Http.new(address, token)
	const self = {}
	self.address = address
	self.token = token
	return setmetatable(self, Http)
end

function Http:PostAsync(req, body)
	const r = http_async(self, "POST", req)
	if r then
		return response_middleware(r, req, body)
	end
	return false, {} :: HttpResponseData
end

function Http:PutAsync(req, body)
	const r = http_async(self, "PUT", req)
	if r then
		return response_middleware(r, req, body)
	end
	return false, {} :: HttpResponseData
end

function Http:GetAsync(req)
	const r = http_async(self, "GET", req)
	if r then
		return response_middleware(r, req)
	end
	return false, {} :: HttpResponseData
end

function Http:DeleteAsync(req)
	const r = http_async(self, "DELETE", req)
	if r then
		return response_middleware(r, req)
	end
	return false, {} :: HttpResponseData
end

return Http
