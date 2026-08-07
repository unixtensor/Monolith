--!strict

const State = require("@self/state")
const Http = require("@self/api/http")
const Api = require("@self/api")

const Monolith = {} :: Constructor
Monolith.__index = Monolith
-- The current limitation for sending and receiving external HTTP requests is 500 requests per minute.
-- https://create.roblox.com/docs/reference/engine/classes/HttpService#RequestAsync
Monolith.LISTEN_RATE  = 5
Monolith.HTTP_LOG     = false
Monolith.HTTP_RETRIES = 30

type Constructor = {
	__index: Constructor;
	LISTEN_RATE: number;
	HTTP_LOG: boolean;
	HTTP_RETRIES: number;

	connected: () -> boolean;
	new: (address: string, token: string) -> Monolith;
	ConnectAsync: (self: Monolith) -> boolean;
}
export type Monolith = setmetatable<{
	api: Api.Api;
	state: State.State;
	address: string;
}, typeof(Monolith)>

function Monolith.connected()
	return State.connected
end

function Monolith.new(address, token)
	assert(Http.Enabled, "Cannot proceed! Monolith REQUIRES http requests to be enabled for this game.")

	const self = {}
	self.api = Api.new(address, token, {
		log = Monolith.HTTP_LOG;
		retries = Monolith.HTTP_RETRIES;
	})
	self.state = State.new(self.api)
	self.address = address
	return setmetatable(self, Monolith)
end

function Monolith:ConnectAsync()
	assert(not State.connected, "Monolith already started for this server instance.")
	return self.state:Connect()
end

return Monolith
