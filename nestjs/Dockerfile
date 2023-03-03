FROM node:latest

WORKDIR /usr/src/app/ft_transcendence

COPY ./tools/. .

RUN apt-get update && apt-get install -y \
	apt-utils \
	vim \
	lsof

EXPOSE 3334 5555 8001

ENTRYPOINT ["bash", "nest_yarn_add.sh"]

CMD ["yarn", "start"]
