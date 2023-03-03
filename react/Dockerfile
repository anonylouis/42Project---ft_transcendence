FROM node:latest

WORKDIR /usr/src/app/ft_transcendence

COPY ./tools/. .

RUN apt-get update && apt-get install -y \
	apt-utils \
	vim \
	lsof \
	curl

EXPOSE 3000 5173

ENTRYPOINT ["bash", "react-yarn-add.sh"]

CMD ["yarn", "run", "dev"]
