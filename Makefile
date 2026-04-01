.PHONY: help format tb-up tb-down dev clean worker-dev app-dev install

TB_DATA_FILE := tb-data/0_0.tigerbeetle

.DEFAULT_GOAL := help

help:
	@echo "SmolBank - Available Commands:"
	@echo "  make install  : Install all dependencies (Frontend and Backend)"
	@echo "  make dev      : Start everything (TigerBeetle, Worker, and SvelteKit)"
	@echo "  make tb-up    : Start only TigerBeetle"
	@echo "  make clean    : Delete database and wrangler"

install:
	@echo "Installing Monorepo dependencies..."
	npm install

format:
	@if [ ! -f $(TB_DATA_FILE) ]; then \
		echo "Formatting TigerBeetle volume..."; \
		mkdir -p tb-data; \
		docker run --rm --privileged -v $$(pwd)/tb-data:/data ghcr.io/tigerbeetle/tigerbeetle format --cluster=0 --replica=0 --replica-count=1 /data/0_0.tigerbeetle; \
	fi

tb-up: format
	@echo "Starting TigerBeetle..."
	docker compose up -d

tb-down:
	@echo "Stopping TigerBeetle..."
	docker compose down

worker-dev:
	cd api && npm run dev

app-dev:
	cd app && npm run dev

dev: tb-up
	@echo "Starting Cloudflare Worker and SvelteKit 5 in parallel..."
	@$(MAKE) -j 2 worker-dev app-dev

clean: tb-down
	@echo "Cleaning local data..."
	rm -rf tb-data
	rm -rf api/.wrangler
	rm -rf app/.wrangler
