--!strict

local HttpService = game:GetService("HttpService")

local Http = {} :: Constructor
Http.__index = Http
Http.__bypassInsecure = false
Http.Insecure = Http.__bypassInsecure
Http.Enabled = HttpService.HttpEnabled

export type HttpResponseData<T = string?> = {
    Body: T,
    Headers: {
        [string]: string
    },
    StatusCode: number,
    StatusMessage: string,
    Success: boolean
}
export type Json<K = string, V = any> = {
	[K]: V;
}
type RestDetails = {
	method: "POST" | "GET";
	request: string;
	body: string?;
}

type Constructor = {
	__index: Constructor;
	__bypassInsecure: boolean;
	Enabled: boolean;
	Insecure: boolean;
	ValidAddress: (address: string) -> string?;
	new: (address: string, token: string, compression: boolean) -> Http;
	PostAsync: <T>(self: Http, req: string, body: Json?) -> (boolean, HttpResponseData<T>);
	GetAsync: <T>(self: Http, req: string) -> (boolean, HttpResponseData<T>);
}
type Self = {
	address: string;
	token: string;
	compression: boolean?;
}
export type Http = setmetatable<Self, typeof(Http)>

local api_root: string = "/api/v1"

local function rest_builder(self: Http, rest: RestDetails): Json
	local payload = {
		Url = self.address .. api_root .. rest.request;
		Method = rest.method;
		Headers = {
			["Content-Type"] = "application/json";
			["x-api-key"] = self.token;
		},
		Body = rest.body;
	}
	if self.compression then
		payload.Headers["Content-Encoding"] = "gzip"
		payload.Compress = Enum.HttpCompression.Gzip
	end
	return payload
end

local function response_middleware<T>(res: HttpResponseData, req: string, body: Json?): (boolean, HttpResponseData<T>)
	if res.Success and res.Body then
		res.Body = HttpService:JSONDecode(res.Body)
	end
	if not res.Success then
		warn(req, "-", res.StatusCode, res.StatusMessage, res.Body, "\nrequest body=", body)
	end
	return res.Success, res
end

local function local_address(host: string): string?
	return host:match("^localhost")
		or host:match("^0%.0%.0%.0$")
		or host:match("^192%.168%.")
		or host:match("^10%.")
		or host:match("^127%.")
		or host:match("^172%.%d+%.")
end

function Http.ValidAddress(address)
	local http_compliant = address:match("^https?://")
	if http_compliant then
		local domain = address:match("https?://([^/]+)")
		if not domain then
			return nil
		end
		if not local_address(domain) and http_compliant == "http://" then
			Http.Insecure = true
		end
		--Trim trailing slash
		return (address:gsub("/+$", ""))
	end
	return nil
end

function Http.new(address, token, compression)
	if Http.Insecure then
		if not Http.__bypassInsecure then
			error("An insecure address is being used.  STOPPING", 0)
		end
		warn("Monolith has been forcefully connected using a public insecure address.  You're open to man-in-the-middle attacks!")
	end

	local self = {}
	self.address = address
	self.token = token
	self.compression = compression
	return setmetatable(self, Http)
end

function Http:PostAsync(req, body)
	local r = HttpService:RequestAsync(rest_builder(self, {
		method = "POST";
		request = req;
		body = HttpService:JSONEncode(body or {});
	}))
	return response_middleware(r, req, body)
end

function Http:GetAsync(req)
	local r = HttpService:RequestAsync(rest_builder(self, {
		method = "GET";
		request = req;
	}))
	return response_middleware(r, req)
end

return Http
