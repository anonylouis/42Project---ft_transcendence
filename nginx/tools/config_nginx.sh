#!/bin/bash

sed "s/VITE_HOSTNAME/${VITE_HOSTNAME}/g" -i /etc/nginx/sites-available/ft_transcendence.conf
sed "s/VITE_FRONT_PORT/${VITE_FRONT_PORT}/g" -i /etc/nginx/sites-available/ft_transcendence.conf
sed "s/VITE_API_PORT/${VITE_API_PORT}/g" -i /etc/nginx/sites-available/ft_transcendence.conf
sed "s/VITE_GATEWAY_PORT/${VITE_GATEWAY_PORT}/g" -i /etc/nginx/sites-available/ft_transcendence.conf

nginx -g "daemon off;"

exec "$@"
