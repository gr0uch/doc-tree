# Commands
COMPILE_CMD = node_modules/.bin/babel
LINT_CMD = node_modules/.bin/eslint

# Directories
LIB_DIR = lib/
DIST_DIR = dist/
TEST_DIR = test/

.PHONY: all compile-lib compile-test clean lint

all: compile-lib compile-test

lint:
	$(LINT_CMD) $(LIB_DIR) $(TEST_DIR)

compile-lib:
	mkdir -p $(DIST_DIR)$(LIB_DIR)
	$(COMPILE_CMD) --optional runtime $(LIB_DIR) \
		--out-dir $(DIST_DIR)$(LIB_DIR)

compile-test:
	mkdir -p $(DIST_DIR)$(TEST_DIR)
	cp -rf $(TEST_DIR)fixtures/ $(DIST_DIR)$(TEST_DIR)
	$(COMPILE_CMD) --optional runtime $(TEST_DIR)index.js \
		--out-file $(DIST_DIR)$(TEST_DIR)index.js

clean:
	rm -rf $(DIST_DIR)
