#!/bin/bash


############################################################
# APP FUNCTION                                                 
############################################################

_deskPicksFolder(){

	if [[ $@ =~ .*"--sys".* ]]; then
		echo $sys_desk_pics_dir
	else 
		echo $desk_pics_dir
	fi

}

_nonExistArguments(){

	echo "ℹ️ - You need a argument like: $1"

}

_deskPicsValidate(){

	if [[ ! -f $1 ]]; then
		echo "❌ This file does not exist: $1"
		return 1
	fi

	# 0 = true
	return 0

}

deskPicsAdd(){

	_deskPicsValidate "$1" || return;
	
	DEST=$( _deskPicksFolder $@ )
	PICTURE_NAME=${1##*/}
	DESTPATH="${DEST}/${PICTURE_NAME}"


	if [[ $@ =~ .*"--dir".* ]]; then
		
		cp -R $1/* $DEST

	else

		if [[ ! -f $DESTPATH ]]; then
			cp "$1" "$DEST"
			echo "✅ copied!"
		else 
			echo "ℹ️ Exists: $DESTPATH"
			return
		fi


	fi

}


deskPicsChange(){

	_deskPicsValidate "$1" || return;

	DEST=$( _deskPicksFolder $@ )
	PICTURE_NAME=${1##*/}
	FILEPATH="${DEST}/${PICTURE_NAME}"

	if [[ -f "$FILEPATH" ]]; then
		
		osascript -e "tell application  \"System Events\" to set picture of every desktop to \"${FILEPATH}\""
		echo "✅ Added: $FILEPATH"

	else 

		cp "$1" "$DEST"
		echo "✅ Copied!"
		osascript -e "tell application \"System Events\" to set picture of every desktop to \"${DEST}/${PICTURE_NAME}\""
		echo "✅ Added: ${DEST}/${PICTURE_NAME}"
	
	fi

}

deskPicsRemove(){
	
	DEST=$( _deskPicksFolder $@ )

	opts="$DEST All Quit"

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

}

############################################################
# PICTURES REMOVE FUNCTION                                                  
############################################################

_deskPicsRm_func(){
	
	dir=$2
	item=$1
	
	if [ "$item" == "All" ]; then

		echo "❌ Option [$item] does not exist"
		

	elif [ "$item" == "" ]; then

		echo "❌ Option does not exist"

	else 

		FILENAME=$( echo ${item} | sed -e 's/%20/ /g')
		# FILENAME=$( echo $FILENAME | sed -e 's/ /\ /g')

		echo "ℹ️ Option: $dir/$FILENAME"

		if [ -d "$dir/$FILENAME" ] || [ -f "$dir/$FILENAME" ]; then
			
			rm -r "$dir/$FILENAME"

			echo "✅ Removed !"

		else

			echo "❌ Path does not exist"

		fi

	fi 

}

deskPicsRm(){
	
	FOLDER=$( _deskPicksFolder $@ )

	dirnames="$( ls "$FOLDER"  | sed -e 's/ /%20/g' )"

	opts="$dirnames Quit"

	PS3="Select a cache type to remove: "
	
	select item in $opts
	do

		if [ "$item" == "Quit" ]; then

			echo "✅ Exit !"

			break

		else 

			_deskPicsRm_func "$item" "$FOLDER"

		fi 

	done

}

deskPicsRm_arg(){

	FOLDER=$( _deskPicksFolder $@ )

	names_opts=${1#*=}

	dirnames=$( echo ${names_opts} | sed -e 's/,/ /g' )
	
	for item in $dirnames; do

		_deskPicsRm_func "$item" "$FOLDER"

	done

}

############################################################
# DESK PICTURES FUNCTION                                                 
############################################################

deskPics(){

	if [[ $1 =~ .*"add=".* ]]; then
		
		VALUE=${1#*=}

		deskPicsAdd "$VALUE" ${@:1}

	elif [[ $1 =~ .*"change=".* ]]; then

		VALUE=${1#*=}

		deskPicsChange "$VALUE" ${@:1}
	
	elif [[ $1 =~ .*"remove=".* ]]; then

		deskPicsRm_arg ${@:1}

	elif [[ $1 == "remove" ]]; then

		deskPicsRm ${@:2}

	else 

		_nonExistArguments "remove, add=your/path, change=your/path"

	fi

}

############################################################
# DESK FUNCTION                                                 
############################################################

desk(){

	if [[ $1 == "pics" ]] || [[ $1 == "pictures" ]]; then

		deskPics "${@:2}"
	
	else 

		_nonExistArguments "pics"

	fi
}

############################################################