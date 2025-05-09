INSERT INTO public.users
VALUES (false, '2b0a5f12-c101-4667-9666-0a3e74adf9ba', 'teacher', 'Teacher', 'teacher');
INSERT INTO public.users
VALUES (false, '9a195c3c-d644-4fe5-a9e9-71e6387e81d5', 'student', 'Student', 'student');
INSERT INTO public.users
VALUES (false, 'd355c40c-2092-40a7-9db9-83ddef900164', 'student1', 'Student', 'student1');

INSERT INTO public.questions
VALUES (true, true, '2025-05-09 10:20:42.414145+00', '2b0a5f12-c101-4667-9666-0a3e74adf9ba',
        '5622480b-03f9-4788-af4a-507ac64502bb', 'Question Example #1',
        '{"format":"csharp","code":"int a = P_1;\nint b = P_2 * a;\na *= -3;\nint c = b - a;\nConsole.WriteLine(c);"}',
        '"python"');
INSERT INTO public.questions
VALUES (true, true, '2025-05-09 10:43:00.231255+00', '2b0a5f12-c101-4667-9666-0a3e74adf9ba',
        '75dd7aef-199a-4191-a61f-ec69885a8cd5', 'Question Example #2',
        '{"format":"kotlin","code":"var a = P_1\nfor (i in 1..P_2) {\n    a += i\n}\nprintln(a)"}', '"python"');
INSERT INTO public.questions
VALUES (false, true, '2025-05-09 10:54:58.2637+00', '2b0a5f12-c101-4667-9666-0a3e74adf9ba',
        'e890b187-f3fc-4af1-ab88-1435066b9d4a', 'Question Example #1',
        '{"format":"csharp","code":"int a = P_1;\nint b = P_2 * a;\na *= -3;\nint c = b - a;\nConsole.WriteLine(c);"}',
        '"python"');
INSERT INTO public.questions
VALUES (false, true, '2025-05-09 10:54:58.265036+00', '2b0a5f12-c101-4667-9666-0a3e74adf9ba',
        '181baf83-4592-4bda-b64d-b850fe205677', 'Question Example #2',
        '{"format":"kotlin","code":"var a = P_1\nfor (i in 1..P_2) {\n    a += i\n}\nprintln(a)"}', '"python"');

INSERT INTO public.codes
VALUES ('7b81a54e-729f-4660-9672-e9edab528bcb', 'return a * (b + 3)', '"Str"');
INSERT INTO public.codes
VALUES ('82871b3e-fb71-412d-a66b-d253ebd473b4', 'return str(b) + ".23"', '"Str"');
INSERT INTO public.codes
VALUES ('601b8aa3-d18c-4d9c-8128-ef6de05c5484', 'return a * (b - 3) + (c - 2)', '"Str"');
INSERT INTO public.codes
VALUES ('2bac0d5b-65fc-49a3-9a7d-a5815e4cd3b3', 'return a * (-b + 3) + (c -1)', '"Str"');
INSERT INTO public.codes
VALUES ('48fdc089-25e1-46bd-b5aa-f2a10df77635', 'return c', '"Str"');
INSERT INTO public.codes
VALUES ('b7f97bfc-4dd9-4871-8f18-0c4b4dc92f11', 'return a + (b * (b + 1) // 2)', '"Str"');
INSERT INTO public.codes
VALUES ('70b8b506-dc74-43f0-9fb2-7f2a374008fd', 'return a + b * 3', '"Str"');
INSERT INTO public.codes
VALUES ('d87ff211-6391-4e0d-bf58-69037c5d95a1', 'return b + a', '"Str"');
INSERT INTO public.codes
VALUES ('ddbe9fc3-9e1f-4f14-94bb-c46b1348a18f', 'return a', '"Str"');
INSERT INTO public.codes
VALUES ('67f7114b-5367-43f3-a9eb-c0d9c4359e51', 'return a * (b + 3)', '"Str"');
INSERT INTO public.codes
VALUES ('069faaaf-7c33-449a-9cfe-2a658e3385bf', 'return str(b) + ".23"', '"Str"');
INSERT INTO public.codes
VALUES ('57a7f4db-e612-438f-8415-425923cac7a3', 'return a * (b - 3) + (c - 2)', '"Str"');
INSERT INTO public.codes
VALUES ('cb93bba0-f2aa-4a16-a52f-1a2f8ccf8af9', 'return a * (-b + 3) + (c -1)', '"Str"');
INSERT INTO public.codes
VALUES ('af806005-4339-4c3a-bba8-485fe520830e', 'return c', '"Str"');
INSERT INTO public.codes
VALUES ('fd9e99b2-35c5-4a79-a67f-2d3fc1530637', 'return a + (b * (b + 1) // 2)', '"Str"');
INSERT INTO public.codes
VALUES ('720f47b8-4566-4d1b-8025-e0b72bfe2ad0', 'return a + b * 3', '"Str"');
INSERT INTO public.codes
VALUES ('5af63eaf-5d25-4d0b-9359-b1f9d0c4cef8', 'return b + a', '"Str"');
INSERT INTO public.codes
VALUES ('25ccf054-8026-417e-9f9b-a8de9cb3c31c', 'return a', '"Str"');

