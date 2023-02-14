#!/bin/bash

############################################################
# ONLY FOR DARWIN                                             
############################################################

if [[ ! "$OSTYPE" == "darwin"* ]]; then

	echo "This program is for darwinOS types"
    exit

fi

############################################################
# VARS                                             
############################################################

script_services_dir="$HOME/Downloads/"
cache_dir="$HOME/Library/Caches"
services_dir="$HOME/Library/Services"
desk_pics_dir="/Library/Desktop Pictures"
sys_desk_pics_dir="/System/Library/Desktop Pictures"


############################################################