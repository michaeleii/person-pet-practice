const database = include("/databaseConnection");

async function getAllPeople() {
	let sqlQuery = `
		SELECT person.person_id, first_name, last_name, COUNT(pet_id) as "pet_count"
	FROM person
	LEFT JOIN person_pet
	ON person.person_id = person_pet.person_id
	GROUP BY person.person_id;
	`;

	try {
		const results = await database.query(sqlQuery);
		return results[0];
	} catch (err) {
		console.log("Error selecting from person table or person_pet table");
		console.log(err);
		return null;
	}
}

async function addPerson(postData) {
	let sqlQuery = `
	INSERT INTO person (first_name, last_name)
	VALUES (:first_name, :last_name);
	`;
	let params = {
		first_name: postData.first_name,
		last_name: postData.last_name,
	};
	try {
		await database.query(sqlQuery, params);
		return true;
	} catch (err) {
		console.log(err);
		return false;
	}
}

async function deletePerson(person_id) {
	let sqlDeletePerson = `
	DELETE FROM person
	WHERE person_id = :person_id
	`;
	let params = {
		person_id: person_id,
	};
	console.log(sqlDeletePerson);
	try {
		await database.query(sqlDeletePerson, params);
		return true;
	} catch (err) {
		console.log(err);
		return false;
	}
}

async function getPersonPets(person_id) {
	let sqlQuery = `
	SELECT pet.pet_id, pet.name, pet_type.type 
	FROM person_pet
	LEFT JOIN pet
	ON person_pet.pet_id = pet.pet_id
	LEFT JOIN pet_type
	ON pet.pet_type_id = pet_type.pet_type_id
	WHERE person_pet.person_id = :person_id;
	`;
	let sqlOwner = `
	SELECT person_id, first_name, last_name
	FROM person
	WHERE person_id = :person_id;
	`;
	let params = {
		person_id: person_id,
	};
	try {
		const results = await database.query(sqlQuery, params);
		const results2 = await database.query(sqlOwner, params);
		return [results[0], results2[0][0]];
	} catch (err) {
		console.log("Error selecting from person, person_pet, pet, pet_type table");
		console.log(err);
		return null;
	}
}

async function addPet(postData) {
	let sqlQuery = `
	SELECT pet_type_id
	FROM pet_type
	WHERE type = :type;
	`;
	let params = {
		type: postData.type,
	};
	try {
		let petType = await database.query(sqlQuery, params);
		let petTypeId;
		if (!petType[0].length) {
			let sqlInsertPetType = `
			INSERT INTO pet_type (type)
			VALUES (:type);
			`;
			const result = await database.query(sqlInsertPetType, params);
			petTypeId = result[0].insertId;
		} else {
			petTypeId = petType[0][0].pet_type_id;
		}
		let sqlInsertPet = `
		INSERT INTO pet (name, pet_type_id)
		VALUES (:name, :pet_type_id);
		`;
		let params2 = {
			name: postData.name,
			pet_type_id: petTypeId,
		};
		const [pet] = await database.query(sqlInsertPet, params2);
		let petId = pet.insertId;

		let sqlInsertPersonPet = `
		INSERT INTO person_pet (person_id, pet_id)
		VALUES (:person_id, :pet_id);
		`;
		let params3 = {
			person_id: postData.person_id,
			pet_id: petId,
		};
		await database.query(sqlInsertPersonPet, params3);

		return true;
	} catch (err) {
		console.log(err);
		return false;
	}
}

async function deletePet(pet_id) {
	let sqlDeletePet = `
	DELETE FROM pet
	WHERE pet_id = :pet_id
	`;
	let sqlDeletePersonPet = `
	DELETE FROM person_pet
	WHERE pet_id = :pet_id
	`;
	let params = {
		pet_id: pet_id,
	};

	try {
		await database.query(sqlDeletePersonPet, params);
		await database.query(sqlDeletePet, params);
		return true;
	} catch (err) {
		console.log(err);
		return false;
	}
}

module.exports = {
	getAllPeople,
	addPerson,
	deletePerson,
	getPersonPets,
	addPet,
	deletePet,
};