INSERT INTO public.question_call_args
VALUES ('5622480b-03f9-4788-af4a-507ac64502bb', '{"identifier":"P_1","name":"a"}');
INSERT INTO public.question_call_args
VALUES ('5622480b-03f9-4788-af4a-507ac64502bb', '{"identifier":"P_2","name":"b"}');
INSERT INTO public.question_call_args
VALUES ('5622480b-03f9-4788-af4a-507ac64502bb', '{"identifier":"P_3","name":"c"}');
INSERT INTO public.question_call_args
VALUES ('75dd7aef-199a-4191-a61f-ec69885a8cd5', '{"identifier":"P_1","name":"a"}');
INSERT INTO public.question_call_args
VALUES ('75dd7aef-199a-4191-a61f-ec69885a8cd5', '{"identifier":"P_2","name":"b"}');
INSERT INTO public.question_call_args
VALUES ('75dd7aef-199a-4191-a61f-ec69885a8cd5', '{"identifier":"P_2","name":"c"}');
INSERT INTO public.question_call_args
VALUES ('e890b187-f3fc-4af1-ab88-1435066b9d4a', '{"identifier":"P_1","name":"a"}');
INSERT INTO public.question_call_args
VALUES ('e890b187-f3fc-4af1-ab88-1435066b9d4a', '{"identifier":"P_2","name":"b"}');
INSERT INTO public.question_call_args
VALUES ('e890b187-f3fc-4af1-ab88-1435066b9d4a', '{"identifier":"P_3","name":"c"}');
INSERT INTO public.question_call_args
VALUES ('181baf83-4592-4bda-b64d-b850fe205677', '{"identifier":"P_1","name":"a"}');
INSERT INTO public.question_call_args
VALUES ('181baf83-4592-4bda-b64d-b850fe205677', '{"identifier":"P_2","name":"b"}');
INSERT INTO public.question_call_args
VALUES ('181baf83-4592-4bda-b64d-b850fe205677', '{"identifier":"P_2","name":"c"}');

INSERT INTO public.variants
VALUES (true, '2025-05-09 10:24:58.113679+00', '48fdc089-25e1-46bd-b5aa-f2a10df77635',
        '2b0a5f12-c101-4667-9666-0a3e74adf9ba', 'fcefc9f7-a8e5-4afd-88cb-60f948a3eb0b');
INSERT INTO public.variants
VALUES (true, '2025-05-09 10:25:18.397905+00', '7b81a54e-729f-4660-9672-e9edab528bcb',
        '2b0a5f12-c101-4667-9666-0a3e74adf9ba', 'd68d3a96-fd49-463c-b55d-b7aef780f2f6');
