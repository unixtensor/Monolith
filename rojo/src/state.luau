--!strict

const Api = require("./api")

const Players = game:GetService("Players")

const State = {} :: Constructor
State.__index = State
State.connected = false

type Constructor = {
	__index: Constructor;
	connected: boolean;

	new: (api: Api.Api) -> State;
	Connect: (self: State) -> boolean;
}
export type State = setmetatable<{ api: Api.Api }, typeof(State)>

const function players(self: State)
	self.api:Players()
	Players.PlayerAdded:Connect(function()
		self.api:Players()
	end)
	Players.PlayerRemoving:Connect(function()
		self.api:Players()
	end)
end

function State.new(api)
	return setmetatable({
		api = api
	}, State)
end

function State:Connect()
	const connected_ok, connected = self.api:Connected()
	if not connected_ok then
		return connected_ok
	end
	if connected then
		return connected
	end

	const connect_ok = self.api:Connect()
	if connect_ok then
		players(self)
	end
	return connect_ok
end

return State
