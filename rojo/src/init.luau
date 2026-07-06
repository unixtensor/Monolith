--!strict

local Api = require(script.api)
local Data = require(script.data)
local Http = require(script.api.http)

local Monolith = {}
Monolith.__index = Monolith
-- The current limitation for sending and receiving external HTTP requests is 500 requests per minute.
-- https://create.roblox.com/docs/reference/engine/classes/HttpService#RequestAsync
Monolith.LISTEN_RATE = 5

type Self = {
	data: Data.Data;
	api: Api.Api;
	address: string;
}
export type Monolith = setmetatable<Self, typeof(Monolith)>

local init: boolean = false

function Monolith.new(address: string, token: string): Monolith
	assert(Http.Enabled, "Cannot proceed! Monolith REQUIRES http requests to be enabled for this game.")

	local self = {}
	self.data = Data.new()
	self.api = Api.new(address, token)
	self.address = address
	return setmetatable(self, Monolith)
end

function Monolith:ConnectAsync()
	assert(not init, "Monolith already started for this server instance.")

	local connected_ok, connected = self.api:Connected()
	if not connected_ok then
		return connected_ok
	end
	if connected then
		return connected
	end
	local connect_ok = self.api:Connect()
	if connect_ok then
		init = true
	end
	return connect_ok
end

return Monolith
