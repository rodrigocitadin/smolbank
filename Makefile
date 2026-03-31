.PHONY: help format tb-up tb-down dev clean

TB_DATA_FILE := tb-data/0_0.tigerbeetle

.DEFAULT_GOAL := help

help:
	@echo "Smolbank - Available Commands:"
	@echo "------------------------------------------------------------"
	@echo " make dev: 	Initializes everything (TB + CF Worker)"
	@echo " make tb-up: 	Starts only TigerBeetle in the background"
	@echo " make tb-down: 	Shuts down the TigerBeetle container"
	@echo " make clean: 	Deletes the database and local state"
	@echo " make format: 	Formats the TB disk (internal use)"
	@echo "------------------------------------------------------------"

format:
	@if [ ! -f $(TB_DATA_FILE) ]; then \
		echo "Formatting TigerBeetle's volume for the first time..."; \
		mkdir -p tb-data; \
		docker run --rm --privileged -v $$(pwd)/tb-data:/data ghcr.io/tigerbeetle/tigerbeetle format --cluster=0 --replica=0 --replica-count=1 /data/0_0.tigerbeetle; \
	else \
		echo "The TigerBeetle volume already exists. Skipping formatting."; \
	fi

tb-up: format
	@echo "Starting TigerBeetle via Docker Compose..."
	docker-compose up -d

tb-down:
	@echo "Taking down TigerBeetle..."
	docker-compose down

dev: tb-up
	@echo "Starting Cloudflare Worker..."
	npm run dev

clean: tb-down
	@echo "Clearing local data (TigerBeetle and Wrangler SQLite)..."
	rm -rf tb-data
	rm -rf .wrangler
	@echo "Everything clean!"
