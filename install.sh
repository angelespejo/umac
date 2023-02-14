#!/bin/bash

############################################################
# INSTALLATION                                           
############################################################

if [[ -d "dist" ]]; then

	chmod a+x dist/umac.sh
	cp dist/umac /usr/local/bin/
	umac

else 

	./build.sh
	cp dist/umac /usr/local/bin/
	umac

fi


############################################################

# Example: umac notification "Hello! 👋 \nDo you accept the challenge? 🍎🐢" 