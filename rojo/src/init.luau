--!strict

local monolith = {} :: Constructor
monolith.__index = monolith
monolith.DEV_MODE = true

local Data = require(script.data)

type Constructor = {
	__index: Constructor;
	DEV_MODE: boolean;
	new: (address: string) -> Monolith;
}
type Self = {
	data: Data.Data;
	address: string;
}
export type Monolith = typeof(setmetatable({} :: Self, {} :: Constructor))

local HttpService = game:GetService("HttpService")

function monolith.new(address)
	if not monolith.DEV_MODE and not HttpService.HttpEnabled then
		error("Cannot proceed! Monolith REQUIRES http requests to be enabled for this game. SERVER STOPPING", 0)
	end

	local self = {}
	self.data = Data.new()
	self.address = address
	return setmetatable(self, monolith)
end

return monolith
