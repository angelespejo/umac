
getOSAProperties(){

	if [[ -z "$1" ]]; then
		
		echo "❌ You need a argument"

		return

	fi

	if [ -n "$3" ]; then
		osascript -e "tell application \"${1}\" to tell ${2} to get ${3}"
	elif [ -n "$2" ]; then
		osascript -e "tell application \"${1}\" to get properties of ${2}"
	else 
		osascript -e "tell application \"${1}\" to get properties"
	fi

}

setOSAProperties(){
	

	if [ -n "$4" ]; then
		osascript -e "tell application \"${1}\" to tell ${2} to set ${3} to ${4}"
	elif [ -n "$3" ]; then
		osascript -e "tell application \"${1}\" to set ${2} to ${3}"
	else 

		echo "❌ You need a argument"
		return
	
	fi

}
