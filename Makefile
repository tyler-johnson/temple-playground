BIN = ./node_modules/.bin
SRC = $(wildcard src/* src/*/*)
TEST = $(wildcard test/* test/*/*)

build: index.js cli.js dist/playground.min.js

index.js: src/index.js $(SRC)
	$(BIN)/rollup $< -c build/rollup.server.js > $@

cli.js: src/cli.js $(SRC)
	echo "#!/usr/bin/env node" > $@
	$(BIN)/rollup $< -c build/rollup.server.js >> $@
	chmod +x $@

dist:
	mkdir -p $@

dist/playground.js: src/client/index.html $(SRC) dist
	node build/client.js $< > $@

dist/playground.min.js: dist/playground.js
	$(BIN)/uglifyjs $< -mc warnings=false > $@

test.js: test/index.js $(TEST)
	$(BIN)/rollup $< -c build/rollup.server.js > $@

test: test.js
	node $<

clean:
	rm -rf index.js cli.js test.js dist/

.PHONY: build clean test
