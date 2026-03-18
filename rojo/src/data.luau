--!strict

local HttpService = game:GetService("HttpService")

type QueryBody = {
	ClassName: string;
	Name: string;
	Children: QueryBody?;
}
type QueryHeader = {
	Game: string;
	Owner: number;
}
type Body = {
	[number]: QueryHeader | QueryBody
}
type Constructor = {
	__index: Constructor;
	monitor: {Instance};
	new: () -> Data;
	collect: (self: Data) -> string;
}
export type Data = typeof(setmetatable({} :: { body: Body }, {} :: Constructor))

local Data = {} :: Constructor
Data.__index = Data

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

local function payload(self: Data): string
	self.body[1] = {
		Game = game.Name,
		Owner = game.CreatorId
	}
	return HttpService:JSONEncode(self.body)
end

local function body(instance: Instance, children: QueryBody?): QueryBody
	local skeleton: QueryBody = {
		ClassName = instance.ClassName,
		Name = instance.Name
	}
	if children then
		skeleton.Children = children
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
	self.body = {
		[1] = {} :: QueryHeader; --header
		[2] = {} :: QueryBody; --body
	}

	for _, service in Data.monitor do
		self.body[2][service.Name] = query(service)
	end
	return payload(self)
end

return Data
