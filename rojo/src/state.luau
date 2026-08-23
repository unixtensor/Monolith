--!strict

const Api = require("./api")
const http = require("./api/http")

const Players = game:GetService("Players")

const State = {} :: Constructor
State.__index = State
State.connected = false

type Constructor = {
	__index: Constructor;
	connected: boolean;

	new: (api: Api.Api, http: http.Http) -> State;
	Connect: (self: State) -> boolean;
}
export type State = setmetatable<{
	api: Api.Api;
	http: http.Http;
}, typeof(State)>

const function http_middleware(self: State)
	self.http.MiddlewareResponse.OnInvoke = function(_method: http.HttpMethod, _res: string, req: string)
		if req == `{Api.StemJob}/players` then
			self.api:UpTime()
		end
		return true
	end
end

const function players(self: State)
	self.api:Players()
	Players.PlayerAdded:Connect(function()
		self.api:Players()
	end)
	Players.PlayerRemoving:Connect(function()
		self.api:Players()
	end)
end

const function closing(self: State)
	game:BindToClose(function()
		self.api:Disconnect()
	end)
end

function State.new(api, http)
	const self = {}
	self.api = api
	self.http = http
	return setmetatable(self, State)
end

function State:Connect()
	const connect_ok = self.api:Connect()
	if connect_ok then
		closing(self)
		http_middleware(self)
		players(self)
	end
	return connect_ok
end

return State
