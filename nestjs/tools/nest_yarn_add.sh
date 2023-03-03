#!/bin/bash

yarn
yarn upgrade --latest

rm -rf prisma/migrations
yarn prisma migrate dev <<_EOF_

_EOF_
yarn prisma db seed

exec "$@"
