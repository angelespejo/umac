#!/bin/bash

############################################################
# FUNCTION                                                 
############################################################

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

############################################################