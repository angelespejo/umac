#!/bin/bash

############################################################
# NOTIFICATION                                               
############################################################

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