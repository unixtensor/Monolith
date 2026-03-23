--!strict

local Http = require(script.http)

local Api = {} :: Constructor
Api.__index = Api

type Constructor = {
	__index: Constructor;
	new: (address: string, token: string) -> Api;
	Connected: (self: Api) -> (boolean, boolean);
	Connect: (self: Api) -> boolean;
	Disconnect: (self: Api) -> boolean;
}
export type Api = setmetatable<{ http: Http.Http }, typeof(Api)>

function Api.new(address, token)
	return setmetatable({
		http = Http.new(address, token)
	}, Api)
end

function Api:Connected()
	local r_ok, r = self.http:GetAsync("/connected")
	return r_ok, r.Body :: boolean
end

function Api:Connect()
	local r_ok, _r = self.http:PostAsync("/connect", {
		Id = game.GameId;
		Name = game.Name;
		CreatorId = game.CreatorId;
	})
	return r_ok
end

function Api:Disconnect()
	local r_ok, _r = self.http:PostAsync("/disconnect")
	return r_ok
end

return Api
