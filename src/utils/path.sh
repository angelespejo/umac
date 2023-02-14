#!/bin/bash

############################################################
# FOLDER DIRECTORY                                                   
############################################################

folder_dir(){

	local dirs=${1}
	
	echo $( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

}


############################################################
# GET DIRS                                              
############################################################
get_dirs(){

	local dirs=${1}
	ls -a $dirs

}

############################################################
# GET DIRNAMES                                              
############################################################

get_dirnames(){

	for dir in $1/*; do 

		NAME=$( basename "$dir" | sed -e 's/ /%20/g' )
		echo "$NAME"

	done

	
}


############################################################
# EXISTS                                             
############################################################

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

############################################################