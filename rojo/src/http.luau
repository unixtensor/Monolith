--!strict

local HttpService = game:GetService("HttpService")

local Http = {} :: Constructor
Http.__index = Http
Http.__bypassInsecure = false
Http.Insecure = Http.__bypassInsecure
Http.Enabled = HttpService.HttpEnabled

type Json = {
	[string]: any;
}
type RestDetails = {
	method: "POST" | "GET";
	request: string;
	json: string?;
}
type Constructor = {
	__index: Constructor;
	__bypassInsecure: boolean;
	Enabled: boolean;
	Insecure: boolean;
	ValidAddress: (address: string) -> string?;
	new: (address: string, token: string, enable_compression: boolean?) -> Http;
	PostAsync: (self: Http, request: string, json_str: string, compress: boolean) -> (boolean, string);
	GetAsync: (self: Http, request: string, json_str: string) -> (boolean, string);
}
type Self = {
	address: string;
	token: string;
	compression: boolean?;
}
export type Http = setmetatable<Self, typeof(Http)>

local api_root: string = "/api/v1"

local function restful_body(self: Http, rest: RestDetails, compress: boolean): Json
	local payload = {
		Url = self.address .. api_root .. rest.request;
		Method = rest.method;
		Headers = {
			["Content-Type"] = "application/json";
			["x-api-key"] = self.token;
		},
		Body = rest.json or "{}";
	}
	if compress then
		payload.Compress = self.compression
	end
	return payload
end

local function request_async(self: Http, rest: RestDetails, compress: boolean): (boolean, string)
	local r_ok, r = pcall(function()
		return HttpService:RequestAsync(restful_body(self, rest, compress))
	end)
	if not r_ok then
		return false, tostring(r)
	end
	if not r.Success then
		return false, r.StatusMessage
	end
	return true, ""
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

function Http.new(address, token, enable_compression)
	if Http.Insecure then
		if not Http.__bypassInsecure then
			error("An insecure address is being used. STOPPING", 0)
		end
		warn("Monolith has been forcefully connected using a public insecure address. You're open to man-in-the-middle attacks!")
	end

	local self = {}
	self.address = address
	self.token = token
	self.compression = enable_compression
	return setmetatable(self, Http)
end

function Http:PostAsync(request, json_str, compress)
	return request_async(self, {
		method = "POST";
		request = request;
		json = json_str;
	}, compress)
end

function Http:GetAsync(request, json_str)
	return request_async(self, {
		method = "GET";
		request = request;
		json = json_str;
	}, false)
end

return Http
