## Solar Simulator

This is a program written in Next.js and Tauri used for simulating the solar potential for building rooftops. A Flask backend is used for generating solar panel models and returning data that is graphed in the application.

![alt text](/frontend/public/dashboard.png)

## Installation Instructions

1. Download and install Docker Desktop
   https://docs.docker.com/desktop/

2. Set up a Google Cloud Project for the Solar API by following [these instructions](https://developers.google.com/maps/documentation/solar/cloud-setup?_gl=1*15cpnpq*_up*MQ..*_ga*NzA5NDg1NTg4LjE3MTI3NjQxOTA.*_ga_NRWSTWS78N*MTcxMjc2NDE4OS4xLjAuMTcxMjc2NDE4OS4wLjAuMA..), make sure to follow the instructions for enabling the Solar API

3. Follow Step 2 for setting up the [Google Maps API](https://developers.google.com/maps/documentation/javascript/cloud-setup?_gl=1*pcwukt*_up*MQ..*_ga*MTMzODA0MzQzNC4xNzEyNzc1ODM3*_ga_NRWSTWS78N*MTcxMjc3NTgzNy4xLjAuMTcxMjc3NTgzNy4wLjAuMA..)

4. Follow [these instructions](https://developers.google.com/maps/documentation/solar/get-api-key) for both the Solar API and Maps API to create API keys.

5. Clone the repository using

```console
git clone https://github.com/nickleblanc/solar-simulator-monorepo.git
```

6. Inside of the frontend directory, create a file called .env and put the following in it

```code
GOOGLE_SOLAR_API_KEY={SOLAR_API_KEY}
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY={MAPS_API_KEY}
```

Replacing {SOLAR_API_KEY} and {MAPS_API_KEY} with the two API keys generated in step 4.

7. Open a Terminal window inside of the project directory and run the following commands

```console
docker-compose build
docker-compose up
```

8. Navigate to http://localhost:3000 in your web browser
