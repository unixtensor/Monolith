--!strict

const Http = require("@self/http")

const HttpService = game:GetService("HttpService")
const Players = game:GetService('Players')
const MPS = game:GetService("MarketplaceService")
const RS = game:GetService('RunService')

const RBX_ERROR: string = "*ROBLOX-ERROR*"
const placeid:   number = game.PlaceId
const jobid:     string = not RS:IsStudio() and game.JobId or "studio-" .. HttpService:GenerateGUID(false)

const Api = {} :: Constructor
Api.__index = Api
Api.Root = "/api/v1"
Api.Game = `/{placeid}`
Api.Job  = `{Api.Game}/{jobid}`

type Constructor = {
	__index: Constructor;
	Root: string;
	Game: string;
	Job: string;

	new: (address: string, token: string, http: Http.Http) -> Api;
	Connected: (self: Api) -> (boolean, Http.Json);
	Connect: (self: Api) -> boolean;
	Disconnect: (self: Api) -> boolean;
	Players: (self: Api) -> boolean;
}
export type Api = setmetatable<{ http: Http.Http }, typeof(Api)>

type GameDetails = {
	Properties: {
		Name: string;
		UpTime: number;
		Created: string;
		Updated: string;
		MaxPlayers: number;
		Description: string;
	};
	Creator: {
		Id: number;
		Name: string;
	};
}
local game_details: GameDetails = {
	Properties = {
		Name = RBX_ERROR; --game.Name(?)
		UpTime = workspace.DistributedGameTime;
		Created = RBX_ERROR;
		Updated = RBX_ERROR;
		MaxPlayers = Players.MaxPlayers;
		Description = RBX_ERROR;
	};
	Creator = {
		Id = game.CreatorId;
		Name = RBX_ERROR;
	}
}

const function game_details_async(): GameDetails
	if game_details.Properties.Name ~= RBX_ERROR then
		return game_details
	end
	const i_ok, i = pcall(MPS.GetProductInfoAsync, MPS, placeid, Enum.InfoType.Asset)
	if i_ok then
		game_details.Properties.Name = i.Name
		game_details.Properties.Created = i.Created
		game_details.Properties.Updated = i.Updated
		game_details.Properties.Description = i.Description
		game_details.Creator.Name = i.Creator.Name
	else
		warn(i)
	end
	return game_details
end

function Api.new(address, token, http)
	return setmetatable({ http = http }, Api)
end

function Api:Connected()
	const r_ok, r = self.http:GetAsync(Api.Game)
	return r_ok, r
end

function Api:Connect()
	const r_ok, _r = self.http:PostAsync(Api.Job, game_details_async())
	return r_ok
end

function Api:Disconnect()
	const r_ok, _r = self.http:DeleteAsync(Api.Job)
	return r_ok
end

function Api:Players()
	const p: { [string]: string } = {}
	for _, player in Players:GetPlayers() do
		p[tostring(player.UserId)] = player.Name
	end
	const r_ok, _r = self.http:PutAsync(`{Api.Job}/players`, p)
	return r_ok
end

return Api
