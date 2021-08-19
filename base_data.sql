INSERT INTO departments ( department_code, description )
VALUES ('T1', 'Technical Support Tier 1'), ('STS', 'Senior Technical Support'),
    ('TCS', 'Technical Chat Support'), ('ERT', 'Escalation Response Team');

-- '$2b$16$cmYcUmGUoP.rZziNMelNJOPalA2YAhn.XRaEzQiP26dUgdXQS9o2G'

INSERT INTO users ( email, password, name, department, position, location, isAdmin )
VALUES ('dames@team.nxlink.com', '$2b$16$cmYcUmGUoP.rZziNMelNJOPalA2YAhn.XRaEzQiP26dUgdXQS9o2G',
    'David Ames', 'ERT', 'Escalation Response Specialist', 'WFH', TRUE),
    ('splugge@team.nxlink.com', '$2b$16$cmYcUmGUoP.rZziNMelNJOPalA2YAhn.XRaEzQiP26dUgdXQS9o2G', 
    'Sydney Plugge', 'ERT', 'Escalation Response Specialist', 'WFH', FALSE),
    ('msalazar@team.nxlink.com', '$2b$16$cmYcUmGUoP.rZziNMelNJOPalA2YAhn.XRaEzQiP26dUgdXQS9o2G',
    'Marco Salazar', 'TCS', 'Technical Chat Support Lead', 'FTW', TRUE),
    ('kcarpenter@team.nxlink.com', '$2b$16$cmYcUmGUoP.rZziNMelNJOPalA2YAhn.XRaEzQiP26dUgdXQS9o2G',
    'Keenan Carpenter', 'T1', 'Technical Support Agent', 'FTW', FALSE);

INSERT INTO quizzes ( name, description, instructions )
VALUES ('Test Quiz', 'A test of the quiz system', 'Click True and submit'),
('Second Test Quiz', 'Testing API', 'Click True Twice and submit'),
('First Guitar Lesson', 'Your very first guitar lesson', 'Watch video and answer the questions that follow');

INSERT INTO assignments ( quiz_id, user_email, completed, score )
VALUES (1, 'dames@team.nxlink.com', TRUE, 100),
(2, 'dames@team.nxlink.com', FALSE, 0),
(1, 'splugge@team.nxlink.com', TRUE, 100),
(3, 'dames@team.nxlink.com', FALSE, 0);

INSERT INTO quiz_questions ( quiz_id, question_number, link_to_content,
    question_text )
VALUES (1, 1, NULL, 'Select True'),
(2, 2, NULL, 'SELECT TRUE'),
(2, 2, NULL, 'SELECT TRUE AGAIN'),
(3, 1, 'https://www.youtube.com/embed/HNSaXAe8tyg', ''),
(3, 2, NULL, 'How many strings does a guitar have?'),
(3, 3, NULL, 'What is the instructor`s name?');

INSERT INTO quiz_answers ( question_id, answer_text, correct )
VALUES (1, 'True', TRUE), (1, 'False', FALSE), 
(2, 'True', TRUE), (2, 'False', FALSE), 
(3, 'True', TRUE), (3, 'False', FALSE),
(5, '4', FALSE), (5, '6', TRUE),
(5, '3', FALSE), (5, '7', FALSE),
(6, 'Bob', FALSE), (6, 'Dave', FALSE),
(6, 'Michael', FALSE), (6, 'Marty', TRUE),
(4, 'Complete?', TRUE);