.PHONY: help build start stop restart logs clean install

help:  ## Display the help
	@echo ""
	@echo "Commands available :"
	@grep -E '^[a-zA-Z_-]+:.*?##' Makefile | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'
	@echo ""

build:  ## Build docker image
	docker compose build

start:  ## Start the container
	docker compose up -d

stop:  ## Stop the container
	docker compose down

restart:  ## Restart the container
	make stop
	make start

logs:  ## Display logs
	docker compose logs -f

clean:  ## Clean up docker images, containers, volumes, and networks
	docker system prune -af
	docker volume prune -f

install:  ## Install dependencies
	yarn install
