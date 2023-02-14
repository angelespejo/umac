#!/bin/bash

############################################################
# Open APPS LIST                                             
############################################################

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

############################################################
# CLOSE FUNCTIONS                                                    
############################################################

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

# CLOSE                                                     
############################################################

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

# CLOSE with args                                                     
############################################################

close_arg(){

	cache_names_opts=${1#*=}
	cache_dirnames=$( echo ${cache_names_opts} | sed -e 's/,/ /g' )
	
	for item in $cache_dirnames; do

		_close_func "$item"

	done

}
############################################################