
all:
	sh set_env.sh
	docker-compose up --build

setup:
	sh set_env.sh

build:
	cp .env react/tools/.env
	docker-compose build

back:
	docker-compose run --name=nestjs -p 3334:3000 -p 5555:5555 -p 8001:8001 nestjs

diveinback:
	docker exec -ti nestjs bash

front:
	docker-compose run --name=react -p 5173:5173 react

diveinfront:
	docker exec -ti react bash

down:
	docker-compose down

ps:
	docker-compose ps -a

vps:
	docker volume ls

clean:
	docker system prune -a
	docker volume rm ft_transcendence_pg_data
	rm -rf data/
	docker system df
