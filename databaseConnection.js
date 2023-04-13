const mysql = require("mysql2/promise");

const is_qoddi = process.env.IS_QODDI || false;

const dbConfig = is_qoddi
	? {
			host: "sql.freedb.tech",
			user: "freedb_comp2350_michael",
			password: "P64E!sVzfw75qez",
			database: "freedb_comp2350_A01058974",
			multipleStatements: false,
			namedPlaceholders: true,
	  }
	: {
			host: "localhost",
			user: "root",
			password: "2*Q&8xKh9Tnc",
			database: "practice_final",
			multipleStatements: false,
			namedPlaceholders: true,
	  };

var database = mysql.createPool(dbConfig);

module.exports = database;
