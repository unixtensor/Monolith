--!strict

local HttpService = game:GetService("HttpService")

local Http = {}
Http.__index = Http
Http.Enabled = HttpService.HttpEnabled

export type HttpResponseData<B> = {
    Body: B,
    Headers: {
        [string]: string
    },
    StatusCode: number,
    StatusMessage: string,
    Success: boolean
}
export type Json = any
type RestDetails = {
	method: "POST" | "PUT" | "GET" | "DELETE";
	request: string;
	body: string?;
}

type Self = {
	address: string;
	token: string;
}
export type Http = setmetatable<Self, typeof(Http)>

local api_root: "/api/v1" = "/api/v1"

local function rest_builder(self: Http, rest: RestDetails): Json
	local payload = {
		Url = self.address .. api_root .. rest.request;
		Method = rest.method;
		Headers = {
			["Content-Type"] = "application/json";
			["X-API-Key"] = self.token;
		},
		Body = rest.body;
	}
	-- if self.compression then
	-- 	payload.Headers["Content-Encoding"] = "gzip"
	-- 	payload.Compress = Enum.HttpCompression.Gzip
	-- end
	return payload
end

local function response_middleware<B>(res: HttpResponseData<B>, req: string, body: Json?): (boolean, HttpResponseData<B>)
	if res.Success and res.Body then
		local ok, d = pcall(HttpService.JSONDecode, HttpService, res.Body)
		if ok then
			res.Body = d
		end
	end
	if not res.Success then
		warn(req, "-", res.StatusCode, res.StatusMessage, res.Body, "\nrequest body=", body)
	end
	return res.Success, res
end

function Http.new(address: string, token: string): Http
	local self = {}
	self.address = address
	self.token = token
	return setmetatable(self, Http)
end

function Http:PostAsync<B>(req: string, body: Json?): (boolean, HttpResponseData<B>)
	local r = HttpService:RequestAsync(rest_builder(self, {
		method = "POST";
		request = req;
		body = HttpService:JSONEncode(body or {});
	}))
	return response_middleware(r, req, body)
end

function Http:GetAsync<B>(req: string): (boolean, HttpResponseData<B>)
	local r = HttpService:RequestAsync(rest_builder(self, {
		method = "GET";
		request = req;
	}))
	return response_middleware(r, req)
end

return Http
