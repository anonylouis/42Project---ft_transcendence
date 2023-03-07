all:
	docker-compose up --build -d
	@echo "Dockers ready"

stop:
	docker-compose down

check:
	docker-compose ps -a

clean:
	docker-compose down --rmi all -v
