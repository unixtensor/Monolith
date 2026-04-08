.PHONY: rojo

#setup the entire project
setup:
	cd web && pnpm install
	go mod download
	$(MAKE) rojo

#return the project to its base repo
clean:
	rm -r ./web/dist
	rm ./monolith_server
	rm ./sourcemap.json

web:
	rm -r ./web/dist
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

docker:
	docker compose up
