--!strict

local Data = require(script.data)
local Http = require(script.http)

local Monolith = {} :: Constructor
Monolith.__index = Monolith
Monolith.DEV_MODE = false --RunService:IsStudio()

-- The current limitation for sending and receiving external HTTP requests is 500 requests per minute.
-- https://create.roblox.com/docs/reference/engine/classes/HttpService#RequestAsync
Monolith.LISTEN_RATE = 5

type Constructor = {
	__index: Constructor;
	DEV_MODE: boolean;
	LISTEN_RATE: number;
	UseInsecure: () -> ();
	new: (address: string, token: string, enable_compression: boolean?) -> Monolith;
}
type Self = {
	data: Data.Data;
	http: Http.Http;
	address: string;
}
export type Monolith = setmetatable<Self, typeof(Monolith)>

function Monolith.UseInsecure()
	Http.__bypassInsecure = true
end

function Monolith.new(address, token, enable_compression)
	assert(Http.Enabled, "Cannot proceed! Monolith REQUIRES http requests to be enabled for this game. STOPPING")
	assert(Http.ValidAddress(address), `"{address}" Is not a valid http/https address. STOPPING`)

	local self = {}
	self.data = Data.new()
	self.http = Http.new(address, token, enable_compression)
	self.address = address
	return setmetatable(self, Monolith)
end



return Monolith
