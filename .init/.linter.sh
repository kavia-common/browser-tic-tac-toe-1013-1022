#!/bin/bash
cd /home/kavia/workspace/code-generation/browser-tic-tac-toe-1013-1022/tic_tac_toe_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

