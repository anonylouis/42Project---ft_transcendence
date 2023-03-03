#!/bin/bash

cp .env.default ./.env
HOST=$(hostname -s)

sed "s/HOSTNAME_SED/${HOST}/" -i ./.env
cp .env ./react/tools/.
cp .env ./nginx/tools/.
