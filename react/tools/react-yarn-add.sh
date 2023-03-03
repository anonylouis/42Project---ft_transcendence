#!/bin/bash

sed "s/VITE_HOSTNAME/${VITE_HOSTNAME}/g" -i /usr/src/app/ft_transcendence/vite.config.ts
sed "s/VITE_FRONT_PORT/${VITE_FRONT_PORT}/g" -i /usr/src/app/ft_transcendence/vite.config.ts
sed "s/VITE_PROXY_PORT/${VITE_PROXY_PORT}/g" -i /usr/src/app/ft_transcendence/vite.config.ts

yarn

yarn upgrade --latest

exec "$@"
