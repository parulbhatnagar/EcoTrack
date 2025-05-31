Curl commands:

1. for Post requests:


curl -X POST http://127.0.0.1:5002/api/profile \
     -H "Content-Type: application/json" \
     -d @ProfileQuestion.json


curl -X POST http://127.0.0.1:5002/api/dailyinput \
     -H "Content-Type: application/json" \
     -d @daily_input_sample.json


2. for Get requests:

curl http://localhost:5002/api/impact/user_001
curl http://localhost:5002/api/impact/user_002
