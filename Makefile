SHELL := /bin/bash

# Commands
COMPILE = node_modules/.bin/esdown
LINT = node_modules/.bin/eslint
MKDIRP = node_modules/.bin/mkdirp

# Directories
LIB = lib/
DIST = dist/
TEST = test/

.PHONY: all compile-lib compile-test clean lint

all: compile-lib compile-test

lint:
	$(LINT) $(LIB) $(TEST)

compile-lib:
	$(MKDIRP) $(DIST)$(LIB)
	for f in $(LIB)*; do \
		$(COMPILE) - $$f $(DIST)$$f -r -p; \
	done

compile-test:
	$(MKDIRP) $(DIST)$(TEST)
	for f in $(TEST)*; do \
		if ! [[ -d $$f ]]; then \
			$(COMPILE) - $$f $(DIST)$$f -r -p; \
		fi \
	done
	cp -rf $(TEST)fixtures $(DIST)$(TEST)

clean:
	rm -rf $(DIST)
