#!/bin/bash

############################################################
# VARS                                               
############################################################

DESC="macOS utils for a fast development"
VERSION="1.0.0"

title(){ echo $( colored " ${1} " "bg-grey" "black"); }


############################################################
# VERSION                                                     
############################################################

Version(){

   echo "$(title "Version") $VERSION"

}


############################################################
# Help                                                     
############################################################

Help(){

   	# Display Help
	echo $(title "Description")
	echo 
	echo "  $DESC"
	echo 
	echo $(title "Syntax")
	echo 
	echo "  psh macos [ options | flags ]"
	echo
	echo $(title "Options")
	echo 
	echo "  $(title "Cache")"
	echo "  cache                   Remove macOS cache from a list"
	echo "  cache=All               Remove all macOS cache"
	echo "  cache=name1,name2       Remove specific macOS cache"
	echo "  cache --open            Open macOS cache directory with Finder"
	echo 
	echo "  $(title "Close")"
	echo "  close                   Force close apps from a list"
	echo "  close=All               Force close all apps"
	echo "  close=app1,app2         Force close specific apps"
	echo 
	echo "  $(title "Open")"
	echo "  open [path]             Open path in Finder"
	echo "  open [path] --safari    Open path in Safari"
	echo "  open [path] --firefox   Open path in Firefox"
	echo "  open [path] --chrome    Open path in Chrome"
	echo "  open [path] --opera     Open path in Opera"
	echo "  open [path] --tor       Open path in Tor Browser"
	echo 
	echo "  $(title "workflows")"
	echo "  workflow list           List all workflows"
	echo "  workflow new            Open new workflow with Automator"
	echo "  workflow open           Open workflow with Automator"
	echo "  workflow open-dir       Open workflows directory with Finder"
	echo "  workflow copy path      Copy workflows to default directory: path"
	echo "  workflow copy           Copy workflows to default directory: $script_services_dir"
	echo
	echo "  $(title "Applications")"
	echo "  app dev                 Show status for no identificated apps"
	echo "  app dev --status        Show status for no identificated apps"
	echo "  app dev --enable | -e   Enable download no identificated apps"
	echo "  app dev --disable | -d  Disable download no identificated apps"
	echo
	echo "  app search appName             Install apps using brew"
	echo "  app s appName"
	echo
	echo "  app install appName1 appName2  Install apps using brew"
	echo "  app i appName1 appName2"
	echo
	echo "  app uninstall app1 app2        Uninstall apps using brew"
	echo "  app u app1 app2"
	echo
	echo "  $(title "Spotlight")"
	echo "  spotlight                      To manage Spotlight"
	echo "  spotlight --enable             To enable Spotlight"
	echo "  spotlight --disable            To disable Spotlight"
	echo
	echo "  $(title "Desktop pictures")"
	echo "  desk-pics [path]               To add Desktop image in desktop pictures directory"
	echo "  desk-pics [path] --dir         To add Desktop images from a directory in desktop pictures directory"
	echo "  desk-pics [path] --sys         To add Desktop images from a directory in system desktop pictures directory"
	echo
	echo "  $(title "Notification")"
	echo "  notification text              Set a macOS notification"
	echo "  not text   "
	echo
	echo "  $(title "Terminal")"
	echo "  terminal shell change          Change shell"
	echo "  term shell change"
	echo "  term shell change=shellName"
	echo "  terminal shell list            List available shells"
	echo "  term shell list"
	echo "  terminal shell curr            View current shell"
	echo "  term shell curr"
	echo 
	echo $(title "Flags")
	echo 
	echo "  [ --help | -h ]     Print cmd help"
	echo "  [ --version | -v ]  Print cmd version."
	echo
	echo "$(Version)"
	echo

}


############################################################
