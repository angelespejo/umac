#!/bin/bash

############################################################
# APP FUNCTION                                                 
############################################################

_finderShowAllFilesStatus(){

	VALUE="$( defaults read com.apple.finder AppleShowAllFiles )"

	if [[ $VALUE = "1" ]]; then
		VALUE="$( colored " true " "bg-green" "white" )"
	else 
		VALUE="$( colored " false " "bg-red" "white" )"
	fi

	echo "Show all files: $VALUE"
	
}

finderShowAllFile(){

	if [[ $@ =~ .*"--status".* ]] || [[ $@ =~ .*"-s".* ]]; then

		_finderShowAllFilesStatus

	else 

		if [[ $@ =~ .*"true".* ]] || [[ $@ =~ .*"--enable".* ]] || [[ $@ =~ .*"-e".* ]]; then

			defaults write com.apple.finder AppleShowAllFiles 1 # view
			killall Finder

		elif [[ $@ =~ .*"false".* ]] || [[ $@ =~ .*"--disable".* ]] || [[ $@ =~ .*"-d".* ]]; then

			defaults write com.apple.finder AppleShowAllFiles 0 # hide
			killall Finder

		else 

			_finderShowAllFilesStatus

		fi

	fi

}

finderFunct(){

	if [[ $1 == "show-all-files" ]]; then
		
		finderShowAllFile $@:2
	
	else 

		echo "ℹ️ - You need a argument like: show-all-files"

	fi

}

############################################################