INSERT INTO public.variants
VALUES (true, '2025-05-09 10:25:25.209015+00', '601b8aa3-d18c-4d9c-8128-ef6de05c5484',
        '2b0a5f12-c101-4667-9666-0a3e74adf9ba', 'e30ef0f7-0f7d-42d0-a118-52b5d0c0ce91');
INSERT INTO public.variants
VALUES (true, '2025-05-09 10:25:38.210763+00', '2bac0d5b-65fc-49a3-9a7d-a5815e4cd3b3',
        '2b0a5f12-c101-4667-9666-0a3e74adf9ba', '5186d95a-8eae-4447-8dd0-b13b1f572208');
INSERT INTO public.variants
VALUES (true, '2025-05-09 10:38:03.529176+00', '82871b3e-fb71-412d-a66b-d253ebd473b4',
        '2b0a5f12-c101-4667-9666-0a3e74adf9ba', '006443c2-e250-49c1-9440-28278bb79706');
INSERT INTO public.variants
VALUES (true, '2025-05-09 10:50:31.200511+00', 'b7f97bfc-4dd9-4871-8f18-0c4b4dc92f11',
        '2b0a5f12-c101-4667-9666-0a3e74adf9ba', '45325f70-8b99-4bdf-b420-d6c034e41f9a');
INSERT INTO public.variants
VALUES (true, '2025-05-09 10:50:39.939391+00', '70b8b506-dc74-43f0-9fb2-7f2a374008fd',
        '2b0a5f12-c101-4667-9666-0a3e74adf9ba', '99a93568-b631-4af5-b5c3-4bd2a7089a8c');
INSERT INTO public.variants
VALUES (true, '2025-05-09 10:50:56.856356+00', 'd87ff211-6391-4e0d-bf58-69037c5d95a1',
        '2b0a5f12-c101-4667-9666-0a3e74adf9ba', '9ffa19bd-fc47-4482-8fc7-3279c7a9d4e7');
INSERT INTO public.variants
VALUES (true, '2025-05-09 10:51:03.677478+00', 'ddbe9fc3-9e1f-4f14-94bb-c46b1348a18f',
        '2b0a5f12-c101-4667-9666-0a3e74adf9ba', '12a88704-c1e6-4c90-a85f-a06dcd56859a');
INSERT INTO public.variants
VALUES (false, '2025-05-09 10:54:58.264053+00', '67f7114b-5367-43f3-a9eb-c0d9c4359e51',
        '2b0a5f12-c101-4667-9666-0a3e74adf9ba', 'cc24314f-6158-4ef0-b1d6-37468b37014e');
INSERT INTO public.variants
VALUES (false, '2025-05-09 10:54:58.264492+00', '069faaaf-7c33-449a-9cfe-2a658e3385bf',
        '2b0a5f12-c101-4667-9666-0a3e74adf9ba', 'e34ca096-5d8c-4cc0-b8c1-566bedb446a8');
INSERT INTO public.variants
VALUES (false, '2025-05-09 10:54:58.264494+00', '57a7f4db-e612-438f-8415-425923cac7a3',
        '2b0a5f12-c101-4667-9666-0a3e74adf9ba', '2c54a72d-d66b-4af2-9f2e-149f426c7426');
INSERT INTO public.variants
VALUES (false, '2025-05-09 10:54:58.264494+00', 'cb93bba0-f2aa-4a16-a52f-1a2f8ccf8af9',
        '2b0a5f12-c101-4667-9666-0a3e74adf9ba', '68304584-1697-4990-8132-c46a0cee2f68');
INSERT INTO public.variants
VALUES (false, '2025-05-09 10:54:58.264495+00', 'af806005-4339-4c3a-bba8-485fe520830e',
        '2b0a5f12-c101-4667-9666-0a3e74adf9ba', '39a1e73f-ce55-4fc2-9fd7-eccaa06c3190');
