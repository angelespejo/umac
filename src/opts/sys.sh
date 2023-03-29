#!/bin/bash

############################################################
# FUNCTION                                                 
############################################################
softwareUpdateFunct(){

	softwareupdate

}

shutdownFunct(){

	shutdown

}

rebootFunct(){

	reboot
	
}

sysFunct(){

	if [[ $1 == "reboot" ]]; then
		rebootFunct "$@:2"
	elif [[ $1 == "update" ]] || [[ $1 == "up" ]]; then
		softwareUpdateFunct "$@:2"
	elif [[ $1 == "shutdown" ]] || [[ $1 == "down" ]]; then
		shutdownFunct "$@:2"
	elif [[ $1 == "version" ]] || [[ $1 == "v" ]]; then
		sw_vers
	else 
		echo "ℹ️ - You need a argument like: reboot, update|up, shutdown|down, version|v"
	fi

}

############################################################