import React, { useState, useEffect } from "react";
import AdminNavBar from "./AdminNavBar";
import QuestionForm from "./QuestionForm";
import QuestionList from "./QuestionList";

function App() {
  const [page, setPage] = useState("List");
  const [questions, setQuestions] = useState([]);

  // Fetch questions on mount
  useEffect(() => {
    fetch("http://localhost:4000/questions")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch questions");
        return res.json();
      })
      .then((data) => setQuestions(data))
      .catch((error) => console.error(error));
  }, []);

  // Add a new question (called from QuestionForm)
  function handleAddQuestion(newQuestion) {
    fetch("http://localhost:4000/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newQuestion),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to add question");
        return res.json();
      })
      .then((savedQuestion) => {
        setQuestions((questions) => [...questions, savedQuestion]);
        setPage("List"); // Navigate back to list after adding
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // Delete a question (called from QuestionItem via QuestionList)
  function handleDeleteQuestion(id) {
    fetch(`http://localhost:4000/questions/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete question");
        setQuestions((questions) => questions.filter((q) => q.id !== id));
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // Update correct answer (PATCH)
  function handleUpdateCorrectIndex(id, newIndex) {
    fetch(`http://localhost:4000/questions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correctIndex: Number(newIndex) }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update question");
        return res.json();
      })
      .then((updatedQuestion) => {
        setQuestions((questions) =>
          questions.map((q) =>
            q.id === updatedQuestion.id
              ? {
                  ...updatedQuestion,
                  correctIndex: Number(updatedQuestion.correctIndex),
                }
              : q
          )
        );
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <main>
      <AdminNavBar onChangePage={setPage} />
      {page === "Form" ? (
        <QuestionForm onAddQuestion={handleAddQuestion} />
      ) : (
        <QuestionList
          questions={questions}
          onDelete={handleDeleteQuestion}
          onUpdate={handleUpdateCorrectIndex}
        />
      )}
    </main>
  );
}

export default App;
