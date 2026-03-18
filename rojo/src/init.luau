--!strict

local monolith = {}
monolith.__index = monolith
monolith.DEV_MODE = true

local HttpService = game:GetService("HttpService")
local Data = require(script:WaitForChild("data"))

function monolith.new(address: string)
	if not monolith.DEV_MODE and not HttpService.HttpEnabled then
		error("Cannot proceed! Monolith REQUIRES http requests to be enabled for this game. SERVER STOPPING", 0)
	end
	local self = {}
	self.data = Data.new()
	self.address = address
	return setmetatable(self, monolith)
end



return monolith
