import dbConnect from "@/app/lib/dbConnect";
import Student from "@/app/lib/models/Student";
import { NextResponse } from "next/server";

export default async function handler(req, res) {
  await dbConnect();

  const {
    query: { id },
    method,
  } = req;

  switch (method) {
    case "GET":
      try {
        const students = await Student.find({});
        return NextResponse.json(students);
      } catch (err) {
        return NextResponse.json({ error: err.message });
      }

    case "POST":
      try {
        const { name, age, grade } = JSON.parse(req.body);
        const newStudent = new Student({ name, age, grade });
        const savedStudent = await newStudent.save();
        return NextResponse.json(savedStudent);
      } catch (err) {
        return NextResponse.json({ error: err.message });
      }

    case "PUT":
      try {
        const { name, age, grade } = JSON.parse(req.body);
        const updatedStudent = await Student.findByIdAndUpdate(
          id,
          { name, age, grade },
          { new: true }
        );

        if (!updatedStudent) {
          return NextResponse.json({ error: `Student with ID ${id} not found` });
        }

        return NextResponse.json(updatedStudent);
      } catch (err) {
        return NextResponse.json({ error: err.message });
      }

    case "DELETE":
      try {
        const deletedStudent = await Student.findByIdAndDelete(id);

        if (!deletedStudent) {
          return NextResponse.json({ error: `Student with ID ${id} not found` });
        }

        return NextResponse.json({
          message: `Student with ID ${id} deleted successfully`,
        });
      } catch (err) {
        return NextResponse.json({ error: err.message });
      }

    default:
      return NextResponse.json({ error: `Method ${method} Not Allowed` });
  }
}