# @umac-js/notes

## 2.2.0

### Minor Changes

- Release version 2.2.0

## 2.1.0

### Minor Changes

- add `move` method and `move` command: move a note to a target folder
- add `rename` method and `rename` command: rename notes and folders
- `get()` now returns the note `body` (HTML) and `plaintext` content
- fix escaping of double quotes and backslashes in note and folder names (`rm`, `rmFolder`)
- fix `add` / `addFolder` scripts that were missing the AppleScript `then` keyword
