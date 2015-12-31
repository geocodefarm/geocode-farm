# GEOCODE-FARM

> addresses geocoding from and for postgresql data

## Introduction

From postgresql database, use [geocode.farm](https://geocode.farm) to geocode french postal addresses.

## Requirements

* use `http` instead of `https` to speed up requesting.
* set any country for DOM-TOM
* update if needed columns `address`, `postal_code` and `city`
* call api only for rows where `geocoded` is `0`
* set `farmed` column to 1 if POI was forwarded with geocode.farm
* set `geocoded` column to 1 if POI was geocoded

## Config

* `postgres` - database connection
* `query` - sql query to fetch rows to parse

*Note* Rewrite codebase according your neeeds.

## postresql

## Check database connection

```sh
psql -U username -d dbname -h 127.0.0.1 -p 5432
```

### Dump

```sh
 pg_dump dbname -t tablename > filename.sql
```

### Import

```sh
psql -U username -d dbname  -f file_to_import.sql
```

## Geocoding management and monitoring

[Goodbye node-forever, hello PM2](http://devo.ps/blog/goodbye-node-forever-hello-pm2/)

```sh
npm i -g pm2
# start with `farm` name
pm2 start index.js --name "farm" --log-date-format="YYYY-MM-DD HH:mm"
# Describing process
pm2 show farm
# Display logs
pm2 logs farm
# clean logs
pm2 flush farm
# stop
pm2 stop farm
# kill
pm2 kill farm
```
