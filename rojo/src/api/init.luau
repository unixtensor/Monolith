--!strict

local Http = require(script.http)
local RS = game:GetService("RunService")

local Api = {} :: Constructor
Api.__index = Api

type ResponseOk = boolean
type Constructor = {
	__index: Constructor;
	new: (address: string, token: string, compression: boolean) -> Api;
	Connected: (self: Api) -> (ResponseOk, boolean);
	Connect: (self: Api) -> ResponseOk;
	Disconnect: (self: Api) -> ResponseOk;
	UploadInstance: (self: Api, Http.Json?) -> ResponseOk;
}
export type Api = setmetatable<{ http: Http.Http }, typeof(Api)>

local placeid: number = game.PlaceId
local jobid: string = RS:IsStudio() and "studio" or game.JobId

function Api.new(address, token, compression)
	return setmetatable({
		http = Http.new(address, token, compression)
	}, Api)
end

function Api:Connected()
	local r_ok, r = self.http:GetAsync(`/{placeid}`)
	return r_ok, r.Body :: boolean
end

function Api:Connect()
	local r_ok, _r = self.http:PostAsync(`/{placeid}/{jobid}`, {
		Name = game.Name;
		CreatorId = game.CreatorId;
	})
	return r_ok
end

function Api:Disconnect()
	local r_ok, _r = self.http:PostAsync(`/{placeid}/{jobid}/disconnect`)
	return r_ok
end

function Api:UploadInstance(GameInstance)
	local r_ok, _r = self.http:PostAsync(`/{placeid}/{jobid}/instance`, GameInstance)
	return r_ok
end

return Api
