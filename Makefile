lint:
	make -C frontend lint

install:
	npm ci && make -C frontend install

publish:
	npm publish --dry-run

start-frontend:
	cd frontend && npm start

start-backend:
	npx start-server -s ./frontend/build

start:
	make start-backend && start-frontend

develop:
	make start-backend & make start-frontend

build:
	rm -rf frontend/build
	npm run build