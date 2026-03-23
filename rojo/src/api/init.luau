--!strict
local Http = require(script.http)

local Api = {} :: Constructor
Api.__index = Api

type Constructor = {
	__index: Constructor;
	new: (address: string, token: string) -> Api;
	Connect: (self: Api) -> (boolean, string)
}
export type Api = setmetatable<{ http: Http.Http }, typeof(Api)>

function Api.new(address, token)
	return setmetatable({
		http = Http.new(address, token)
	}, Api)
end

function Api:Connect()
	return self.http:PostAsync("/connect", {
		Id = game.GameId,
		Name = game.Name,
		CreatorId = game.CreatorId
	}, false)
end

return Api
