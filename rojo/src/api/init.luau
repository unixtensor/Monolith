--!strict

const Http = require("@self/http")

const HttpService = game:GetService('HttpService')
const Players = game:GetService('Players')
const RS = game:GetService('RunService')

const Api = {} :: Constructor
Api.__index = Api

type Constructor = {
	__index: Constructor;

	new: (address: string, token: string, http_options: Http.HttpOptions) -> Api;
	Connected: (self: Api) -> (boolean, Http.Json);
	Connect: (self: Api) -> boolean;
	Disconnect: (self: Api) -> boolean;
	Players: (self: Api) -> boolean;
}
export type Api = setmetatable<{ http: Http.Http }, typeof(Api)>

const placeid: number = game.PlaceId
const jobid:   string = RS:IsStudio() and `studio-{HttpService:GenerateGUID(false)}` or game.JobId

function Api.new(address, token, http_options)
	return setmetatable({
		http = Http.new(address, token, http_options)
	}, Api)
end

function Api:Connected()
	const r_ok, r = self.http:GetAsync(`/{placeid}`)
	return r_ok, r
end

function Api:Connect()
	const r_ok, _r = self.http:PutAsync(`/{placeid}/{jobid}`, {
		Name = game.Name;
		CreatorId = game.CreatorId;
		MaxPlayers = Players.MaxPlayers;
	})
	return r_ok
end

function Api:Disconnect()
	const r_ok, _r = self.http:DeleteAsync(`/{placeid}/{jobid}`)
	return r_ok
end

function Api:Players()
	const p: { [string]: string } = {}
	for _, player in Players:GetPlayers() do
		p[tostring(player.UserId)] = player.Name
	end
	const r_ok, _r = self.http:PutAsync(`/{placeid}/{jobid}/players`, p)
	return r_ok
end

return Api
