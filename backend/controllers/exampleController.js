import Person from "../models/person.js";

export const getPerson = async (req, res) => {
    try {
        const person = await Person.findById(req.params.id);
        res.status(200).json(person);
        console.log("AAAA");
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const deletePerson = async (req, res) => {
    try {
        await Person.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Person deleted successfully' });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getPeople = async (req, res) => {
    try {
        const people = await Person.find();
        res.status(200).json(people);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const createPerson = async (req, res) => {
    const example = req.body;
    const newPerson = new Person(example);
    try {
        await newPerson.save();
        res.status(201).json(newPerson);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}