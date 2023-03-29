#!/bin/bash

############################################################
# VARS                                             
############################################################

CURR_DIR="."
EXEC=.

if [[ $1 == "build" ]]; then

	CURR_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
	_cat(){ grep '^[^#]' $1 ; }
	EXEC="_cat"

fi

UTILS_DIR="$CURR_DIR/utils"
SRC_DIR="$CURR_DIR/opts"

$EXEC "$CURR_DIR/vars.sh" 


############################################################
# VARS                                             
############################################################

$EXEC "$UTILS_DIR/colored.sh"
$EXEC "$UTILS_DIR/path.sh"
$EXEC "$UTILS_DIR/cmd.sh"
$EXEC "$UTILS_DIR/osascript.sh"


############################################################
# OPTIONS                                             
############################################################

$EXEC "$SRC_DIR/help.sh"
$EXEC "$SRC_DIR/cache.sh"
# $EXEC "$SRC_DIR/close.sh"
$EXEC "$SRC_DIR/apps.sh"
$EXEC "$SRC_DIR/open.sh"
$EXEC "$SRC_DIR/sys.sh"
$EXEC "$SRC_DIR/workflow.sh"
$EXEC "$SRC_DIR/spotlight.sh"
$EXEC "$SRC_DIR/desk.sh"
$EXEC "$SRC_DIR/finder.sh"
$EXEC "$SRC_DIR/notification.sh"
$EXEC "$SRC_DIR/terminal.sh"
$EXEC "$SRC_DIR/darkMode.sh"


############################################################
# OPTIONS EXECUTION                                    
############################################################

$EXEC "$CURR_DIR/opts.sh"

                                           
############################################################