# umac

[![Web](https://img.shields.io/badge/Web-grey?style=for-the-badge&logoColor=white)](https://pigeonposse.com)
[![About Us](https://img.shields.io/badge/About%20Us-grey?style=for-the-badge&logoColor=white)](https://pigeonposse.com/about)
[![Donate](https://img.shields.io/badge/Donate-pink?style=for-the-badge&logoColor=white)](https://pigeonposse.com/contribute)
[![Twitter](https://img.shields.io/badge/Twitter-black?style=for-the-badge&logoColor=white&logo=twitter)](https://twitter.com/pigeonposse_)
[![Instagram](https://img.shields.io/badge/Instagram-black?style=for-the-badge&logoColor=white&logo=instagram)](https://www.instagram.com/pigeon.posse/)
[![Medium](https://img.shields.io/badge/Medium-black?style=for-the-badge&logoColor=white&logo=medium)](https://medium.com/@pigeonposse)

[![BANNER](https://github.com/angelespejo/umac/blob/main/docs/public/banner.png?raw=true)](https://github.com/angelespejo/umac)

[![License](https://img.shields.io/github/license/pigeonposse/umac?style=for-the-badge&color=green&logoColor=white)](/LICENSE)
[![Version](https://img.shields.io/npm/v/umac?style=for-the-badge&color=blue&label=Version)](https://www.npmjs.com/package/umac)

Terminal utilities for MacOS

## Table of contents

- [🍎 umac (toolkit)](#-umac-toolkit)
- [🗝 Prerequesites](#-prerequesites)
- [🟢 JavaScript / Typescript library](#-javascript--typescript-library)
- [🔑 Installation](#-installation)
- [⚙️ Usage](#-usage)
  - [Apps](#apps)
    - [Install](#install)
    - [Uninstall](#uninstall)
    - [Search](#search)
    - [Unidentified apps](#unidentified-apps)
    - [Close](#close)
  - [Cache](#cache)
    - [Open cache Directory in Finder](#open-cache-directory-in-finder)
    - [Remove](#remove)
  - [Open](#open)
    - [Examples](#examples)
  - [Desktop](#desktop)
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
  - [Workflow](#workflow)
  - [Appearance](#appearance)
    - [Dark mode](#dark-mode)
    - [Color](#color)
- [☑️ TO DO](#-to-do)
- [➕ More](#-more)
- [👨‍💻 Development](#-development)
- [❤️ Donate](#-donate)
- [📜 License](#-license)
- [✨ About us](#-about-us)


## 🍎 umac (toolkit)

[Read more](https://github.com/angelespejo/umac)

## 🗝 Prerequesites

Have a system based on **DarwinOS**, that is, any **Apple** computer 🍎

## 🟢 JavaScript / Typescript library 

> Now You can use `umac` on your **JS** / **TS** project


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

### Cache

```bash
umac cache --help
```

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

### Interact / Interacting

```bash
umac interacting --help
# or (short command)
umac interact -h
```

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
umac spotlight--help
```

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

### Workflow

MacOS Workflow utils

```bash
umac workflow --help
# or (short command)
umac wf -h
```

### Appearance

MacOS Appearance utils

```bash
umac appearance --help
```

#### Dark mode

```bash
umac appearance dark-mode --help
```

#### Color

```bash
umac appearance color --help
```

## ☑️ TO DO

- [Read more](https://github.com/angelespejo/umac/blob/main/docs/todo/v2.md)
## ➕ More

- 🍎 [Umac](https://github.com/angelespejo/umac/tree/main/packages/umac)
- ⚒️ [Utils](https://github.com/angelespejo/umac/tree/main/packages/utils)
- 🔌 [Plugins](https://github.com/angelespejo/umac/tree/main/packages/plugin)
  - [App](https://github.com/angelespejo/umac/tree/main/packages/plugin/app)
  - [Cache](https://github.com/angelespejo/umac/tree/main/packages/plugin/cache)
  - [Finder](https://github.com/angelespejo/umac/tree/main/packages/plugin/finder)
  - [Appearance](https://github.com/angelespejo/umac/tree/main/packages/plugin/appearance)
  - [Desktop](https://github.com/angelespejo/umac/tree/main/packages/plugin/desktop)
  - [Interacting](https://github.com/angelespejo/umac/tree/main/packages/plugin/interacting)
  - [Open](https://github.com/angelespejo/umac/tree/main/packages/plugin/open)
  - [Run](https://github.com/angelespejo/umac/tree/main/packages/plugin/run)
  - [Spotlight](https://github.com/angelespejo/umac/tree/main/packages/plugin/spotlight)
  - [System](https://github.com/angelespejo/umac/tree/main/packages/plugin/system)
  - [Terminal](https://github.com/angelespejo/umac/tree/main/packages/plugin/terminal)
  - [Workflow](https://github.com/angelespejo/umac/tree/main/packages/plugin/workflow)


---

## 👨‍💻 Development

__umac__ is an open-source project and its development is open to anyone who wants to participate.

[![Issues](https://img.shields.io/badge/Issues-grey?style=for-the-badge)](https://github.com/angelespejo/umac/issues)
[![Pull requests](https://img.shields.io/badge/Pulls-grey?style=for-the-badge)]({{const.pkg.repository.url}}/pulls)
[![Read more](https://img.shields.io/badge/Read%20more-grey?style=for-the-badge)]({{const.pkg.homepage}})

## ❤️ Donate

Help us to develop more interesting things.

[![Donate](https://img.shields.io/badge/Donate-grey?style=for-the-badge)](https://pigeonposse.com/contribute)

## 📜 License

This software is licensed with __[GPL-3.0](https://github.com/angelespejo/umac/blob/main/LICENSE)__.

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
                                                                                        
                                                                                        
                                                                                        
█████╗█████╗█████╗█████╗█████╗█████╗█████╗                                              
╚════╝╚════╝╚════╝╚════╝╚════╝╚════╝╚════╝                                              
                                                                                        
                                                                                        
                                                                                        
██╗   ██╗███╗   ███╗ █████╗  ██████╗                                                    
██║   ██║████╗ ████║██╔══██╗██╔════╝                                                    
██║   ██║██╔████╔██║███████║██║                                                         
██║   ██║██║╚██╔╝██║██╔══██║██║                                                         
╚██████╔╝██║ ╚═╝ ██║██║  ██║╚██████╗                                                    
 ╚═════╝ ╚═╝     ╚═╝╚═╝  ╚═╝ ╚═════╝                                                    
                                                                                        
- Author: [Angelo](https://github.com/angelespejo)



-->

