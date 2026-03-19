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
	new: (address: string, enable_compression: boolean?) -> Monolith;
	ConnectAsync: (self: Monolith) -> ();
	UploadAsync: (self: Monolith) -> ();
	ListenAsync: (self: Monolith) -> ();
}
type Self = {
	data: Data.Data;
	http: Http.Http;
	address: string;
}
export type Monolith = setmetatable<Self, typeof(Monolith)>

function Monolith.new(address, enable_compression)
	if not Monolith.DEV_MODE and not Http.Enabled then
		error("Cannot proceed! Monolith REQUIRES http requests to be enabled for this game. STOPPING", 0)
	end
	if not Http.ValidAddress(address) then
		error(`"{address}" Is not a valid http/https address. STOPPING`, 0)
	end

	local self = {}
	self.data = Data.new()
	self.http = Http.new(address, enable_compression)
	self.address = address
	return setmetatable(self, Monolith)
end

function Monolith:ConnectAsync()
	self.http:PostAsync({
		Id = game.PlaceId,
		Name = game.Name,
		CreatorId = game.CreatorId,
	}, Http.ApiEndpoint.CONNECT)
end

function Monolith:UploadAsync()
	self.http:UploadAsync(self.data:collect())
end

function Monolith:ListenAsync()
	while task.wait(Monolith.LISTEN_RATE) do
		self:UploadAsync()
	end
end

return Monolith
