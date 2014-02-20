JS = $$(find index.js ./lib ./test/index.js ./benchmark -name '*.js')

test: validate buildtest
	@./node_modules/karma/bin/karma start
	@./node_modules/.bin/mocha test --reporter dot

clean:
	@rm -f ./test/build.js
	@rm -fr ./node_modules
	@rm -fr ./lib-cov

buildtest:
	@./node_modules/.bin/browserify -d ./test/index.js > ./test/build.js

benchmark:
	@node benchmark/index.js

validate:
	@jshint --config .jshintrc $(JS)

coverage:
	@rm -fr ./lib-cov
	@./node_modules/.bin/istanbul instrument -o ./lib-cov ./lib
	@AK_EVENTEMITTER_TEST_COVERAGE=1 ./node_modules/.bin/browserify -d ./test/index.js -t envify > ./test/build.js
	@AK_EVENTEMITTER_TEST_COVERAGE=1 ./node_modules/karma/bin/karma start karma-coverage.conf.js --browsers Chrome
	@AK_EVENTEMITTER_TEST_COVERAGE=1 ./node_modules/karma/bin/karma start karma-coverage.conf.js --browsers Firefox
	@AK_EVENTEMITTER_TEST_COVERAGE=1 ./node_modules/karma/bin/karma start karma-coverage.conf.js --browsers Safari

.PHONY: clean test buildtest benchmark validate coverage