INSERT INTO public.variants
VALUES (false, '2025-05-09 10:54:58.265319+00', 'fd9e99b2-35c5-4a79-a67f-2d3fc1530637',
        '2b0a5f12-c101-4667-9666-0a3e74adf9ba', '792977ba-e876-409c-9f23-be2069fd78e6');
INSERT INTO public.variants
VALUES (false, '2025-05-09 10:54:58.265609+00', '720f47b8-4566-4d1b-8025-e0b72bfe2ad0',
        '2b0a5f12-c101-4667-9666-0a3e74adf9ba', '1fbb2959-4bf5-4373-a138-739dfb57e923');
INSERT INTO public.variants
VALUES (false, '2025-05-09 10:54:58.26561+00', '5af63eaf-5d25-4d0b-9359-b1f9d0c4cef8',
        '2b0a5f12-c101-4667-9666-0a3e74adf9ba', '9600c73e-b583-4903-8cec-ee4f284702f7');
INSERT INTO public.variants
VALUES (false, '2025-05-09 10:54:58.265611+00', '25ccf054-8026-417e-9f9b-a8de9cb3c31c',
        '2b0a5f12-c101-4667-9666-0a3e74adf9ba', 'ae75ee03-65c7-436f-a552-f9b36d10136f');

INSERT INTO public.question_correct_variants
VALUES ('5622480b-03f9-4788-af4a-507ac64502bb', 'd68d3a96-fd49-463c-b55d-b7aef780f2f6');
INSERT INTO public.question_correct_variants
VALUES ('75dd7aef-199a-4191-a61f-ec69885a8cd5', '45325f70-8b99-4bdf-b420-d6c034e41f9a');
INSERT INTO public.question_correct_variants
VALUES ('e890b187-f3fc-4af1-ab88-1435066b9d4a', 'cc24314f-6158-4ef0-b1d6-37468b37014e');
INSERT INTO public.question_correct_variants
VALUES ('181baf83-4592-4bda-b64d-b850fe205677', '792977ba-e876-409c-9f23-be2069fd78e6');

INSERT INTO public.question_incorrect_variants
VALUES ('5622480b-03f9-4788-af4a-507ac64502bb', 'fcefc9f7-a8e5-4afd-88cb-60f948a3eb0b');
INSERT INTO public.question_incorrect_variants
VALUES ('5622480b-03f9-4788-af4a-507ac64502bb', 'e30ef0f7-0f7d-42d0-a118-52b5d0c0ce91');
INSERT INTO public.question_incorrect_variants
VALUES ('5622480b-03f9-4788-af4a-507ac64502bb', '5186d95a-8eae-4447-8dd0-b13b1f572208');
INSERT INTO public.question_incorrect_variants
VALUES ('5622480b-03f9-4788-af4a-507ac64502bb', '006443c2-e250-49c1-9440-28278bb79706');
INSERT INTO public.question_incorrect_variants
VALUES ('75dd7aef-199a-4191-a61f-ec69885a8cd5', '99a93568-b631-4af5-b5c3-4bd2a7089a8c');
INSERT INTO public.question_incorrect_variants
VALUES ('75dd7aef-199a-4191-a61f-ec69885a8cd5', '9ffa19bd-fc47-4482-8fc7-3279c7a9d4e7');
INSERT INTO public.question_incorrect_variants
VALUES ('75dd7aef-199a-4191-a61f-ec69885a8cd5', '12a88704-c1e6-4c90-a85f-a06dcd56859a');
INSERT INTO public.question_incorrect_variants
VALUES ('e890b187-f3fc-4af1-ab88-1435066b9d4a', 'e34ca096-5d8c-4cc0-b8c1-566bedb446a8');
INSERT INTO public.question_incorrect_variants
VALUES ('e890b187-f3fc-4af1-ab88-1435066b9d4a', '2c54a72d-d66b-4af2-9f2e-149f426c7426');
INSERT INTO public.question_incorrect_variants
VALUES ('e890b187-f3fc-4af1-ab88-1435066b9d4a', '68304584-1697-4990-8132-c46a0cee2f68');
INSERT INTO public.question_incorrect_variants
VALUES ('e890b187-f3fc-4af1-ab88-1435066b9d4a', '39a1e73f-ce55-4fc2-9fd7-eccaa06c3190');
INSERT INTO public.question_incorrect_variants
VALUES ('181baf83-4592-4bda-b64d-b850fe205677', '1fbb2959-4bf5-4373-a138-739dfb57e923');
INSERT INTO public.question_incorrect_variants
VALUES ('181baf83-4592-4bda-b64d-b850fe205677', '9600c73e-b583-4903-8cec-ee4f284702f7');
INSERT INTO public.question_incorrect_variants
VALUES ('181baf83-4592-4bda-b64d-b850fe205677', 'ae75ee03-65c7-436f-a552-f9b36d10136f');

