--!strict

local GameInstance = {} :: Constructor
GameInstance.__index = GameInstance
--Services to monitor
GameInstance.monitor = {
	game:GetService("Workspace");
	game:GetService("Players");
	game:GetService("Lighting");
	game:GetService("ReplicatedFirst");
	game:GetService("ReplicatedStorage");
	game:GetService("ServerScriptService");
	game:GetService("ServerStorage");
	game:GetService("StarterGui");
	game:GetService("StarterPack");
	game:GetService("StarterPlayer");
	game:GetService("Teams");
	game:GetService("SoundService");
	game:GetService("TextChatService");
}

type QueryBody = {
	ClassName: string;
	Name: string;
	children: {QueryBody}?;
}
export type GameInstancePayload = {
	[string]: QueryBody
}

type Constructor = {
	__index: Constructor;
	monitor: {Instance};
	new: () -> GameInstance;
	Collect: (self: GameInstance) -> GameInstancePayload;
}
export type GameInstance = setmetatable<{ payload: GameInstancePayload }, typeof(GameInstance)>

local function body(instance: Instance, children: {QueryBody}?): QueryBody
	local skeleton: QueryBody = {
		ClassName = instance.ClassName,
		Name = instance.Name
	}
	if children then
		skeleton.children = children
	end
	return skeleton
end

local function query(instance: Instance): QueryBody
 	local inst_c = instance:GetChildren()
    local inst_c_collection = nil

    if #inst_c ~= 0 then
   		inst_c_collection = {}
        for _, child in inst_c do
        	table.insert(inst_c_collection, query(child))
        end
    end
    return body(instance, inst_c_collection)
end

function GameInstance.new()
	return setmetatable({ body = {} }, GameInstance)
end

function GameInstance:Collect()
	self.payload = {}
	for _, service in GameInstance.monitor do
		self.payload[service.Name] = query(service)
	end
	return self.payload
end

return GameInstance
