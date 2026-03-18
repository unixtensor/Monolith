--!strict

local HttpService = game:GetService("HttpService")

local Http = {} :: Constructor
Http.__index = Http
Http.Enabled = HttpService.HttpEnabled

type Constructor = {
	__index: Constructor;
	Enabled: boolean;
	new: (address: string, compression: Enum.HttpCompression) -> Http;
	ValidAddress: (address: string) -> boolean;
	PostRequest: (self: Http, json_payload: string) -> ();
}
type Self = {
	address: string;
	compression: Enum.HttpCompression;
}
export type Http = setmetatable<Self, typeof(Http)>

function Http.ValidAddress(address)
	return address:match("^https?://") ~= nil
end

function Http.new(address, compression)
	local self = {}
	self.address = address
	self.compression = compression
	return setmetatable(self, Http)
end

function Http:PostRequest(json_payload)
	local req = HttpService:RequestAsync({
		Url = self.address,
		Method = "POST",
		Headers = {
			["Content-Type"] = "application/json",
		},
		Body = json_payload,
		Compress = self.compression
	} :: any)
end

return Http