INSERT INTO public.question_placeholder_definitions
VALUES ('5622480b-03f9-4788-af4a-507ac64502bb', 'P_2', '{"type":"i32_range","start":2,"end":4}');
INSERT INTO public.question_placeholder_definitions
VALUES ('5622480b-03f9-4788-af4a-507ac64502bb', 'P_1', '{"type":"i32_random_one_of","options":[1,2,5,10,20]}');
INSERT INTO public.question_placeholder_definitions
VALUES ('5622480b-03f9-4788-af4a-507ac64502bb', 'P_3', '{"type":"i32_random_one_of","options":[1,2,3]}');
INSERT INTO public.question_placeholder_definitions
VALUES ('75dd7aef-199a-4191-a61f-ec69885a8cd5', 'P_2', '{"type":"i32_range","start":2,"end":5}');
INSERT INTO public.question_placeholder_definitions
VALUES ('75dd7aef-199a-4191-a61f-ec69885a8cd5', 'P_1', '{"type":"i32_random_one_of","options":[10,20,30]}');
INSERT INTO public.question_placeholder_definitions
VALUES ('e890b187-f3fc-4af1-ab88-1435066b9d4a', 'P_3', '{"type":"i32_random_one_of","options":[1,2,3]}');
INSERT INTO public.question_placeholder_definitions
VALUES ('e890b187-f3fc-4af1-ab88-1435066b9d4a', 'P_2', '{"type":"i32_range","start":2,"end":4}');
INSERT INTO public.question_placeholder_definitions
VALUES ('e890b187-f3fc-4af1-ab88-1435066b9d4a', 'P_1', '{"type":"i32_random_one_of","options":[1,2,5,10,20]}');
INSERT INTO public.question_placeholder_definitions
VALUES ('181baf83-4592-4bda-b64d-b850fe205677', 'P_2', '{"type":"i32_range","start":2,"end":5}');
INSERT INTO public.question_placeholder_definitions
VALUES ('181baf83-4592-4bda-b64d-b850fe205677', 'P_1', '{"type":"i32_random_one_of","options":[10,20,30]}');

INSERT INTO public.test_models
VALUES ('2025-05-09 10:54:45.994245+00', '2b0a5f12-c101-4667-9666-0a3e74adf9ba', '05282ebb-5241-47e2-a1b5-0121a1b9fe96',
        'Test Example #1');

INSERT INTO public.test_models_questions
VALUES ('5622480b-03f9-4788-af4a-507ac64502bb', '05282ebb-5241-47e2-a1b5-0121a1b9fe96');
INSERT INTO public.test_models_questions
VALUES ('75dd7aef-199a-4191-a61f-ec69885a8cd5', '05282ebb-5241-47e2-a1b5-0121a1b9fe96');