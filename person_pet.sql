SELECT first_name, last_name, COUNT(pet_id) as "Number of Pets"
FROM person
LEFT JOIN person_pet
ON person.person_id = person_pet.person_id
GROUP BY person.person_id;

SELECT pet.name, pet_type.type 
FROM person_pet
LEFT JOIN pet
ON person_pet.pet_id = pet.pet_id
LEFT JOIN pet_type
ON pet.pet_type_id = pet_type.pet_type_id
WHERE person_pet.person_id = 2