local DEV_MODE: boolean = true
local authorized_users = {
	game.CreatorId
}
local HttpService = game:GetService("HttpService")

if not DEV_MODE and not HttpService.HttpEnabled then
	error("Cannot proceed! Monolith REQUIRES http requests to be enabled for this game. SERVER STOPPING", 0)
end

local Data = require(script:WaitForChild("data"))
local Remote = require(script:WaitForChild("remote"))

Remote(authorized_users)

local data_collection = Data.new()
print(data_collection:collect())
