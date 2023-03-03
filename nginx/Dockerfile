From debian:buster

WORKDIR /home/srcs/

COPY ./tools/. .

RUN apt-get update && apt-get install -y \
	nginx \
	openssl \
	vim \
	&& mkdir -p /etc/nginx/ssl \
	&& mv ft_transcendence.conf /etc/nginx/sites-available/ \
	&& mv ssl_key/ft_transcendence.key.pem /etc/nginx/ssl/ \
	&& mv ssl_key/ft_transcendence-x509.crt /etc/nginx/ssl/ \
	&& ln -s /etc/nginx/sites-available/ft_transcendence.conf /etc/nginx/sites-enabled/ \
	&& rm -f /etc/nginx/sites-enabled/default

EXPOSE 443

ENTRYPOINT ["bash", "config_nginx.sh"]
