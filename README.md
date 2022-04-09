# DO 504

This is a small Node.js web service to troubleshoot connectivity issues with Digital Ocean's "app platform".

The service consists of a frontend and backend, serviced on `/front` and `/back` respectively.

Each request to the frontend initiates a number of simultaneous requests to the backend.

Frontend requests where all subrequests are successful simply print the number of processed subrequests and a basic timing stat.

Failed subrequests also list the returned bodies and headers of all failed requests.

The frontend accepts a single URL parameter, "reqs", which can be used to specify the number of performed subrequests.

## Try it out!

The frontend service is deployed here: https://my-app-45vno.ondigitalocean.app/front.
Simply visit the URL and reload after each completed request until you get a list of failed subrequests.

## Details

The frontend generates random sized, random printable content bodies of up to 10k for each subrequest.

The backend "processes" each request by sleeping a random time before returning.

The services can be configured by environment variables as seen in [config.ts](./src/config.ts).
