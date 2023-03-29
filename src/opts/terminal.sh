#!/bin/bash

############################################################
# FUNCTION                                                 
############################################################

_success_txt(){
	echo $( colored " $1 " "bg-green" "black" )
}

_view_shell_list(){

	if [[ -f /etc/shells ]]; then
		
		SHELLS=$( grep '^[^#]' /etc/shells )

		for i in $SHELLS; do
			
			VAL=${i#*/bin/}

			if [[ $1 == "colors" ]]; then
				
				if [[ "$i" == "$SHELL" ]]; then
					echo $( _success_txt "$VAL" )
				else 
					echo $VAL
				fi

			else
				echo $VAL
			fi
			
		done

	else 
		echo "❌ Does not exist path: /etc/shells"
	fi

}

_msg_opts(){

	echo "ℹ️  Needs an option like: list, change, curr"

}

_shell_funct(){

	if [[ -z "$1" ]]; then
		
		_msg_opts
		exit 

	
	elif [[ "$1" == "change" ]]; then

		opts="$( _view_shell_list ) Quit"

		PS3="Select a shell to change: "
		
		select item in $opts
		do

			if [ "$item" == "Quit" ]; then

				echo "✅ Exit !"

				break

			else 
				if [[ "$item" == "" ]]; then

					echo "❌ This value does not exist"
				
				else 
					
					echo "✅ Change terminal to $( _success_txt "$item" )!"
					chsh -s "/bin/$item"
					echo "To see the changes you have to open another window in the terminal 🐢"
					
					break

				fi

			fi 

		done


	elif [[ "$1" == change=* ]]; then	

		VAL=${1#*=}
		FILE="/bin/$VAL"

		if [[ -f $FILE ]]; then
			echo "✅ Change terminal to $( _success_txt "$FILE" )!"
			chsh -s $FILE
			echo "To see the changes you have to open another window in the terminal 🐢"
		else 

			echo "❌  Terminal [$FILE] does not exist."
			echo "See list of available shells:"
			_view_shell_list

		fi
		
		exit 

	elif [[ "$1" == "curr" ]]; then

		VAL=${SHELL#*/bin/}
		echo "Actual shell: $( _success_txt "$VAL" )"

	elif [[ "$1" == "list" ]]; then
		
		_view_shell_list "colors"

	else 

		echo "❌ Does exist this option: $2"
		_msg_opts

	fi

}

terminal_funct(){
	
	if [[ -z "$2" ]]; then
		
		echo "ℹ️  Needs an option like: shell"
		exit 

	
	elif [[ "$2" == "shell" ]]; then

		_shell_funct "${@:3}"

	else 

		echo "❌ Does exist this option: $2"
		echo "ℹ️  Needs an option like: shell"

	fi

}

############################################################