--!strict

type QueryBody = {
	ClassName: string;
	Name: string;
	children: QueryBody?;
}
export type Payload = {
	[string]: QueryBody
}

local Data = {} :: Constructor
Data.__index = Data

type Constructor = {
	__index: Constructor;
	monitor: {Instance};
	new: () -> Data;
	collect: (self: Data) -> Payload;
}
export type Data = setmetatable<{ payload: Payload }, typeof(Data)>

--Services to monitor
Data.monitor = {
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

local function body(instance: Instance, children: QueryBody?): QueryBody
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
        for _, child in inst_c do
            inst_c_collection = query(child)
        end
    end
    return body(instance, inst_c_collection)
end

function Data.new()
	return setmetatable({ body = {} }, Data)
end

function Data:collect()
	self.payload = {}
	for _, service in Data.monitor do
		self.payload[service.Name] = query(service)
	end
	return self.payload
end

return Data
