$ curl --silent --request POST \
	 --header 'Content-Type: application/json' \
       --data '{ "call": "heads" }' \
       'http://localhost:3000/flip' 