#!/bin/bash

case $1 in

  db:refresh)
    echo "about to rewrite db";
    dropdb --host=127.0.0.1 --port=5432 -e -U postgres cend;
    createdb --host=127.0.0.1 --port=5432 -e -U postgres -O postgres cend;
    psql --host=127.0.0.1 --port=5432 -U postgres -d cend -a -f database.sql;
    ;;

  *)
    echo "unknown"
    ;;
esac