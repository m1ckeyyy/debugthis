const puppeteer = require("puppeteer");
const fs = require("fs/promises");
var XLSX = require("xlsx");
const express = require("express");
const { exit } = require("process");
app = express();
app.get("/", (req, res) => {
	res.send("Hello World");
});
app.listen(3000, () => {
	console.log("i: ", i);
});
let i = 0;
let interval;
const workbook = XLSX.readFile("myExcelFile.xlsx");
const worksheet = workbook.Sheets["Sheet1"];

const invoiceList = XLSX.utils.sheet_to_json(worksheet);
// invoiceList[0].Imie;
// console.log(invoiceList.length);

// const betterLoop = function () {
// 	if (i >= invoiceList.length) {
// 		clearInterval(interval);
// 		return;
// 	}
// 	console.log(
// 		invoiceList[i].Imie +
// 			" " +
// 			invoiceList[i].Nazwisko +
// 			" " +
// 			invoiceList[i].Kwota
// 	);
// 	i++;
// };
// interval = setInterval(() => {
// 	betterLoop();
// }, 500);

//console.log(invoiceList);
// for (const element of invoiceList) {
// 	console.log(element.Imie + " " + element.Nazwisko + " " + element.Kwota);
// }

async function start() {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	// await page.goto("https://krakow.odpn.pl//Logowanie.aspx");
	await page.goto("https://learnwebcode.github.io/practice-requests/");
	// await page.screenshot({ path: "amazing.png", fullPage: true });
	const names = await page.evaluate(() => {
		return Array.from(document.querySelectorAll(".info strong")).map(
			(x) => x.textContent
		);
	});
	await fs.writeFile("names.txt", names.join("\r\n"));

	await page.click("#clickme");
	const clickedData = await page.$eval("#data", (el) => el.textContent);
	console.log(clickedData);

	await page.type("#ourfield", "blue");

	await Promise.all([page.click("#ourform button"), page.waitForNavigation()]);

	const info = await page.$eval("#message", (el) => el.textContent);

	console.log(info);

	await browser.close();
}
async function invoicer() {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto("https://krakow.odpn.pl//Logowanie.aspx");
	console.log(i);
	if (i >= invoiceList.length) {
		clearInterval(interval);
		await browser.close();
		exit();
		return;
	}
	await page.type("#Login", invoiceList[i].Imie);
	await page.type("#Haslo", invoiceList[i].Nazwisko);
	i++;
	await page.screenshot({
		path: `screenshots/invoiceScreenshot${i}.png`,
		fullPage: true,
	});
	invoicer();
}
invoicer();
// invoicer();
// setInterval(start, 7000);
