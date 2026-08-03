# umac

[![Web](https://img.shields.io/badge/Web-grey?style=for-the-badge&logoColor=white)](https://pigeonposse.com)
[![About Us](https://img.shields.io/badge/About%20Us-grey?style=for-the-badge&logoColor=white)](https://pigeonposse.com/about)
[![Donate](https://img.shields.io/badge/Donate-pink?style=for-the-badge&logoColor=white)](https://pigeonposse.com/contribute)
[![Twitter](https://img.shields.io/badge/Twitter-black?style=for-the-badge&logoColor=white&logo=twitter)](https://twitter.com/pigeonposse_)
[![Instagram](https://img.shields.io/badge/Instagram-black?style=for-the-badge&logoColor=white&logo=instagram)](https://www.instagram.com/pigeon.posse/)
[![Medium](https://img.shields.io/badge/Medium-black?style=for-the-badge&logoColor=white&logo=medium)](https://medium.com/@pigeonposse)

[![BANNER](https://github.com/angelespejo/umac//blob/main/docs/public/banner.png?raw=true)](https://github.com/angelespejo/umac)

[![License](https://img.shields.io/github/license/pigeonposse/umac?style=for-the-badge&color=green&logoColor=white)](/LICENSE)
[![Version](https://img.shields.io/npm/v/umac?style=for-the-badge&color=blue&label=Version)](https://www.npmjs.com/package/umac)


Terminal utilities for MacOS: install apps, force close apps, clear cache, add desk notifications, change shell, etc.

## Table of contents

- [What can we do with `umac`?](#what-can-we-do-with-umac)
- [🗝 Prerequisites](#-prerequisites)
- [🚀 Quick start](#-quick-start)
  - [JavaScript / TypeScript library](#javascript--typescript-library)
  - [CLI](#cli)
  - [Use Executable](#use-executable)
- [🔑 Installation](#-installation)
- [⚙️ Usage](#-usage)
  - [Apps](#apps)
    - [Install](#install)
    - [Uninstall](#uninstall)
    - [Search](#search)
    - [Unidentified apps](#unidentified-apps)
    - [Close](#close)
    - [List](#list)
  - [Cache](#cache)
    - [Open cache Directory in Finder](#open-cache-directory-in-finder)
    - [Remove](#remove)
  - [Open](#open)
    - [Examples](#examples)
  - [Desktop](#desktop)
    - [Remove](#remove)
    - [Change](#change)
    - [Add](#add)
  - [Interact / Interacting](#interact--interacting)
    - [Notification](#notification)
    - [Dialog](#dialog)
    - [Alert](#alert)
    - [Say](#say)
    - [Prompt](#prompt)
  - [Terminal](#terminal)
    - [Change](#change)
    - [List](#list)
    - [Current](#current)
  - [Spotlight](#spotlight)
  - [Run](#run)
    - [jxa](#jxa)
    - [osascript](#osascript)
    - [JS or TS](#js-or-ts)
    - [bash](#bash)
    - [Python](#python)
  - [System](#system)
    - [Update](#update)
    - [Shutdown](#shutdown)
    - [Reboot](#reboot)
    - [Hardware](#hardware)
    - [Version](#version)
  - [Finder](#finder)
    - [Close](#close)
    - [Reload](#reload)
    - [Dotfiles](#dotfiles)
  - [Workflow](#workflow)
    - [List](#list)
    - [Copy](#copy)
    - [Open dir](#open-dir)
    - [Open](#open)
    - [New](#new)
  - [Appearance](#appearance)
    - [Dark mode](#dark-mode)
    - [Color](#color)
  - [Disk](#disk)
    - [List](#list)
    - [Space](#space)
    - [Info](#info)
    - [Eject](#eject)
  - [Messages](#messages)
    - [Open](#open)
    - [Send](#send)
    - [List](#list)
    - [Read messages](#read-messages)
    - [Services](#services)
  - [Notes](#notes)
    - [Open](#open)
    - [Open new](#open-new)
    - [Add](#add)
    - [Remove](#remove)
    - [Add folder](#add-folder)
    - [Remove folder](#remove-folder)
    - [Move](#move)
    - [Rename](#rename)
    - [Exists](#exists)
    - [List](#list)
  - [Shortcuts](#shortcuts)
    - [Open](#open)
    - [List](#list)
    - [Run](#run)
    - [View](#view)
- [☑️ TO DO](#-to-do)
- [➕ More](#-more)
- [👨‍💻 Development](#-development)
- [❤️ Donate](#-donate)
- [📜 License](#-license)
- [✨ About us](#-about-us)


## What can we do with `umac`?

[![HELP](https://github.com/angelespejo/umac/blob/main/docs/public/help.png?raw=true)](https://github.com/angelespejo/umac)

- Set dialogs
- Set notifications
- Set voice messages
- open files & URLs
- Close apps
- Clear cache
- Install apps
- Change terminal shell
- Add workflows 
- Run scripts
- ...

## 🗝 Prerequisites

- A system based on **DarwinOS**, that is, any **Apple** computer 🍎

## 🚀 Quick start

### JavaScript / TypeScript library

You can also use `umac` as a **JS** / **TS** library directly in your project.

### CLI

Quickly run the command line with:

```bash
npx umac <command> [...flags]
```

### Use Executable

You can download the binary directly from the [releases](https://github.com/angelespejo/umac/releases) section



## 🔑 Installation

```bash 
npm install umac
# or
pnpm install umac
# or
yarn add umac
# or
bun add umac
# or
deno add umac
```

## ⚙️ Usage

```bash
umac [option/s] [--flags/s]
```

```bash
umac [option/s] [--flags/s] --help
```

With **umac** you can do many different things. The idea could be to add more and more, who knows 😎

Here is a list of how to use **umac** 

### Apps


```bash
umac app --help
```

> ℹ️  You can also use [umac/app](https://github.com/angelespejo/umac/tree/main/packages/plugin/app) independently.

#### Install

Install apps using ```Homebrew```. 

> Don't worry if ```Homebrew``` is not installed on your system, **umac** should do it for you automatically 🔮

```bash
umac app install appName1 appName2
# or
umac app i appName1 appName2
```

#### Uninstall

Uninstall apps using ```Homebrew```.

```bash
umac app uninstall appName1 appName2
# or
umac app u appName1 appName2
```

#### Search

Search apps in HomeBrew.

```bash
umac app search appName
# or
umac app s appName
```

#### Unidentified apps

```bash
umac app undev --help
```

Change or show status for unidentificated apps.

Show status for no identificated apps

```bash
umac app undev 
```

Change status for no identificated apps

```bash
umac app dev --enable
```

```bash
umac app dev --disable
```

#### Close

```bash
umac app close --help
```

##### Examples

Close apps from a list

```bash
umac app close --ask
```

Close all apps

```bash
umac app close '*'
```

Close specific apps

```bash
umac app close app1 app2
```

Close all apps that contains avast name

```bash
umac app close "*Avast*"
```

#### List

List system apps.

```bash
umac app list
# or
umac app list '!Avast*' '!*.avast*'
```

### Cache

```bash
umac cache --help
```

> ℹ️  You can also use [umac/cache](https://github.com/angelespejo/umac/tree/main/packages/plugin/cache) independently.

#### Open cache Directory in Finder

```bash
umac cache open
```

#### Remove

Remove macOS cache from a list.

```bash
umac cache rm
```

### Open

```bash
umac open --help
```

> ℹ️  You can also use [umac/open](https://github.com/angelespejo/umac/tree/main/packages/plugin/open) independently.

#### Examples

```bash
# Open path in Finder or URL in default browser.
umac open {URL/path} 
# Open in Safari
umac open {URL/path} --safari 
# Open in Firefox
umac open {URL/path} --firefox 
# Open in Chrome
umac open {URL/path} --chrome 
# Open in Visual Studio Code
umac open {path} --vscode 
# ...

```

### Desktop 

```bash
umac desktop --help
# or (short command)
umac desk -h
```

> ℹ️  You can also use [umac/desktop](https://github.com/angelespejo/umac/tree/main/packages/plugin/desktop) independently.

#### Remove

Remove Desktop image.

```bash
umac desktop remove
# or
umac desktop remove imageName
```

#### Change

Change the Desktop image in the desktop pictures directory.

```bash
umac desktop change imagePath
```

#### Add

Add a Desktop image to the desktop pictures directory.

```bash
umac desktop add imagePath
# or
umac desktop add imagePath --dir
# or
umac desktop add imagePath --sys
```


### Interact / Interacting

```bash
umac interacting --help
# or (short command)
umac interact -h
```

> ℹ️  You can also use [umac/interacting](https://github.com/angelespejo/umac/tree/main/packages/plugin/interacting) independently.

#### Notification  

Set a macOS notification  

```bash
umac interact notification --help
```

#### Dialog  

Set a macOS dialog  

```bash
umac interact dialog --help
```

#### Alert  

Set a macOS alert  

```bash
umac interact alert --help
```

#### Say  

Display voice message  

```bash
umac interact say --help
```

#### Prompt  

Set custom prompts like text, choices, files, color, etc.  

```bash
umac interact prompt --help
```


### Terminal

```bash
umac terminal --help
# or (short command)
umac term --help
```

> ℹ️  You can also use [umac/terminal](https://github.com/angelespejo/umac/tree/main/packages/plugin/terminal) independently.

#### Change
Change shell.

```bash
umac terminal shell change
```

#### List

List available shells.

```bash
umac terminal shell list
```

#### Current

View current shell.

```bash
umac terminal shell current
```

### Spotlight

MacOS Spotlight utils

```bash
umac spotlight --help
```

> ℹ️  You can also use [umac/spotlight](https://github.com/angelespejo/umac/tree/main/packages/plugin/spotlight) independently.

To see Spotlight status.

```bash
umac spotlight <path>
```

To enable Spotlight.

```bash
umac spotlight --enable
```


To disable Spotlight.

```bash
umac spotlight --disable
```

Toggle Spotlight status.

```bash
umac spotlight --toggle
```

### Run

Run multiple language scripts (applescript, jxa, osascript, python, js, bash etc)

```bash
umac run --help
```

> ℹ️  You can also use [umac/run](https://github.com/angelespejo/umac/tree/main/packages/plugin/run) independently.

#### jxa

Run jxa file script

```bash
umac run jxa --help
```

#### osascript

Run osascript file script

```bash
umac run osascript --help
```

#### JS or TS

Run js|ts file script

```bash
umac run node|js|ts --help
```

#### bash

Run bash file script

```bash
umac run bash --help
```

#### Python

Run python file script

```bash
umac run python --help
```

### System

Run multiple language scripts (applescript, jxa, osascript, python, js, bash etc)

```bash
umac system --help
# or (short command)
umac sys -h
```

> ℹ️  You can also use [umac/system](https://github.com/angelespejo/umac/tree/main/packages/plugin/system) independently.

#### Update

System updates

```bash
umac system update --help
# or (short command)
umac sys up -h
```

#### Shutdown

Close down the system at a given time

```bash
umac system shutdown --help
# or (short command)
umac sys down -h
```

#### Reboot

Reboot system

```bash
umac system reboot --help
# or (short command)
umac sys reboot -h
```

#### Hardware

Show hardware information

```bash
umac system hardware --help
# or (short command)
umac sys hardware -h
```

#### Version

Show system version

```bash
umac system version --help
# or (short command)
umac sys version -h
```

### Finder

MacOS Finder utils

```bash
umac finder --help
```

> ℹ️  You can also use [umac/finder](https://github.com/angelespejo/umac/tree/main/packages/plugin/finder) independently.

#### Close

Close all Finder windows and force exit from Finder.

```bash
umac finder close
```

#### Reload

Reload Finder.

```bash
umac finder reload
```

#### Dotfiles

Show, hide or toggle dotfiles visibility.

```bash
umac finder dotfiles
# or
umac finder dotfiles --toggle
# or
umac finder dotfiles --enable
# or
umac finder dotfiles --disable
```

### Workflow

MacOS Workflow utils

```bash
umac workflow --help
# or (short command)
umac wf -h
```

> ℹ️  You can also use [umac/workflow](https://github.com/angelespejo/umac/tree/main/packages/plugin/workflow) independently.

#### List

Lists all available workflows in the services directory.

```bash
umac workflow list
```

#### Copy

Copies all workflows to the specified directory.

```bash
umac workflow copy --output <dir>
```

#### Open dir

Opens the services directory in the file explorer.

```bash
umac workflow open-dir
```

#### Open

Prompts the user to select and open a workflow with Automator.

```bash
umac workflow open
```

#### New

Opens a new project in Automator.

```bash
umac workflow new
```

### Appearance

MacOS Appearance utils

```bash
umac appearance --help
```

> ℹ️  You can also use [umac/appearance](https://github.com/angelespejo/umac/tree/main/packages/plugin/appearance) independently.

#### Dark mode

Dark mode utilities. Toggle, set, get...

```bash
umac appearance dark-mode
# or
umac appearance dark-mode --toggle
# or
umac appearance dark-mode --enable
# or
umac appearance dark-mode --disable
```

#### Color

Color utilities. Like accent, highlight...

```bash
umac appearance color
# or
umac appearance color accent
# or
umac appearance color highlight
```

### Disk

MacOS Disk utils

```bash
umac disk --help
```

> ℹ️  You can also use [umac/disk](https://github.com/angelespejo/umac/tree/main/packages/plugin/disk) independently.

#### List

List disks and their partitions.

```bash
umac disk list
# or
umac disk list --res=json
```

#### Space

Show disk space usage.

```bash
umac disk space
# or
umac disk space --res=json
```

#### Info

Show detailed info about a disk or volume.

```bash
umac disk info /dev/disk0
```

#### Eject

Eject a disk or volume.

```bash
umac disk eject disk3s1
```

### Messages

MacOS Messages.app utils

```bash
umac messages --help
```

> ℹ️  You can also use [umac/messages](https://github.com/angelespejo/umac/tree/main/packages/plugin/messages) independently.

#### Open

Open the Messages app.

```bash
umac messages open
```

#### Send

Send a message to a buddy handle or a chat id.

```bash
umac messages send -t "angel@pigeonposse.com" -m "Hola!"
# or
umac messages send -t "iMessage;-;angel@pigeonposse.com" -m "Hola!"
```

#### List

List the currently open chats.

```bash
umac messages list
# or
umac messages list --name "Work"
# or
umac messages list --participants "angelo@pigeonposse.com"
```

#### Read messages

Read the messages of a chat.

```bash
umac messages messages "iMessage;-;angelo@pigeonposse.com"
# or
umac messages messages "iMessage;-;angelo@pigeonposse.com" --limit 10
```

#### Services

List the services configured in Messages.

```bash
umac messages services
```

### Notes

MacOS Notes utils

```bash
umac notes --help
```

> ℹ️  You can also use [umac/notes](https://github.com/angelespejo/umac/tree/main/packages/plugin/notes) independently.

#### Open

Open Apple Notes app or focus a specific note.

```bash
umac notes open
# or
umac notes open "Ideas"
```

#### Open new

Create and focus a new blank note or a titled note in a folder path.

```bash
umac notes open-new
# or
umac notes open-new "Quick Note"
```

#### Add

Create a new note (creates parent folders if missing).

```bash
umac notes add "Shopping List"
# or
umac notes add "Work" "Projects" "Q1 Roadmap"
```

#### Remove

Remove a note by title or path.

```bash
umac notes remove "Shopping List"
# or
umac notes remove "Work" "Projects" "Q1 Roadmap"
```

#### Add folder

Create a new folder or nested subfolders hierarchy.

```bash
umac notes add-folder "Work"
# or
umac notes add-folder "Work" "Projects" "2026"
```

#### Remove folder

Remove a folder or nested folder path.

```bash
umac notes remove-folder "Work" "Old Projects"
# or
umac notes remove-folder "Work" "Drafts" --only-notes
```

#### Move

Move a note to a target folder.

```bash
umac notes move "Shopping List" --to "Work"
```

#### Rename

Rename a note or folder.

```bash
umac notes rename "Shopping List" --name "Groceries"
```

#### Exists

Check if a note or folder exists.

```bash
umac notes exists "Work"
# or
umac notes exists "Work" "Projects" "Q1 Roadmap"
```

#### List

List all notes with their metadata.

```bash
umac notes list
# or
umac notes list --name "Meeting"
# or
umac notes list --folder "Work" "Projects"
```

### Shortcuts

MacOS Shortcuts utils

```bash
umac shortcuts --help
```

> ℹ️  You can also use [umac/shortcuts](https://github.com/angelespejo/umac/tree/main/packages/plugin/shortcuts) independently.

#### Open

Open the Shortcuts app.

```bash
umac shortcuts open
```

#### List

List shortcuts or folders.

```bash
umac shortcuts list
# or
umac shortcuts list --folder "My Folder"
# or
umac shortcuts list --folders
```

#### Run

Run a shortcut.

```bash
umac shortcuts run "My Shortcut"
# or
umac shortcuts run "Resize Image" -i "photo.jpg" -o "resized.jpg"
```

#### View

View a shortcut in the Shortcuts app.

```bash
umac shortcuts view "My Shortcut"
```

## ☑️ TO DO

- [Read more](https://github.com/angelespejo/umac/blob/main/docs/todo/v2.md)
## ➕ More

- ⚒️ [Utils](https://github.com/angelespejo/umac/tree/main/packages/utils)
- 🍎 [Umac](https://github.com/angelespejo/umac/tree/main/packages/umac)
- 🔌 [Plugins](https://github.com/angelespejo/umac/tree/main/packages/plugin)
  - [Appearance](https://github.com/angelespejo/umac/tree/main/packages/plugin/appearance)
  - [Cache](https://github.com/angelespejo/umac/tree/main/packages/plugin/cache)
  - [Disk](https://github.com/angelespejo/umac/tree/main/packages/plugin/disk)
  - [Finder](https://github.com/angelespejo/umac/tree/main/packages/plugin/finder)
  - [Interacting](https://github.com/angelespejo/umac/tree/main/packages/plugin/interacting)
  - [Messages](https://github.com/angelespejo/umac/tree/main/packages/plugin/messages)
  - [App](https://github.com/angelespejo/umac/tree/main/packages/plugin/app)
  - [Desktop](https://github.com/angelespejo/umac/tree/main/packages/plugin/desktop)
  - [Notes](https://github.com/angelespejo/umac/tree/main/packages/plugin/notes)
  - [Open](https://github.com/angelespejo/umac/tree/main/packages/plugin/open)
  - [Run](https://github.com/angelespejo/umac/tree/main/packages/plugin/run)
  - [Spotlight](https://github.com/angelespejo/umac/tree/main/packages/plugin/spotlight)
  - [Shortcuts](https://github.com/angelespejo/umac/tree/main/packages/plugin/shortcuts)
  - [System](https://github.com/angelespejo/umac/tree/main/packages/plugin/system)
  - [Terminal](https://github.com/angelespejo/umac/tree/main/packages/plugin/terminal)
  - [Workflow](https://github.com/angelespejo/umac/tree/main/packages/plugin/workflow)


---

## 👨‍💻 Development

__umac__ is an open-source project and its development is open to anyone who wants to participate.

[![Issues](https://img.shields.io/badge/Issues-grey?style=for-the-badge)](https://github.com/angelespejo/umac/issues)
[![Pull requests](https://img.shields.io/badge/Pulls-grey?style=for-the-badge)]({{const.REPO_URL}}pulls)
[![Read more](https://img.shields.io/badge/Read%20more-grey?style=for-the-badge)]({{const.pkg.homepage}})

## ❤️ Donate

Help us to develop more interesting things.

[![Donate](https://img.shields.io/badge/Donate-grey?style=for-the-badge)](https://github.com/sponsors/angelespejo)

## 📜 License

This software is licensed with __[MIT](https://github.com/angelespejo/umac/blob/main/LICENSE)__.

[![Read more](https://img.shields.io/badge/Read-more-grey?style=for-the-badge)](https://github.com/angelespejo/umac/blob/main/LICENSE)

## ✨ About us

*PigeonPosse* is a __code development collective__ focused on creating practical and interesting tools that help developers and users enjoy a more agile and comfortable experience. Our projects cover various programming sectors and we do not have a thematic limitation in terms of projects.

[![More](https://img.shields.io/badge/Read-more-grey?style=for-the-badge)](https://github.com/pigeonposse)




---

[![Web](https://img.shields.io/badge/Web-grey?style=for-the-badge&logoColor=white)](https://pigeonposse.com)
[![About Us](https://img.shields.io/badge/About%20Us-grey?style=for-the-badge&logoColor=white)](https://pigeonposse.com/about)
[![Donate](https://img.shields.io/badge/Donate-pink?style=for-the-badge&logoColor=white)](https://pigeonposse.com/contribute)
[![Twitter](https://img.shields.io/badge/Twitter-black?style=for-the-badge&logoColor=white&logo=twitter)](https://twitter.com/pigeonposse_)
[![Instagram](https://img.shields.io/badge/Instagram-black?style=for-the-badge&logoColor=white&logo=instagram)](https://www.instagram.com/pigeon.posse/)
[![Medium](https://img.shields.io/badge/Medium-black?style=for-the-badge&logoColor=white&logo=medium)](https://medium.com/@pigeonposse)

<!--

██████╗ ██╗ ██████╗ ███████╗ ██████╗ ███╗   ██╗██████╗  ██████╗ ███████╗███████╗███████╗
██╔══██╗██║██╔════╝ ██╔════╝██╔═══██╗████╗  ██║██╔══██╗██╔═══██╗██╔════╝██╔════╝██╔════╝
██████╔╝██║██║  ███╗█████╗  ██║   ██║██╔██╗ ██║██████╔╝██║   ██║███████╗███████╗█████╗  
██╔═══╝ ██║██║   ██║██╔══╝  ██║   ██║██║╚██╗██║██╔═══╝ ██║   ██║╚════██║╚════██║██╔══╝  
██║     ██║╚██████╔╝███████╗╚██████╔╝██║ ╚████║██║     ╚██████╔╝███████║███████║███████╗
╚═╝     ╚═╝ ╚═════╝ ╚══════╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝      ╚═════╝ ╚══════╝╚══════╝╚══════╝
█████╗█████╗█████╗█████╗█████╗█████╗█████╗█████╗█████╗                                  
╚════╝╚════╝╚════╝╚════╝╚════╝╚════╝╚════╝╚════╝╚════╝                                  
██╗   ██╗███╗   ███╗ █████╗  ██████╗                                                    
██║   ██║████╗ ████║██╔══██╗██╔════╝                                                    
██║   ██║██╔████╔██║███████║██║                                                         
██║   ██║██║╚██╔╝██║██╔══██║██║                                                         
╚██████╔╝██║ ╚═╝ ██║██║  ██║╚██████╗                                                    
 ╚═════╝ ╚═╝     ╚═╝╚═╝  ╚═╝ ╚═════╝                                                    

- Author: [Angelo](https://github.com/angelespejo)



-->

