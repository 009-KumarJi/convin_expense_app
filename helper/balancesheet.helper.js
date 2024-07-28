// helper/balance-sheet.helper.js

import { ErrorHandler } from "../utils/utility.js";
import { Parser as Json2CsvParser } from "json2csv";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

const generateCSV = (res, data, next) => {
    try {
        const fields = ["user", "name", "email", "balance"];
        const json2csvParser = new Json2CsvParser({ fields });
        const csv = json2csvParser.parse(data);

        res.header("Content-Type", "text/csv");
        res.attachment("balance_sheet.csv");
        res.send(csv);
    } catch (error) {
        next(new ErrorHandler("Error generating CSV file", 500));
    }
};

const generatePDF = (res, data, next) => {
    const doc = new PDFDocument();
    const filePath = path.join(__dirname, "..", "temp", "balance_sheet.pdf");
    doc.pipe(fs.createWriteStream(filePath));

    doc.fontSize(12).text("Balance Sheet", { align: "center" });
    doc.moveDown();

    data.forEach(item => {
        doc.text(`User: ${item.user}`);
        doc.text(`Name: ${item.name}`);
        doc.text(`Email: ${item.email}`);
        doc.text(`Balance: ${item.balance}`);
        doc.moveDown();
    });

    doc.end();

    doc.on('finish', () => {
        res.download(filePath, 'balance_sheet.pdf', err => {
            if (err) {
                next(new ErrorHandler("Error downloading the PDF file", 500));
            }
            fs.unlink(filePath, err => {
                if (err) console.error("Error deleting temporary file", err);
            });
        });
    });

    doc.on('error', () => {
        next(new ErrorHandler("Error generating PDF file", 500));
    });
};


export { generateCSV, generatePDF };
