#!/bin/bash
source credential

if ! [[ -v IP ]] || ! [[ -v USR ]] || ! [[ -v PASS ]] || ! [[ -v DEST ]] || ! [[ -v PORT ]];
then
    echo "(￣ε(#￣)☆╰╮o(￣皿￣///) Please set IP USR PASS PORT DEST in credential first."
	exit
fi

sshpass -p "$PASS" rsync -av ./ "$USR"@"$IP":"$DEST"
# sshpass -p "$PASS" ssh "$USR"@"$IP" fuser -k "$PORT"/tcp
# sshpass -p "$PASS" ssh "$USR"@"$IP" nohup node "$DEST"/index.js &