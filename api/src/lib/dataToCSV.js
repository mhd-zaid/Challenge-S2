import { createObjectCsvStringifier } from "csv-writer";

export const dataToCSV = async function (data) {
	const header = [];
	for (const colName of Object.keys(data[0])) {
		header.push({
			id: colName,
			title: colName,
		});
	}

	const csvStringifier = createObjectCsvStringifier({
		header,
		fieldDelimiter: ";",
	});

	for (let i = 0; i < data.length; i++) {
		for (const key in data[i]) {
			if (!data[i][key]) continue;
			if (typeof data[i][key] !== "string") continue;
			data[i][key] = data[i][key].replaceAll(/\n/g, " | ");
		}
	}

	const csvData =
		csvStringifier.getHeaderString() +
		csvStringifier.stringifyRecords(data);

	return Buffer.from(csvData, "utf8");
};
