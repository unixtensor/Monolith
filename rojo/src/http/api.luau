--!strict

local Api = {} :: Constructor
Api.__index = Api

type Constructor = {
	__index: Constructor;
	new: () -> Api;
}
type Self = {}
export type Api = setmetatable<Self, typeof(Api)>

function Api.new()
	local self = {}
	return setmetatable(self, Api)
end

return Api
