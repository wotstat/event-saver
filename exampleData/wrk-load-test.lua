-- wrk -d 5 -t 4 -s wrk-load-test.lua http://localhost:9000/api

wrk.method = "POST"
wrk.headers["Content-Type"] = "application/json"

file = io.open("OnShot.json", "r")
wrk.body = file:read("*a")