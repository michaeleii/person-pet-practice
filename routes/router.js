const router = require("express").Router();
const dbModel = include("databaseAccessLayer");

router.get("/", async (req, res) => {
	try {
		res.locals.allPeople = await dbModel.getAllPeople();
		res.render("index");
	} catch (err) {
		res.render("error", { message: "Error reading from MySQL" });
		console.log("Error reading from mysql");
	}
});

router.post("/addPerson", async (req, res) => {
	try {
		const success = await dbModel.addPerson(req.body);
		if (success) {
			res.redirect("/");
		} else {
			res.render("error", { message: "Error writing to MySQL" });
			console.log("Error writing to MySQL");
		}
	} catch (err) {}
});

router.get("/deletePerson", async (req, res) => {
	let person_id = req.query.id;
	if (person_id) {
		const success = await dbModel.deletePerson(person_id);
		if (success) {
			res.redirect("/");
		} else {
			res.render("error", { message: "Error writing to MySQL" });
			console.log("Error writing to mysql");
			console.log(err);
		}
	}
});

router.get("/showPets", async (req, res) => {
	[res.locals.allPersonPets, res.locals.owner] = await dbModel.getPersonPets(
		req.query.id
	);
	res.render("pets");
});

router.post("/addPet", async (req, res) => {
	console.log("form submit");

	try {
		const success = await dbModel.addPet(req.body);
		if (success) {
			res.redirect(`/showPets?id=${req.body.person_id}`);
		} else {
			res.render("error", { message: "Error writing to MySQL" });
			console.log("Error writing to MySQL");
		}
	} catch (err) {
		res.render("error", { message: "Error writing to MySQL" });
		console.log("Error writing to MySQL");
		console.log(err);
	}
});

router.get("/deletePet", async (req, res) => {
	let { pet_id, person_id } = req.query;
	if (pet_id) {
		const success = await dbModel.deletePet(pet_id);
		if (success) {
			res.redirect(`/showPets?id=${person_id}`);
		} else {
			res.render("error", { message: "Error writing to MySQL" });
			console.log("Error writing to mysql");
		}
	}
});

// router.get("/showBooks", async (req, res) => {
// 	const [allAuthorBooks, author] = await dbModel.getBooksByAuthor(req.query.id);
// 	res.locals.allAuthorBooks = allAuthorBooks;
// 	res.locals.author = author[0];

// 	res.render("authorBooks");
// });

// router.post("/addBook", async (req, res) => {
// 	console.log("form submit");
// 	const author_id = req.query.author_id;
// 	try {
// 		const success = await dbModel.addBook(req.body, author_id);
// 		if (success) {
// 			res.redirect(`/showBooks?id=${author_id}`);
// 		} else {
// 			res.render("error", { message: "Error writing to MySQL" });
// 			console.log("Error writing to MySQL");
// 		}
// 	} catch (err) {
// 		res.render("error", { message: "Error writing to MySQL" });
// 		console.log("Error writing to MySQL");
// 		console.log(err);
// 	}
// });

// router.get("/deleteBook", async (req, res) => {
// 	let { book_id, author_id } = req.query;
// 	if (book_id) {
// 		const success = await dbModel.deleteBookById(book_id);
// 		if (success) {
// 			res.redirect(`/showBooks?id=${author_id}`);
// 		} else {
// 			res.render("error", { message: "Error writing to MySQL" });
// 			console.log("Error writing to mysql");
// 			console.log(err);
// 		}
// 	}
// });

module.exports = router;
