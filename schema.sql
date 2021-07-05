CREATE TABLE departments (
    department_code TEXT PRIMARY KEY,
    full_name TEXT
);


CREATE TABLE users (
    email TEXT PRIMARY KEY,
    password TEXT,
    name TEXT,
    department TEXT REFERENCES departments ON DELETE CASCADE,
    position TEXT,
    location TEXT,
    trainer BOOLEAN DEFAULT FALSE
);


CREATE TABLE quizzes (
    id SERIAL PRIMARY KEY,
    name TEXT,
    description TEXT,
    instructions TEXT
);


CREATE TABLE assignments (
    id SERIAL PRIMARY KEY,
    task INTEGER REFERENCES quizzes ON DELETE CASCADE,
    user_email TEXT REFERENCES users ON DELETE CASCADE,
    completed BOOLEAN DEFAULT FALSE,
    score decimal(4, 1)
);

    
CREATE TABLE quiz_questions (
    id SERIAL PRIMARY KEY,
    quiz_id INTEGER REFERENCES quizzes ON DELETE CASCADE,
    question_number INTEGER,
    link_to_content TEXT,
    question_text TEXT
);


CREATE TABLE quiz_answers (
    id SERIAL PRIMARY KEY,
    question_id INTEGER REFERENCES quiz_questions ON DELETE CASCADE,
    answer_text TEXT,
    correct BOOLEAN
);