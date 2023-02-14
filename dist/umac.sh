#!/bin/bash

if [[ ! "$OSTYPE" == "darwin"* ]]; then
	echo "This program is for darwinOS types"
    exit
fi
script_services_dir="$HOME/Downloads/"
cache_dir="$HOME/Library/Caches"
services_dir="$HOME/Library/Services"
desk_pics_dir="/Library/Desktop Pictures"
sys_desk_pics_dir="/System/Library/Desktop Pictures"
_color_case(){
	
	case $1 in 
	  	"black") # Enter a name
	    	color=`tput setaf 0`
	    	;;
	  	"red") # display Help
		    color=`tput setaf 1`
		    ;;
	  	"green") # Enter a name
	    	color=`tput setaf 2`
	    	;;
	  	"yellow") # Enter a name
	    	color=`tput setaf 3`
	    	;;
	  	"blue") # Enter a name
	    	color=`tput setaf 4`
	    	;;
	  	"magenta") # Enter a name
	    	color=`tput setaf 5`
	    	;;
	   	"cyan") # Enter a name
	    	color=`tput setaf 6`
	    	;;
	  	"white") # Enter a name
	    	color=`tput setaf 7`
	    	;;
	  	"grey") # Enter a name
	    	color=`tput setaf 8`
	    	;;
	  	"bg-white") # display Help
		    color=`tput setab 0`
		    ;;
	  	"bg-red") # display Help
		    color=`tput setab 1`
		    ;;
	  	"bg-green") # Enter a name
	    	color=`tput setab 2`
	    	;;
	  	"bg-yellow") # Enter a name
	    	color=`tput setab 3`
	    	;;
	  	"bg-blue") # Enter a name
	    	color=`tput setab 4`
	    	;;
	  	"bg-purple") # Enter a name
	    	color=`tput setab 5`
	    	;;
	   	"bg-cyan") # Enter a name
	    	color=`tput setab 6`
	    	;;
	  	"bg-white") # Enter a name
	    	color=`tput setab 7`
	    	;;
	  	"bg-grey") # Enter a name
	    	color=`tput setab 8`
	    	;;
	  	"bold") # Enter a name
	    	color=`tput bold`
	    	;;
	  	"dim") # Enter a name
	    	color=`tput dim`
	    	;;
		\?) # Invalid option
	    	echo "Error: Invalid option"
	    	exit;;
	esac
	echo $color
}
colored(){
	TEXT=$1
	if command -v tput >/dev/null 2>&1; then
		COLOR_1=$( _color_case "$2" )
		COLOR_2=$( _color_case "$3" )
		COLOR_3=$( _color_case "$4" )
		reset=`tput sgr0`
		echo "${COLOR_1}${COLOR_2}${COLOR_3}${TEXT}${reset}"
	else 
		echo $TEXT
	fi
}
folder_dir(){
	local dirs=${1}
	
	echo $( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
}
get_dirs(){
	local dirs=${1}
	ls -a $dirs
}
get_dirnames(){
	for dir in $1/*; do 
		NAME=$( basename "$dir" | sed -e 's/ /%20/g' )
		echo "$NAME"
	done
	
}
path_exists(){
	if [[ -f "$1" ]] || [[ -d "$1" ]]; then
		echo true
	else 
		echo false
	fi
}
existsFile(){
	if [ -f "$1" ]; then
		echo true
	else 
		echo false
	fi
}
existsDir(){
	if [ -d "$1" ]; then
		echo true
	else 
		echo false
	fi
}
cmd_exist(){
	if command -v $1 >/dev/null 2>&1; then
		echo true
	else 
		echo false
	fi
   
}
                                      
DESC="macOS utils for a fast development"
VERSION="1.0.0"
title(){ echo $( colored " ${1} " "bg-grey" "black"); }
Version(){
   echo "$(title "Version") $VERSION"
}
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
_cache_func(){
	
	item=$1
	
	if [ "$item" == "All" ]; then
		if [ -d "$cache_dir" ]; then
			
			rm -r "$cache_dir"
			echo "✅ Removed !"
		else
			echo "❌ Directory does not exist"
		fi
	elif [ "$item" == "" ]; then
		echo "❌ Option does not exist"
	else 
		FILENAME=$( echo ${item} | sed -e 's/%20/ /g')
		echo "ℹ️ Option: $cache_dir/$FILENAME"
		if [ -d "$cache_dir/$FILENAME" ]; then
			
			rm -r "$cache_dir/$FILENAME"
			echo "✅ Removed !"
		else
			echo "❌ Directory does not exist"
		fi
	fi 
}
cache(){
	if [[ "$2" == "--open" ]]; then
		open $cache_dir
	else 
		cache_dirnames="$( get_dirnames "$cache_dir" )"
		opts="$cache_dirnames All Quit"
		PS3="Select a cache type to remove: "
		
		select item in $opts
		do
			if [ "$item" == "Quit" ]; then
				echo "✅ Exit !"
				break
			else 
				_cache_func "$item"
			fi 
		done
	fi
}
cache_arg(){
	cache_names_opts=${1#*=}
	cache_dirnames=$( echo ${cache_names_opts} | sed -e 's/,/ /g' )
	
	for item in $cache_dirnames; do
		_cache_func "$item"
	done
}
_open_apps_list(){
	
	open_apps=$( osascript -e 'tell application "System Events" to get name of (processes where background only is false)')
	opts=$( echo ${open_apps} | sed -e 's/, /,/g')
	opts=$( echo ${opts} | sed -e 's/ /%20/g')
	opts=$( echo ${opts} | sed -e 's/,/ /g')
	echo $opts
}
_open_app_convert(){
	echo "${1}" | sed -e 's/%20/ /g'
}
_close_func(){
	item=$1
	echo $item
	if [ "$item" == "All" ]; then
		for open_app in $(_open_apps_list); do
			
			open_app=$( _open_app_convert "$open_app" )
			
			killall "$open_app"
			
		done
		break
		
	elif [ -z "$item" ]; then
		echo "❌ Option does not exist"
	else 
		if [[ $( _open_apps_list ) == *$item* ]]; then
			item=$( _open_app_convert "$item" )
			killall "$item"
			echo "✅ Close $item!"
			
			break
		else 
			echo "❌ Can not close app: $item"
		fi
	
	fi 
}
close(){
	PS3="Select app to close: "
	opts="$( _open_apps_list ) All Quit"
	select item in $opts
	do
		if [ "$item" == "Quit" ]; then
			echo "✅ Exit !"
			break
		else 
			_close_func "$item"
		fi 
	done
}
close_arg(){
	cache_names_opts=${1#*=}
	cache_dirnames=$( echo ${cache_names_opts} | sed -e 's/,/ /g' )
	
	for item in $cache_dirnames; do
		_close_func "$item"
	done
}
_allowed_txt(){ echo $( colored "${1}" "bg-green" "black"); }
_deny_txt(){ echo $( colored "${1}" "bg-red" "black"); }
_xcode_installation(){
	xcode=$( cmd_exist "xcode-select")
	if [[ $xcode == true ]]; then
		echo  "ℹ️  Installing xcode-select"
		
		xcode-select --install
	fi
}
_brew_installation(){
	brew_exist=$( cmd_exist "brew")
	if [[ $brew_exist != true ]]; then
		echo  "ℹ️  Installing Homebrew🍻"
		_xcode_installation
		/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
	fi
}
_brew(){
	args=${@:2}
	
	if [[ $args == "" ]]; then
		echo "❌ Need app names for $1, like: dropbox, google Chrome etc."
		echo "You can search apps with cmd: psh macos app search [nameApp]"
		exit
	fi
	_brew_installation
	echo "ℹ️  $1ing ${args[@]}"
	brew $1 ${args[@]} --cask
}
install(){
	
	_brew "install" "${@:2}"
}
uninstall(){
	
	_brew "uninstall" "${@:2}"
}
search(){
	_brew_installation
	brew search ${@:2} --cask
}
_dev_app_status(){
		
	if [[ $(spctl --status) == *disable* ]]; then
		echo "Your system $(_allowed_txt " ALLOWS " ) apps from unidentified developers"
	fi
	if [[ $(spctl --status) == *enable* ]]; then
		echo "Your system $( _deny_txt " DOES NOT ALLOW " ) apps from unidentified developers"
	fi
}
dev_apps(){
	
	if [[ $2 == "--enable" ]] || [[ $2 == "-e" ]]; then
		spctl --master-disable
		Killall Finder
		echo "✅ Download apps no identificated: enable"
	
	elif [[ $2 == "--disable" ]] || [[ $2 == "-d" ]]; then
		spctl --master-enable
		Killall Finder
		echo "✅ Download apps no identificated: disabled"
	elif [[ $2 == "--status" ]]; then
		
		_dev_app_status
	else 
		_dev_app_status
	fi
}
apps(){
	# install                                                   
	########################################################
	if [[ "$2" == "install" ]] || [[ "$2" == "i" ]]; then
		install "${@:2}"
	# uninstall                                                   
	########################################################
	elif [[ "$2" == "uninstall" ]] || [[ "$2" == "u" ]]; then
		uninstall "${@:2}"
	# search                                                   
	########################################################
	elif [[ "$2" == "search" ]] || [[ "$2" == "s" ]]; then
		search "${@:2}"
	# dev apps                                                   
	########################################################
	elif [[ "$2" == "dev" ]]; then
		dev_apps "${@:2}"
	
	else 
		echo "ℹ️  You need a cmd option like: install, uninstall, search or dev"
	fi
}
open_in_nav(){
	TYPE=$1
	NAV_PATH="$2"
	OPEN_PATH=$3
	if [[ -d "$NAV_PATH" ]]; then
			
		echo "✅ Open in $TYPE: $OPEN_PATH"
		open -a "$NAV_PATH" "$OPEN_PATH"
	else 
		echo "❌ $TYPE does not exist in: $NAV_PATH"
	fi
}
open_funct(){
	
	if [[ -z "$2" ]]; then
		
		echo "ℹ️  Needs an argument that is an existing path"
		exit 
	elif [[ -d $2 ]] || [[ -f $2 ]]; then
		if [[ "$3" == "--chrome" ]]; then
			
			open_in_nav "Chrome" "/Applications/Google Chrome.app" "$2"
		
		elif [[ "$3" == "--firefox" ]]; then
			
			open_in_nav "Firefox" "/Applications/Firefox.app" "$2"	
		
		elif [[ "$3" == "--safari" ]]; then
			
			open_in_nav "Safari" "/Applications/Safari.app" "$2"
		elif [[ "$3" == "--opera" ]]; then
			
			open_in_nav "Opera" "/Applications/Opera.app" "$2"
		elif [[ "$3" == "--tor" ]]; then
			
			open_in_nav "Tor" "/Applications/Tor Browser.app" "$2"
		else 
			
			echo "✅ Open in Finder: $2"
			open $2
		fi
	else 
		echo "❌ Does not exist path: $2"
	fi
}
workflow(){
	if [[ "$2" == "list" ]]; then
		echo "✅ List in: $services_dir"
		
		ls $services_dir
	elif [[ "$2" == "copy" ]]; then
		if [[ ! $3 == "" ]]; then
			script_services_dir=$3
		fi
		if [[ ! -d $script_services_dir ]]; then
			mkdir $script_services_dir
		fi
		cp -R $services_dir/* $script_services_dir
		
		echo "✅ copied in: $script_services_dir"
	elif [[ "$2" == "open-dir" ]]; then
		echo "✅ Open dir: $services_dir"
		open "$services_dir"
	elif [[ "$2" == "open" ]]; then
		services=$( get_dirnames "$services_dir" )
		opts="$services Quit"
		PS3="Select workflow to open: "
		select item in $opts
		do
			if [ "$item" == "Quit" ]; then
				echo "✅ Exit !"
				break
			else 
				if [ "$item" == "" ]; then
					echo "❌ Option does not exist"
				else 
					
					service_path=$( echo $item | sed -e 's/%20/\ /g')
					service_path=$( echo "$services_dir/$service_path" )
					
					open -a /System/Applications/Automator.app "$service_path"
					echo "✅ Open $service_path"
					break
				fi 
			fi 
		done
	
	elif [[ "$2" == "new" ]]; then
		echo "✅ Open new project with automator"
		
		open -a "Automator"
	else 
			
		echo "ℹ️  You need a cmd option like: list, copy, open, open-dir, new"
	fi
}
spotlight() {
	if [[ "$2" == "--enable" ]] || [[ "$2" == "-e" ]]; then
		mdutil -i on /
	elif [[ "$2" == "--disable" ]] || [[ "$2" == "-d" ]]; then
		mdutil -i off /
	else
		mdutil ${@:2}
	fi
}
                                              
desk_pics(){
	
	if [[ $@ =~ .*"--sys".* ]]; then
		DEST=$sys_desk_pics_dir
	else 
		DEST=$desk_pics_dir
	fi
	if [[ ${@:2} =~ .*"--dir".* ]]; then
		
		cp -R $2/* $DEST
	elif [[ "$2" == "" ]]; then
		echo "ℹ️  You need a arguent like: [image path]"
	else
		cp "$2" "$DEST"
		echo "✅ copied!"
	fi
}
not_funct(){
	if [[ $2 == "" ]]; then
		echo "❌ You need a argument with text for the macOS not"
	else 
		if [[ $( cmd_exist "osascript" ) ]]; then
	
			osascript -e 'display dialog "'"$2"'"' >/dev/null
		
		else 
			echo "❌ You dont have osascript, that function can not work 😢"
		fi
	
	fi
}
_success_txt(){
	echo $( colored " $1 " "bg-green" "black" )
}
_view_shell_list(){
	if [[ -f /etc/shells ]]; then
		
		SHELLS=$( grep '^[^#]' /etc/shells )
		for i in $SHELLS; do
			
			VAL=${i#*/bin/}
			if [[ $1 == "colors" ]]; then
				
				if [[ "$i" == "$SHELL" ]]; then
					echo $( _success_txt "$VAL" )
				else 
					echo $VAL
				fi
			else
				echo $VAL
			fi
			
		done
	else 
		echo "❌ Does not exist path: /etc/shells"
	fi
}
_msg_opts(){
	echo "ℹ️  Needs an option like: list, change, curr"
}
_shell_funct(){
	if [[ -z "$1" ]]; then
		
		_msg_opts
		exit 
	
	elif [[ "$1" == "change" ]]; then
		opts="$( _view_shell_list ) Quit"
		PS3="Select a shell to change: "
		
		select item in $opts
		do
			if [ "$item" == "Quit" ]; then
				echo "✅ Exit !"
				break
			else 
				if [[ "$item" == "" ]]; then
					echo "❌ This value does not exist"
				
				else 
					
					echo "✅ Change terminal to $( _success_txt "$item" )!"
					chsh -s "/bin/$item"
					echo "To see the changes you have to open another window in the terminal 🐢"
					
					break
				fi
			fi 
		done
	elif [[ "$1" == change=* ]]; then	
		VAL=${1#*=}
		FILE="/bin/$VAL"
		if [[ -f $FILE ]]; then
			echo "✅ Change terminal to $( _success_txt "$FILE" )!"
			chsh -s $FILE
			echo "To see the changes you have to open another window in the terminal 🐢"
		else 
			echo "❌  Terminal [$FILE] does not exist."
			echo "See list of available shells:"
			_view_shell_list
		fi
		
		exit 
	elif [[ "$1" == "curr" ]]; then
		VAL=${SHELL#*/bin/}
		echo "Actual shell: $( _success_txt "$VAL" )"
	elif [[ "$1" == "list" ]]; then
		
		_view_shell_list "colors"
	else 
		echo "❌ Does exist this option: $2"
		_msg_opts
	fi
}
terminal_funct(){
	
	if [[ -z "$2" ]]; then
		
		echo "ℹ️  Needs an option like: shell"
		exit 
	
	elif [[ "$2" == "shell" ]]; then
		_shell_funct "${@:3}"
	else 
		echo "❌ Does exist this option: $2"
		echo "ℹ️  Needs an option like: shell"
	fi
}
if [[  $@ =~ .*"--help".* ]] || [[ $@ =~ .*"-h".* ]]; then
	
	echo
	Help
	exit
elif [[  $@ =~ .*"--version".* ]] || [[ $@ =~ .*"-v".* ]]; then
	
	echo
	Version
	exit
fi
if [[ "$1" == "cache" ]]; then
	cache "$@"
elif [[ "$1" == "cache="* ]]; then
	cache_arg "$@"
elif [[ "$1" == "close" ]]; then
	close "$@"
elif [[ "$1" == "close="* ]]; then
	close_arg "$@"
elif [[ "$1" == "app" ]]; then
	apps "$@"
elif [[ "$1" == "open" ]]; then
	open_funct "$@"
elif [[ "$1" == "workflow" ]]; then
	workflow "$@"
elif [[ "$1" == "spotlight" ]]; then
	spotlight "$@"
elif [[ "$1" == "terminal" ]] || [[ "$1" == "term" ]]; then
	terminal_funct "$@"
elif [[ "$1" == "notification" ]] || [[ "$1" == "not" ]]; then
	not_funct "$@"
elif [[ "$1" == "desk-pics" ]]; then
	desk_pics "$@"
else 
	
	if [[ "$1" == "" ]]; then
		echo
		Help
		exit
	else 
		echo "❌ Does not exist cmd option $1"
	fi
fi
