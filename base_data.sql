INSERT INTO departments ( department_code, full_name )
VALUES ('T1', 'Technical Support Tier 1'), ('STS', 'Senior Technical Support'),
    ('TCS', 'Technical Chat Support'), ('ERT', 'Escalation Response Team');

-- '$2b$16$cmYcUmGUoP.rZziNMelNJOPalA2YAhn.XRaEzQiP26dUgdXQS9o2G'

INSERT INTO users ( email, password, name, department, position, location, trainer )
VALUES ('dames@team.nxlink.com', '$2b$16$cmYcUmGUoP.rZziNMelNJOPalA2YAhn.XRaEzQiP26dUgdXQS9o2G',
    'David Ames', 'ERT', 'Escalation Response Specialist', 'WFH', TRUE),
    ('splugge@team.nxlink.com', '$2b$16$cmYcUmGUoP.rZziNMelNJOPalA2YAhn.XRaEzQiP26dUgdXQS9o2G', 
    'Sydney Plugge', 'ERT', 'Escalation Response Specialist', 'WFH', FALSE),
    ('msalazar@team.nxlink.com', '$2b$16$cmYcUmGUoP.rZziNMelNJOPalA2YAhn.XRaEzQiP26dUgdXQS9o2G',
    'Marco Salazar', 'TCS', 'Technical Chat Support Lead', 'FTW', TRUE),
    ('kcarpenter@team.nxlink.com', '$2b$16$cmYcUmGUoP.rZziNMelNJOPalA2YAhn.XRaEzQiP26dUgdXQS9o2G',
    'Keenan Carpenter', 'T1', 'Technical Support Agent', 'FTW', FALSE);

INSERT INTO quizzes ( name, description, instructions )
VALUES ('Test Quiz', 'A test of the quiz system', 'Click True and submit');

INSERT INTO assignments ( task, user_email, completed, score )
VALUES (1, 'dames@team.nxlink.com', FALSE, 0),
(1, 'splugge@team.nxlink.com', TRUE, 100);

INSERT INTO quiz_questions ( quiz_id, question_number, link_to_content,
    question_text )
VALUES (1, 1, NULL, 'Select True');

INSERT INTO quiz_answers ( question_id, answer_text, correct )
VALUES (1, 'True', TRUE);