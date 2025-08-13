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

### Workflow

MacOS Workflow utils

```bash
umac workflow --help
# or (short command)
umac wf -h
```

> ℹ️  You can also use [umac/workflow](https://github.com/angelespejo/umac/tree/main/packages/plugin/workflow) independently.

### Appearance

MacOS Appearance utils

```bash
umac appearance --help
```

> ℹ️  You can also use [umac/appearance](https://github.com/angelespejo/umac/tree/main/packages/plugin/appearance) independently.

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
