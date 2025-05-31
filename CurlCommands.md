Curl commands:

1. for Post requests:


curl -X POST http://127.0.0.1:5002/api/profile \
     -H "Content-Type: application/json" \
     -d @ProfileQuestion.json


curl -X POST http://127.0.0.1:5002/api/dailyinput \
     -H "Content-Type: application/json" \
     -d @daily_input_sample.json


2. for Get requests:

case1- dailyimpact:

curl http://localhost:5002/api/impact/user_001
curl http://localhost:5002/api/impact/user_002

case2- 7daysSummary:

curl -X GET http://localhost:5002/api/summary/user_001

in Case if we don't have data any in the dailyinputs for a profile it will consider the csv file created from ProfileQuestion

