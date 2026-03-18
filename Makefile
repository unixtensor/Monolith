.PHONY: rojo

setup:
	cd web && pnpm install
	go mod download

clean:
	rm -rf ./web/dist
	rm ./monolith_server

web:
	rm -rf ./web/dist
	cd web && pnpm install
	cd web && pnpm run build

rojo:
	rojo sourcemap > sourcemap.json

server:
	CGO_ENABLED=0 GOOS=linux go build -o monolith_server ./cmd/monolith

docker-web:
	docker build ./web -t monolith

docker-server:
	docker build . -t monolith_server
