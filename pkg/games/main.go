package game

type JobId = string
type PlaceId = string
type Servers = map[JobId]Game

type Game struct {
	Name      string `json:"Name" binding:"required"`
	CreatorId uint   `json:"CreatorId" binding:"required"`
	Instance  *Instance
}

var Games = make(map[PlaceId]Servers)

func (g *Game) Add(place_id PlaceId, job_id JobId) {
	_, ok := GetServers(place_id)
	if !ok {
		Games[place_id] = make(Servers)
	}
	Games[place_id][job_id] = *g
}

func GetServers(place_id PlaceId) (Servers, bool) {
	servers, ok := Games[place_id]
	return servers, ok
}

func GetGame(place_id PlaceId, job_id JobId) (Game, bool) {
	servers, servers_ok := GetServers(place_id)
	if !servers_ok {
		return Game{}, servers_ok
	}
	games, ok := servers[job_id]
	return games, ok
}

func Disconnect(place_id PlaceId) bool {
	_, ok := GetServers(place_id)
	if ok {
		delete(Games, place_id)
	}
	return ok
}
