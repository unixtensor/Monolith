--!strict

local GameInstance = require(script.instance)

local Data = {} :: Constructor
Data.__index = Data

type Constructor = {
	__index: Constructor;
	new: () -> Data;
	Game: (self: Data) -> GameInstance.GameInstancePayload
}
type Self = {
	GameInstance: GameInstance.GameInstance
}
export type Data = setmetatable<Self, typeof(Data)>

function Data.new()
	local self = {}
	self.GameInstance = GameInstance.new()
	return setmetatable(self, Data)
end

function Data:Game()
	return self.GameInstance:Collect()
end

return Data
