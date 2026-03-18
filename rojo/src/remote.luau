local default_path = game:GetService("ReplicatedStorage")
local Remote = Instance.new("RemoteEvent")
Remote.Name = "monolith"

type UserIds = {number}
type Payload = {
	address: string,
	stop: boolean,
}

local function Endpoint(authorized_table: UserIds, client: Player, payload: Payload)
	if not authorized_table[client.UserId] then
		return
	end


end

return function(authorized_table: UserIds, path: Instance?)
	Remote.Parent = path or default_path
	Remote.OnServerEvent:Connect(function(client: Player, payload: Payload)
		Endpoint(authorized_table, client, payload)
	end)
end
