.PHONY: help format tb-up tb-down dev-local dev-docker clean install worker-dev frontend-dev

TB_DATA_FILE := tb-data/0_0.tigerbeetle

.DEFAULT_GOAL := help

help:
	@echo "SmolBank - Available Commands:"
	@echo "  make install     : Install dependencies locally on host"
	@echo "  make dev-local   : Run TigerBeetle in Docker, API and App natively on host"
	@echo "  make dev-docker  : Run EVERYTHING (TigerBeetle, API, App) inside Docker"
	@echo "  make clean       : Delete database and Docker volumes (keeps local node_modules safe!)"

install:
	@echo "Installing dependencies..."
	npm install

format:
	@if [ ! -f $(TB_DATA_FILE) ]; then \
		echo "Formatting TigerBeetle volume..."; \
		mkdir -p tb-data; \
		docker run --rm --privileged -v $$(pwd)/tb-data:/data ghcr.io/tigerbeetle/tigerbeetle format --cluster=0 --replica=0 --replica-count=1 /data/0_0.tigerbeetle; \
	fi

tb-up: format
	@echo "Starting TigerBeetle..."
	docker compose up -d tigerbeetle

tb-down:
	@echo "Stopping Docker containers..."
	docker compose down -v

worker-dev:
	cd api && npm run dev

frontend-dev:
	cd app && npm run dev

dev-local: tb-up
	@echo "Starting API and App locally..."
	@$(MAKE) -j 2 worker-dev frontend-dev

dev-docker: format
	@echo "Starting full stack in Docker..."
	docker compose up

clean: tb-down
	@echo "Cleaning workspace..."
	rm -rf tb-data
	rm -rf api/.wrangler
	rm -rf app/.svelte-kit
