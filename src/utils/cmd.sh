#!/bin/bash

############################################################
# cmd exist                                            
############################################################

cmd_exist(){

	if command -v $1 >/dev/null 2>&1; then

		echo true

	else 

		echo false

	fi
   
}

                                      
############################################################