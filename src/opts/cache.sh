#!/bin/bash

############################################################
# CACHE VAR                                                  
############################################################



############################################################
# CACHE FUNCTION                                                  
############################################################

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


############################################################
# CACHE                                                  
############################################################

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

############################################################