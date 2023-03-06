
all:
	docker-compose up --build

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
