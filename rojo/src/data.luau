local Data = {}
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

local HttpService = game:GetService("HttpService")

local function payload(self)
	self.collected[1] = {
		Game = game.Name,
		Owner = game.CreatorId
	}
	return HttpService:JSONEncode(self.collected)
end

function body(instance: Instance, parent: Instance?)
	local skeleton = {
		ClassName = instance.ClassName,
		Name = instance.Name
	}
	if parent then
		skeleton.Children = parent
	end
	return skeleton
end

local function query(instance: Instance)
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

function Data.new()
	return setmetatable({ collected = {} }, Data)
end

function Data:collect()
	self.collected = {
		{}; --header
		{}; --body
	}

	for _, service in Data.monitor do
		self.collected[2][service.Name] = query(service, body(service))
	end
	return payload(self)
end

return Data
