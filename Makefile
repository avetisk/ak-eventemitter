JS = $$(find index.js test benchmark -name '*.js')

install:
	@npm install

distclean:
	@rm -fr node_modules

test: validate
	@./node_modules/.bin/mocha test --reporter dot

benchmark:
	@node benchmark/index.js

validate:
	@jshint --config .jshintrc $(JS)

.PHONY: install distclean test benchmark validate
