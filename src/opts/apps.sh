#!/bin/bash

############################################################
# APP FUNCTION                                                 
############################################################

############################################################
# PRIVATE FUNCTS                                                 
############################################################

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

############################################################
# INSTALLATION                                                 
############################################################

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

############################################################
# SEARCH                                                 
############################################################

search(){

	_brew_installation

	brew search ${@:2} --cask

}

############################################################
# DEV APPS                                                  
############################################################

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


############################################################
# APPS                                                  
############################################################

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


############################################################