
VAR_FILE=./src/vars.sh
REPO=https://github.com/angelespejo/umac
ACTUAL_VERSION=$(grep '^VERSION=' $VAR_FILE | awk -F '=' '{print $2}')

read -p "Add files for git: " git_add
read -p "Set release commit (default: 'Release commit 🌈⚡️'): " git_commit
read -p "Actual version is ${ACTUAL_VERSION}. Change to another: (default: false)" version

version=${version:-"false"}
git_add=${git_add:-"."}
git_commit=${git_commit:-"Release commit 🌈⚡️"}

if [[ $version != false ]]; then
	sed -i '' "s/VERSION=\".*\"/VERSION=\"${version}\"/" "$VAR_FILE"
	echo "version changed to ${version}"
	git tag -a "v${version}" -m "${git_commit}"
fi

gh repo edit $REPO -d '⚡️🍎🐢 Terminal utilities for MacOS: install apps, force close apps, clear cache, add desk notifications, change shell, etc.'
gh repo edit $REPO --add-topic macos,shell,bash,apple,terminal,applescript,darwin

git add $git_add
git commit -m "$git_commit"
git push --follow-tags origin main