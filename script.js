const puppeteer = require('puppeteer');
const TelegramBot = require('node-telegram-bot-api');

// Replace with your Telegram bot token and chat ID
const telegramToken = '6806721859:AAHxE0IeMmVDCV0lqmeB0WaSQhsQf07leZ0';
const chatId = '-4043195037';
const bot = new TelegramBot(telegramToken, {polling: true});

async function sendTelegramMessage(message) {
  try {
    await bot.sendMessage(chatId, message);
  } catch (error) {
    console.error('Error sending message to Telegram:', error);
  }
}

async function checkForVisaAppointments() {
  const browser = await puppeteer.launch({ headless: true }); // Using non-headless mode to visualize the actions
  const page = await browser.newPage();

  try {
    await page.goto('https://ita-schengen.idata.com.tr/tr/appointment-form', { waitUntil: 'networkidle0' });
  
    // Select 'Ankara' from the city dropdown
    await page.select('#city', '6'); // '6' is the value for Ankara
  
    // Wait for the cookie consent button to appear and click it
    const cookieButtonSelector = '#cookieJvns';
    if (await page.$(cookieButtonSelector) !== null) {
      await page.click(cookieButtonSelector);
    }
  
    // Select 'Ankara Ofis' from the office dropdown
    await page.select('#office', '2'); // '2' is the value for Ankara Ofis
  
    // Select 'Diğer' (Other) from the application type dropdown
    await page.select('#getapplicationtype', '7'); // '7' is the value for Diğer (Other)
  
    // Select 'STANDART' from the office type dropdown
    await page.select('#officetype', '1'); // '1' is the value for STANDART
  
    // Select '1 Kişi' (1 Person) from the total person dropdown
    await page.select('#totalPerson', '1'); // '1' is the value for 1 Person
  
    // Wait for the token to be available in the DOM
    await page.waitForSelector('input[name="_token"]');
  
    // Retrieve the value of the hidden input field
    const token = await page.evaluate(() => {
      const tokenInput = document.querySelector('input[name="_token"]');
      return tokenInput ? tokenInput.value : null;
    });
  
    console.log('CSRF Token:', token);
  
  
    await page.click('#btnAppCountNext');  
  
    await page.type('#name1', 'Mustafa Emre');
    await page.type('#surname1', 'Gündüz');
    await page.select('#birthday1', '15'); // Selects day 15
    await page.select('#birthmonth1', '12'); // Selects month December
    await page.select('#birthyear1', '2000'); // Selects year 2000
    await page.type('#passport1', 'U23811667');
    await page.type('#phone1', '5053919102');
    await page.type('#email1', 'emreguenduez@protonmail.com');
  
    // Click the 'İleri' button again
    await page.click('#btnAppPersonalNext');
  
  // Listen for network responses
  page.on('response', async (response) => {
    const url = response.url();
    if (url.includes('ita-schengen.idata.com.tr/tr/getdate')) {
      console.log('Intercepted response from:', url);
      const responseData = await response.json(); // Assuming the response is JSON
      console.log('Response data:', responseData);
      
      var message;
      // Print the firstAvailableDate field
      if (responseData && responseData.firstAvailableDate) {
        message = `First Available Date: ${responseData.firstAvailableDate}`;
        console.log(message);
        await sendTelegramMessage(message); // Send message via Telegram
      } else {
        message = `No dates available yet`;
        await sendTelegramMessage(message); // Send message via Telegram
        console.log('First Available Date not found or empty');
      }
    }
    });
  
    await page.click('#btnAppPreviewNext');
  
    // Add a delay or an explicit wait condition here if necessary
    // This is to ensure that the script doesn't end before the response is captured
    await page.waitForTimeout(5000); // Waits for 5 seconds; adjust as needed
  
    
  } catch (error) {
    console.error('An error occurred:', error);
  } finally {

  }

}

const interval = 20 * 60 * 1000; // 10 minutes

setInterval(checkForVisaAppointments, interval);