# Bling Auth - Coding Challenge // Akter Hossain

**How much time did you spend working on the solution?**

I spent almost 12+ hours.

**What’s the part of the solution you are most proud of?**

Most of the time I tried to follow the best practices. I kept http req/res related logic in controller layer and business logics in service layer. I wrote clean code and avoided duplication. I handled all JWT token verifications in middleware as a good practice. I used `sessionId` to verify OTP.

**If you had more time, what other things you would like to do?**

I would add a few important things which are missing now.

- Test coverage
- Email verification
- Refresh token
- More custom Error types

**Do you have any feedback regarding this coding challenge?**

To create boilerplate things like tsconfig, eslint, dockerization, database configs etc. have taken a significant amount of time. It would be nice to provide a boilerplate project and ask to solve some more business specific logics like '2FA Login', 'OTP verification is required on changing password' etc.

## How to run

I have created docker compose file to run this project without any hassle.

```sh
docker-compose up -d --build
```

>Disclaimer: I didn't integrate any SMS service as I didn't find any free sms provider. Instead I generate OTP and create `/otp?username=$email` endpoint to see the current OTP. It is actually service the same purpose but not sending the actual SMS.

## How to test

I have uploaded a Postman collection [bling-auth-api](bling.postman_collection.json) inside this project. You can import this to the Postman and hit endpoints.
