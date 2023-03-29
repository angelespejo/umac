#!/bin/bash

############################################################
# APP FUNCTION                                                 
############################################################

setDarkStatus(){

	VALUE="$( getOSAProperties "System Events" "appearance preferences" "dark mode" )"
	VALUE="$( colored " $VALUE " "bg-green" "white" )"
	echo "Dark mode in system is $VALUE"
	
}

darkMode(){

	if [[ $@ =~ .*"--status".* ]] || [[ $@ =~ .*"-s".* ]]; then

		setDarkStatus

	else 

		if [[ $@ =~ .*"true".* ]] || [[ $@ =~ .*"--enable".* ]] || [[ $@ =~ .*"-e".* ]]; then

			$( setOSAProperties "System Events" "appearance preferences" "dark mode" "true")

		elif [[ $@ =~ .*"false".* ]] || [[ $@ =~ .*"--disable".* ]] || [[ $@ =~ .*"-d".* ]]; then

			$( setOSAProperties "System Events" "appearance preferences" "dark mode" "false")

		else 

			setDarkStatus

		fi

	fi

}


############################################################