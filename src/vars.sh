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

DESC="macOS utils for a fast development."
VERSION="1.1.0"
CMD="umac"
documents_dir="$HOME/Documents"
umac_dir="$documents_dir/umac"
script_services_dir="$umac_dir/workflows"
cache_dir="$HOME/Library/Caches"
services_dir="$HOME/Library/Services"
desk_pics_dir="/Library/Desktop Pictures"
sys_desk_pics_dir="/System/Library/Desktop Pictures"


############################################################
