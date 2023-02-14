#!/bin/bash

############################################################
# FUNCTION                                                 
############################################################

workflow(){

	if [[ "$2" == "list" ]]; then

		echo "✅ List in: $services_dir"
		
		ls $services_dir

	elif [[ "$2" == "copy" ]]; then

		if [[ ! $3 == "" ]]; then
			script_services_dir=$3
		fi

		if [[ ! -d $script_services_dir ]]; then
			mkdir -p $script_services_dir
		fi

		cp -R $services_dir/* $script_services_dir
		
		echo "✅ copied in: $script_services_dir"

	elif [[ "$2" == "open-dir" ]]; then

		echo "✅ Open dir: $services_dir"

		open "$services_dir"

	elif [[ "$2" == "open" ]]; then

		services=$( get_dirnames "$services_dir" )
		opts="$services Quit"

		PS3="Select workflow to open: "

		select item in $opts
		do

			if [ "$item" == "Quit" ]; then

				echo "✅ Exit !"

				break

			else 

				if [ "$item" == "" ]; then

					echo "❌ Option does not exist"

				else 
					
					service_path=$( echo $item | sed -e 's/%20/\ /g')
					service_path=$( echo "$services_dir/$service_path" )
					
					open -a /System/Applications/Automator.app "$service_path"

					echo "✅ Open $service_path"

					break

				fi 


			fi 

		done
	
	elif [[ "$2" == "new" ]]; then

		echo "✅ Open new project with automator"
		
		open -a "Automator"

	else 
			
		echo "ℹ️  You need a cmd option like: list, copy, open, open-dir, new"

	fi

}


############################################################