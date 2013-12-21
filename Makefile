JS = $$(find index.js ./lib ./test ./benchmark -name '*.js')

test: validate
	@./node_modules/.bin/mocha test --reporter dot

clean:
	@rm -fr node_modules

benchmark:
	@node benchmark/index.js

validate:
	@jshint --config .jshintrc $(JS)

coverage:
	@rm -fr ./lib-cov
	@jscoverage ./lib ./lib-cov
	@-TEST_COVERAGE=1 ./node_modules/.bin/mocha --reporter html-cov > ./lib-cov/index.html

.PHONY: distclean test benchmark validate coverage
