#!/bin/bash

############################################################
# NOTIFICATION                                               
############################################################

clickOnButton(){

	if [[ $1 = "button returned:${2}" ]]; then
	    echo true
	else
	    echo false
	fi


}

not_funct(){

	if [[ $2 == "" ]]; then
		echo "❌ You need a argument with text for the macOS not"
	else 

		if [[ $( cmd_exist "osascript" ) ]]; then
			
			TXT=$2
			VARS=${@:3}
			
			if [[ $VARS =~ .*"btn-false=".* ]]; then
				BTN_FALSE=${VARS#*btn-false=}
				BTN_FALSE=${BTN_FALSE%%btn-true*}
			else 
				BTN_FALSE="Cancel"
			fi

			if [[ $VARS =~ .*"btn-true=".* ]]; then
				BTN_TRUE=${VARS#*btn-true=}
				BTN_TRUE=${BTN_TRUE%%btn-false*}
			else 
				BTN_TRUE="OK"
			fi

			DIALOG=$(osascript -e 'display dialog "'"$TXT"'" buttons { "'"${BTN_FALSE}"'", "'"${BTN_TRUE}"'" } default button "'"${BTN_TRUE}"'"' )
			
			if [[ $DIALOG = "button returned:${BTN_TRUE}" ]]; then
			    echo true
			else
			    echo false
			fi

		else 
			echo "❌ You dont have osascript, that function can not work 😢"
		fi
	
	fi
}


############################################################