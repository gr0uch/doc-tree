# Changelog

**v0.8.2** (2015-04-02)
* Re-do CLI.
* Fix bug with import declaration.

**v0.7.1** (2015-04-01)
* Add support for variable assignment.
* Add `parse` method for those who don't like to use `new`.

**v0.6.1** (2015-04-01)
* Fix target for object assignment.
* Fix type for class method definitions.

**v0.5.3** (2015-03-29)
* Match more AST nodes.
* Collapse contiguous single-line comments as one comment.
* Include comments in the output that are not matched to a node, expose location.
* Remove restriction on line distance.

**v0.5.0** (2015-03-27)
* Upgrade packages.
* Refactor AST traversal.

**v0.4.0** (2015-03-05)
* Removed `path` since it may be misleading, replaced with `target`.
* Document object properties and static methods.
* Allow same line comment.

**v0.3.8** (2015-03-02)
* Use ESLint.
* Fix path to CLI. Thanks @emmenko!
* Bump package versions.

**v0.3.6** (2015-03-01)
* Bump package versions.

**v0.3.5** (2015-02-26)
* Use `make`, run tests on compiled library.
* Fix fatal error due to transpilation.
* Bump package versions.

**v0.3.3** (2015-02-21)
- Upgrade babel to `4.4.3`.
- Use `babel-runtime` and include it as a dependency.
- Output now renders line break before `EOF`.

**v0.3.0** (2015-02-17)
- Comments may only be matched to code that immediately follows it on the next line.
- Upgrade babel to `4.3.0`.

**v0.2.2** (2015-02-15)
- The property `kind` on the context is now omitted if the context is neither a getter nor setter.
