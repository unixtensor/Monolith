package game

var Games = make(map[string]Game)

func Connected(gameId string) bool {
	_, ok := Games[gameId]
	return ok
}

func Connect(gameId string) {
	if Connected(gameId) {
		println("")
	}
	Games[gameId] = Game{}
}

func Disconnect(gameId string) {
	delete(Games, gameId)
}
