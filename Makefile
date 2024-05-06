lint-frontend:
	make -C frontend lint

install:
	npm ci && make -C frontend install

start-frontend:
	cd frontend && npm start

start-backend:
	npx start-server

start:
	make start-backend

develop:
	make start-backend & make start-frontend

build:
	rm -rf frontend/build
	npm run build