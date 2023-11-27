# iData Schengen Visa Appointment Bot

The schengen visa process in Turkey is literal hell. To get a Schengen visa from Italy, you need to do it through an intermediary company called iData. However, every time I logged onto the iData website, hoping for an appointment slot, I was met with the same frustrating message: no appointments available. It felt like a never-ending loop of disappointment. Constantly refreshing the page became a part of my daily routine, and frankly, it was exhausting. After a while, as a software engineer, I thought: can't I automate this? That's when I decided to write this bot (with help from ChatGPT of course).

## The usual process of checking for an appointment
* You fill in your personal info such as your name, surname, passport number, etc. 
* You are asked to fill in your flight date and then asked to select a preferred appointment date.
* If there's no appointment available, it displays a text saying that there is no appointment available in that specific date and time.
* Then you select a different date in hopes that there is an appointment available on that date.
* Rinse and repeat...

However, there's a twist. Behind the scenes, the website doesn't actually check every date you select. It sends a request to an endpoint named `/getdate` once, which tells you the nearest available appointment. And guess what? That's exactly what my bot capitalizes on.

## How the bot works

The bot, designed to automate the frustrating task of finding a Schengen visa appointment on the iData website, operates in several clever steps. Here's a breakdown of its functionality based on the provided Puppeteer script:

Starting Up: The bot is initialized using Puppeteer, a Node library that provides a high-level API to control headless Chrome. It's set to run in headless mode for efficiency.

Here are the steps it takes:

1. The bot opens a new browser page and navigates to the iData Schengen visa appointment form.
   
2. It then selects specific options for the office location, application type, office type, and the number of persons applying.
   
3. A critical security step - the bot fetches a CSRF token from the page, which is necessary for making a secure request to the server.
   
4. The bot fills out personal details like name, surname, date of birth, passport number, phone number, and email address.
   
5. After navigating through the form, the bot triggers a request to the `/getdate` endpoint, which is used by the iData website to fetch the nearest available appointment date.
   
6. The bot continuously listens for responses from the `/getdate` endpoint.
   
7. Upon receiving a response, the bot checks for the `firstAvailableDate` field. If this field contains data, it indicates an available appointment slot.
   
8. If an available date is found, the bot constructs a message with the date details and sends it to the user via a Telegram bot. This step involves using the `node-telegram-bot-api` library.
    
9. The bot includes error handling to catch and log any issues that arise during the process. Finally, it closes the browser once the operation is complete.
     
10. The script is set to run at regular intervals, ensuring that it checks for appointments regularly.
    
This bot significantly streamlines the process of finding an available Schengen visa appointment, reducing the need for constant manual checks and providing timely alerts when slots become available.

## Edit:

I actually got an appointment using the bot. During that time, I was running the code locally on my laptop, but a future improvement could be to set up an AWS Lambda function or something similar so that it runs on the cloud 24/7
