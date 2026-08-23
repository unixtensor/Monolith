--!strict

const HttpService = game:GetService("HttpService")

const Http = {} :: Constructor
Http.__index = Http
Http.Enabled = HttpService.HttpEnabled

export type HttpOptions<T = string?> = {
	root: T;
	log: boolean;
	retries: number;
}
type Constructor = {
	__index: Constructor;
	Enabled: boolean;

	new: (address: string, token: string, options: HttpOptions) -> Http;
	PostAsync: (self: Http, req: string, body: Json?, guarantee: boolean?) -> (boolean, HttpResponseData);
	PutAsync: (self: Http, req: string, body: Json?, guarantee: boolean?) -> (boolean, HttpResponseData);
	GetAsync: (self: Http, req: string, guarantee: boolean?) -> (boolean, HttpResponseData);
	DeleteAsync: (self: Http, req: string, body: Json?, guarantee: boolean?) -> (boolean, HttpResponseData)
}
export type Http = setmetatable<{
	address: string;
	token: string;
	options: HttpOptions<string>;
	Middleware: BindableFunction;
	MiddlewareResponse: BindableFunction;
}, typeof(Http)>

export type HttpMethod = "POST" | "PUT" | "GET" | "DELETE"
export type Json = any
export type HttpResponseData = {
    Body: Json,
    Headers: {
        [string]: string
    },
    StatusCode: number,
    StatusMessage: string,
    Success: boolean
}
type RestDetails = {
	method: HttpMethod;
	request: string;
	body: string?;
}

local http_delay:   number = 0
local http_retries: number = 0

const function request(self: Http, method: HttpMethod, req: string, body: Json?): (boolean, HttpResponseData)
	const rest: Json = {
		Url = self.address .. self.options.root .. req;
		Method = method;
		Headers = {
			["Content-Type"] = "application/json";
			["X-API-Key"] = self.token;
		}
	}
	if body then
		rest.Body = HttpService:JSONEncode(body)
	end
	return pcall(HttpService.RequestAsync, HttpService, rest)
end

const function http(self: Http, method: HttpMethod, req: string, body: Json?, guarantee: boolean?): (boolean, HttpResponseData)
	guarantee = guarantee == nil and true or guarantee

	if self.options.log then
		print(`[{method}]`, "|", req, "|", body, "| guarantee=", guarantee)
	end

	const r_ok, r = request(self, method, req, body)
	if not r_ok and r.StatusCode then
		http_delay = math.min(http_delay + 2, 30)
		task.wait(http_delay)

		if guarantee then
			return http(self, method, req)
		end
		if http_retries < self.options.retries then
			return http(self, method, req)
		end
	end

	http_delay, http_retries = 0, 0
	return r_ok, r
end

const function response(res: HttpResponseData, req: string, body: Json?): (boolean, HttpResponseData)
	if res.Success and res.Body then
		const ok, d = pcall(HttpService.JSONDecode, HttpService, res.Body)
		if ok then
			res.Body = d
		end
	end
	if not res.Success then
		warn(req, "-", res.StatusCode, res.StatusMessage, res.Body, "\nrequest body=", body)
	end
	return res.Success, res
end

const function http_handler(self: Http, method: HttpMethod, req: string, body: Json?, guarantee: boolean?): (boolean, HttpResponseData)
	if not self.Middleware:Invoke(method, req, body) then
		if self.options.log then
			warn(`(MIDDLEWARE STOPPED...) [{method}]`, "|", req, "|", body, "| guarantee=", guarantee)
		end
		return false, {} :: HttpResponseData
	end

	const r_ok, r = http(self, method, req, body, guarantee)
	if not self.MiddlewareResponse:Invoke(r_ok, r, req, body) then
		if self.options.log then
			warn(`(RESPONSE MIDDLEWARE STOPPED...) [{method}]`, "|", req, "|", body, "| guarantee=", guarantee, "| ok=", r_ok, "| response=", r)
		end
		return false, {} :: HttpResponseData
	end
	if r_ok then
		return response(r, req, body)
	end
	return r_ok, r
end

const function bind(): BindableFunction
	const b = Instance.new("BindableFunction")
	function b.OnInvoke()
		return true
	end
	return b
end

function Http.new(address, token, options)
	const self = {}
	const opts = options :: HttpOptions<string>
	opts.root  = options.root == nil and "" or options.root :: string
	self.options = opts
	self.address = address
	self.token = token
	self.Middleware = bind()
	self.MiddlewareResponse = bind()
	return setmetatable(self, Http)
end

function Http:PostAsync(req, body, guarantee)
	return http_handler(self, "POST", req, body, guarantee)
end

function Http:PutAsync(req, body, guarantee)
	return http_handler(self, "PUT", req, body, guarantee)
end

function Http:GetAsync(req, guarantee)
	return http_handler(self, "GET", req, nil, guarantee)
end

function Http:DeleteAsync(req, guarantee)
	return http_handler(self, "DELETE", req, nil, guarantee)
end

return Http
