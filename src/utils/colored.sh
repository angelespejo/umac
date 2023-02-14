#!/bin/bash

_color_case(){
	
	case $1 in 
	  	"black") # Enter a name
	    	color=`tput setaf 0`
	    	;;
	  	"red") # display Help
		    color=`tput setaf 1`
		    ;;
	  	"green") # Enter a name
	    	color=`tput setaf 2`
	    	;;
	  	"yellow") # Enter a name
	    	color=`tput setaf 3`
	    	;;
	  	"blue") # Enter a name
	    	color=`tput setaf 4`
	    	;;
	  	"magenta") # Enter a name
	    	color=`tput setaf 5`
	    	;;
	   	"cyan") # Enter a name
	    	color=`tput setaf 6`
	    	;;
	  	"white") # Enter a name
	    	color=`tput setaf 7`
	    	;;
	  	"grey") # Enter a name
	    	color=`tput setaf 8`
	    	;;
	  	"bg-white") # display Help
		    color=`tput setab 0`
		    ;;
	  	"bg-red") # display Help
		    color=`tput setab 1`
		    ;;
	  	"bg-green") # Enter a name
	    	color=`tput setab 2`
	    	;;
	  	"bg-yellow") # Enter a name
	    	color=`tput setab 3`
	    	;;
	  	"bg-blue") # Enter a name
	    	color=`tput setab 4`
	    	;;
	  	"bg-purple") # Enter a name
	    	color=`tput setab 5`
	    	;;
	   	"bg-cyan") # Enter a name
	    	color=`tput setab 6`
	    	;;
	  	"bg-white") # Enter a name
	    	color=`tput setab 7`
	    	;;
	  	"bg-grey") # Enter a name
	    	color=`tput setab 8`
	    	;;
	  	"bold") # Enter a name
	    	color=`tput bold`
	    	;;
	  	"dim") # Enter a name
	    	color=`tput dim`
	    	;;
		\?) # Invalid option
	    	echo "Error: Invalid option"
	    	exit;;

	esac

	echo $color

}

colored(){

	TEXT=$1

	if command -v tput >/dev/null 2>&1; then

		COLOR_1=$( _color_case "$2" )
		COLOR_2=$( _color_case "$3" )
		COLOR_3=$( _color_case "$4" )

		reset=`tput sgr0`

		echo "${COLOR_1}${COLOR_2}${COLOR_3}${TEXT}${reset}"

	else 

		echo $TEXT

	fi

}
