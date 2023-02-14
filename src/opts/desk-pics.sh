#!/bin/bash

############################################################
# APP FUNCTION                                                 
############################################################

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

############################################################