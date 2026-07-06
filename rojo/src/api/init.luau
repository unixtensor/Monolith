--!strict

local Http = require(script.http)

local HttpService = game:GetService('HttpService')
local Players = game:GetService('Players')
local RS = game:GetService('RunService')

local Api = {}
Api.__index = Api

type ResponseOk = boolean
export type Api = setmetatable<{ http: Http.Http }, typeof(Api)>

local placeid: number = game.PlaceId
local jobid: string = RS:IsStudio() and `studio-{HttpService:GenerateGUID(false)}` or game.JobId

function Api.new(address: string, token: string): Api
	return setmetatable({
		http = Http.new(address, token)
	}, Api)
end

function Api:Connected(): (ResponseOk, boolean)
	local r_ok, r = self.http:GetAsync(`/{placeid}`)
	return r_ok, r
end

function Api:Connect(): ResponseOk
	local r_ok, _r = self.http:PostAsync(`/{placeid}/{jobid}`, {
		Name = game.Name;
		CreatorId = game.CreatorId;
		MaxPlayers = Players.MaxPlayers;
	})
	return r_ok
end

function Api:Disconnect(): ResponseOk
	local r_ok, _r = self.http:PostAsync(`/{placeid}/{jobid}/disconnect`)
	return r_ok
end

function Api:UploadInstance(GameInstance: Http.Json?): ResponseOk
	local r_ok, _r = self.http:PostAsync(`/{placeid}/{jobid}/instance`, GameInstance)
	return r_ok
end

return Api
