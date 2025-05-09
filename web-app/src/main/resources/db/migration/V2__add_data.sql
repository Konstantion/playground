INSERT INTO public.users
VALUES (false, '2b0a5f12-c101-4667-9666-0a3e74adf9ba', 'teacher', 'Teacher', 'teacher');
INSERT INTO public.users
VALUES (false, '9a195c3c-d644-4fe5-a9e9-71e6387e81d5', 'student', 'Student', 'student');
INSERT INTO public.users
VALUES (false, 'd355c40c-2092-40a7-9db9-83ddef900164', 'student1', 'Student', 'student1');


INSERT INTO public.questions
VALUES (true, true, '2025-05-08 12:52:49.782005+00', '2b0a5f12-c101-4667-9666-0a3e74adf9ba',
        '28390539-6a70-4ab4-8eb5-d80a6a1eb4b3', 'Question 1', '{"format":"python","code":"print(''Hello, world!'')"}',
        '"python"');
INSERT INTO public.questions
VALUES (true, true, '2025-05-08 12:54:51.438977+00', '2b0a5f12-c101-4667-9666-0a3e74adf9ba',
        'c1cc0172-f55e-446c-b717-f6ec53a65196', 'Question 2', '{"format":"python","code":"print(''Hello, world!'')"}',
        '"python"');
INSERT INTO public.questions
VALUES (false, true, '2025-05-08 12:56:34.439492+00', '2b0a5f12-c101-4667-9666-0a3e74adf9ba',
        'fcfcea25-4f80-4558-a76c-be834c5a4712', 'Question 1', '{"format":"python","code":"print(''Hello, world!'')"}',
        '"python"');
INSERT INTO public.questions
VALUES (false, true, '2025-05-08 12:56:34.441422+00', '2b0a5f12-c101-4667-9666-0a3e74adf9ba',
        '8e90ea82-573b-4025-8ab8-83772d341445', 'Question 2', '{"format":"python","code":"print(''Hello, world!'')"}',
        '"python"');
INSERT INTO public.questions
VALUES (false, true, '2025-05-08 13:04:44.71609+00', '2b0a5f12-c101-4667-9666-0a3e74adf9ba',
        '2ac1f035-eb13-43d4-8af3-4df815d8d93b', 'Question 1', '{"format":"python","code":"print(''Hello, world!'')"}',
        '"python"');
INSERT INTO public.questions
VALUES (false, true, '2025-05-08 13:04:44.718003+00', '2b0a5f12-c101-4667-9666-0a3e74adf9ba',
        'e758f53f-2e72-474d-9326-ae38ef9eec03', 'Question 2', '{"format":"python","code":"print(''Hello, world!'')"}',
        '"python"');
INSERT INTO public.questions
VALUES (false, true, '2025-05-08 13:06:31.726966+00', '2b0a5f12-c101-4667-9666-0a3e74adf9ba',
        'cf35398d-6efe-4540-8408-794d95ab2bc8', 'Question 1', '{"format":"python","code":"print(''Hello, world!'')"}',
        '"python"');
INSERT INTO public.questions
VALUES (false, true, '2025-05-08 13:06:31.730497+00', '2b0a5f12-c101-4667-9666-0a3e74adf9ba',
        '5af3b89c-59ba-4a6c-8afd-22ce157f6bec', 'Question 2', '{"format":"python","code":"print(''Hello, world!'')"}',
        '"python"');
INSERT INTO public.questions
VALUES (false, true, '2025-05-08 21:46:13.262647+00', '2b0a5f12-c101-4667-9666-0a3e74adf9ba',
        '9502f9f0-60af-4907-935b-49ef9822c750', 'Question 1', '{"format":"python","code":"print(''Hello, world!'')"}',
        '"python"');
INSERT INTO public.questions
VALUES (false, true, '2025-05-08 21:46:13.264321+00', '2b0a5f12-c101-4667-9666-0a3e74adf9ba',
        '6f176c79-22ee-4029-9e84-9256be82d7e2', 'Question 2', '{"format":"python","code":"print(''Hello, world!'')"}',
        '"python"');
INSERT INTO public.questions
VALUES (false, true, '2025-05-08 21:53:37.843863+00', '2b0a5f12-c101-4667-9666-0a3e74adf9ba',
        '2ff031fe-83c9-4612-8a3b-65b92d5e41fd', 'Question 1', '{"format":"python","code":"print(''Hello, world!'')"}',
        '"python"');
INSERT INTO public.questions
VALUES (false, true, '2025-05-08 21:53:37.847428+00', '2b0a5f12-c101-4667-9666-0a3e74adf9ba',
        '423149ed-5e0b-43dc-a244-4ac68d56f747', 'Question 2', '{"format":"python","code":"print(''Hello, world!'')"}',
        '"python"');
INSERT INTO public.questions
VALUES (false, true, '2025-05-08 22:52:28.876438+00', '2b0a5f12-c101-4667-9666-0a3e74adf9ba',
        'ba23f875-03a5-419c-8d08-719e57c50fa4', 'Question 1', '{"format":"python","code":"print(''Hello, world!'')"}',
        '"python"');
INSERT INTO public.questions
VALUES (false, true, '2025-05-08 22:52:28.880889+00', '2b0a5f12-c101-4667-9666-0a3e74adf9ba',
        '31c60fd3-59de-40d2-9e5b-1d1276ad9d28', 'Question 2', '{"format":"python","code":"print(''Hello, world!'')"}',
        '"python"');
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



INSERT INTO public.answer
VALUES (1746709566741, '6c6b8550-21b9-42a0-b0dc-75ba028f5aad', 'cf35398d-6efe-4540-8408-794d95ab2bc8', 'FDs41');
INSERT INTO public.answer
VALUES (1746709566743, '6a14d759-a42c-4c3f-b951-befa9321a3b6', 'cf35398d-6efe-4540-8408-794d95ab2bc8', '42');
INSERT INTO public.answer
VALUES (1746709566738, '28d698e6-2e82-4cfb-a42d-0ca77296d7de', 'cf35398d-6efe-4540-8408-794d95ab2bc8', '32');
INSERT INTO public.answer
VALUES (1746709566740, 'e2426ae5-db7b-4c98-85e4-7f02c01246de', 'cf35398d-6efe-4540-8408-794d95ab2bc8', '9');
INSERT INTO public.answer
VALUES (1746709566739, '8537fc45-f276-4b95-8084-3ec7f5cb86db', '5af3b89c-59ba-4a6c-8afd-22ce157f6bec', '19');
INSERT INTO public.answer
VALUES (1746709566742, 'b6317d18-3a90-4193-96c1-213ff1c11d95', '5af3b89c-59ba-4a6c-8afd-22ce157f6bec', '29');
INSERT INTO public.answer
VALUES (1746709566737, 'b377e6e7-2b8b-4944-97c0-5529d21c4ddf', '5af3b89c-59ba-4a6c-8afd-22ce157f6bec', '1stable value');
INSERT INTO public.answer
VALUES (1746736683402, '4f0bdd9b-e0d5-47fb-8da3-6a79776f2abf', 'fcfcea25-4f80-4558-a76c-be834c5a4712', 'ASD35');
INSERT INTO public.answer
VALUES (1746736683403, 'dc4b2a30-ef96-48a8-8efc-769085f4a354', 'fcfcea25-4f80-4558-a76c-be834c5a4712', '42');
INSERT INTO public.answer
VALUES (1746736683397, '717164e6-86b1-4141-9e5a-d1e6e98478a9', 'fcfcea25-4f80-4558-a76c-be834c5a4712', '32');
INSERT INTO public.answer
VALUES (1746736683400, 'aa478669-40cc-48b3-a4aa-99776033bed9', 'fcfcea25-4f80-4558-a76c-be834c5a4712', '3');
INSERT INTO public.answer
VALUES (1746736683399, '17583103-7117-4f07-bb17-dc8f15f1803e', '8e90ea82-573b-4025-8ab8-83772d341445', '29');
INSERT INTO public.answer
VALUES (1746736683401, '135ddf5b-bf50-4aad-b096-55c32b8af634', '8e90ea82-573b-4025-8ab8-83772d341445', '39');
INSERT INTO public.answer
VALUES (1746736683398, '8cf70d02-2c95-44cb-af52-9739e3ee4de6', '8e90ea82-573b-4025-8ab8-83772d341445', '2stable value');
INSERT INTO public.answer
VALUES (1746736683407, '07ba3600-b382-4b09-905d-a4ab9280ffd9', '2ac1f035-eb13-43d4-8af3-4df815d8d93b', 'FDs32');
INSERT INTO public.answer
VALUES (1746736683408, '67caa485-69fc-41ff-a1d2-54b434d3c459', '2ac1f035-eb13-43d4-8af3-4df815d8d93b', '42');
INSERT INTO public.answer
VALUES (1746736683404, '349cff38-8f3a-4255-9158-5dff8b51a5d1', '2ac1f035-eb13-43d4-8af3-4df815d8d93b', '32');
INSERT INTO public.answer
VALUES (1746736683406, 'b5484893-0d8d-435b-975d-83119e2ddf17', '2ac1f035-eb13-43d4-8af3-4df815d8d93b', '0');
INSERT INTO public.answer
VALUES (1746736683409, '15d766f2-6a26-4e3a-8ef4-be5d15c78919', 'e758f53f-2e72-474d-9326-ae38ef9eec03', '12');
INSERT INTO public.answer
VALUES (1746736683410, '6c26bdfd-b67c-45cf-b700-8a30d44ed6a8', 'e758f53f-2e72-474d-9326-ae38ef9eec03', '22');
INSERT INTO public.answer
VALUES (1746736683405, 'faf66c0e-c112-4c64-92c0-ec0e3becb438', 'e758f53f-2e72-474d-9326-ae38ef9eec03', '3stable value');
INSERT INTO public.answer
VALUES (1746736683415, '1808b5ab-cd9e-446f-8751-d38a9db637ae', '2ff031fe-83c9-4612-8a3b-65b92d5e41fd', 'FDs35');
INSERT INTO public.answer
VALUES (1746736683417, '197e5434-6634-45f8-8428-f23e4592f864', '2ff031fe-83c9-4612-8a3b-65b92d5e41fd', '42');
INSERT INTO public.answer
VALUES (1746736683411, 'ff3ada7a-1de6-4936-a66e-cf75cbdba8c8', '2ff031fe-83c9-4612-8a3b-65b92d5e41fd', '32');
INSERT INTO public.answer
VALUES (1746736683413, 'dba123d0-a051-499f-aa16-49af82987ff4', '2ff031fe-83c9-4612-8a3b-65b92d5e41fd', '3');
INSERT INTO public.answer
VALUES (1746736683414, '01c77efe-40ab-47db-a24d-53591c035327', '423149ed-5e0b-43dc-a244-4ac68d56f747', '19');
INSERT INTO public.answer
VALUES (1746736683416, 'e6e8436a-1b1d-47a6-8c82-565775249631', '423149ed-5e0b-43dc-a244-4ac68d56f747', '29');
INSERT INTO public.answer
VALUES (1746736683412, '7b205e02-6010-4e64-a1ed-31a4d7defdad', '423149ed-5e0b-43dc-a244-4ac68d56f747', '2stable value');
INSERT INTO public.answer
VALUES (1746744724800, '201661c6-2d88-4bfb-8aa3-8cefc1934331', 'ba23f875-03a5-419c-8d08-719e57c50fa4', 'FDs39');
INSERT INTO public.answer
VALUES (1746744724801, 'cb4c20be-380b-4f17-bfc7-ae32726d0b0f', 'ba23f875-03a5-419c-8d08-719e57c50fa4', '42');
INSERT INTO public.answer
VALUES (1746744724796, 'dad8f7e4-57db-4524-a131-b8f789140bbe', 'ba23f875-03a5-419c-8d08-719e57c50fa4', '32');
INSERT INTO public.answer
VALUES (1746744724799, 'ab56daa6-02d1-42bd-822e-fead4c278e53', 'ba23f875-03a5-419c-8d08-719e57c50fa4', '7');
INSERT INTO public.answer
VALUES (1746744724797, '372ae5c3-4c9a-4bed-ab88-d283d2935131', '31c60fd3-59de-40d2-9e5b-1d1276ad9d28', '26');
INSERT INTO public.answer
VALUES (1746744724798, '8bb99137-7448-4eca-9228-5d80c2cd6e9c', '31c60fd3-59de-40d2-9e5b-1d1276ad9d28', '36');
INSERT INTO public.answer
VALUES (1746744724795, '2fea4a27-7190-4c8a-8efe-c1359e66c067', '31c60fd3-59de-40d2-9e5b-1d1276ad9d28', '2stable value');
INSERT INTO public.answer
VALUES (1746784764266, '02415f25-d07c-417d-8bde-1b3a075740f4', 'e890b187-f3fc-4af1-ab88-1435066b9d4a', '30');
INSERT INTO public.answer
VALUES (1746784764264, '8742d97e-8aa5-48ec-a22b-099a3c9972ae', 'e890b187-f3fc-4af1-ab88-1435066b9d4a', '1');
INSERT INTO public.answer
VALUES (1746784764261, '07398fc6-65a0-4968-a86a-04a9221f0baa', 'e890b187-f3fc-4af1-ab88-1435066b9d4a', '-1');
INSERT INTO public.answer
VALUES (1746784764260, '4e8d0387-aae6-4311-a3ce-a48ea8a68979', 'e890b187-f3fc-4af1-ab88-1435066b9d4a', '3.23');
INSERT INTO public.answer
VALUES (1746784764262, 'b9ac82f8-fcdc-4184-8d78-a358e55e5ed5', 'e890b187-f3fc-4af1-ab88-1435066b9d4a', '0');
INSERT INTO public.answer
VALUES (1746784764268, '85f41095-d6ec-41b3-92a1-eb2c35932d52', '181baf83-4592-4bda-b64d-b850fe205677', '20');
INSERT INTO public.answer
VALUES (1746784764267, '4c0d71ab-4e1e-4c46-9a01-1efa5092b77a', '181baf83-4592-4bda-b64d-b850fe205677', '10');
INSERT INTO public.answer
VALUES (1746784764263, 'c27993ee-d28c-45aa-af7c-b5e766c70306', '181baf83-4592-4bda-b64d-b850fe205677', '22');
INSERT INTO public.answer
VALUES (1746784764265, 'b7b99b8a-a845-49e4-976c-f621a5b574d2', '181baf83-4592-4bda-b64d-b850fe205677', '14');
INSERT INTO public.answer
VALUES (1746784764276, 'b14ff878-8849-4cff-a9bf-a93939ba33ca', 'e890b187-f3fc-4af1-ab88-1435066b9d4a', '100');
INSERT INTO public.answer
VALUES (1746784764274, 'f928420e-7e0e-4645-9416-23fce6a54b39', 'e890b187-f3fc-4af1-ab88-1435066b9d4a', '2');
INSERT INTO public.answer
VALUES (1746784764271, '0427b870-d762-4612-ba3c-6c08230777c4', 'e890b187-f3fc-4af1-ab88-1435066b9d4a', '-20');
INSERT INTO public.answer
VALUES (1746784764269, 'c05edcbe-3428-4dfb-98ea-f5801ce0eb94', 'e890b187-f3fc-4af1-ab88-1435066b9d4a', '2.23');
INSERT INTO public.answer
VALUES (1746784764273, 'e3889cc4-6f74-4c5b-9218-4d206e069732', 'e890b187-f3fc-4af1-ab88-1435066b9d4a', '21');
INSERT INTO public.answer
VALUES (1746784764277, '5779bc06-cef7-42c9-89d5-0a69c39114d2', '181baf83-4592-4bda-b64d-b850fe205677', '35');
INSERT INTO public.answer
VALUES (1746784764270, '1bb28054-e2ad-4ec4-b11d-07c092c57940', '181baf83-4592-4bda-b64d-b850fe205677', '35');
INSERT INTO public.answer
VALUES (1746784764275, 'f40036d9-0cd7-4f6d-b050-d4de8fd85b15', '181baf83-4592-4bda-b64d-b850fe205677', '20');
INSERT INTO public.answer
VALUES (1746784764272, '5015fa6f-98e1-418d-8d3a-8ce32ce9589d', '181baf83-4592-4bda-b64d-b850fe205677', '25');



INSERT INTO public.codes
VALUES ('0cfbd752-180a-4d5c-9a72-a6fb95b42fed', 'return str(a)', '"Str"');
INSERT INTO public.codes
VALUES ('fb5344eb-54ec-4659-b4ed-b4938d95bbae', 'return b + str(a+c)', '"Str"');
INSERT INTO public.codes
VALUES ('6d8f755f-a7a0-41e9-b78e-085920839025', 'return str(c)', '"Str"');
INSERT INTO public.codes
VALUES ('fc6c1979-6bdb-4b51-8ae1-77c0771433ba', 'return str(10 + a)', '"Str"');
INSERT INTO public.codes
VALUES ('d868192e-129a-4a31-b079-e10db1e11165', 'return str(c)', '"Str"');
INSERT INTO public.codes
VALUES ('5bb46611-884b-4f18-b127-7e49603e7ee9', 'return str(a) + b', '"Str"');
INSERT INTO public.codes
VALUES ('e1014a94-4b07-48d3-a2a7-c5047d651157', 'return 10 + c', '"Str"');
INSERT INTO public.codes
VALUES ('08ce2dc7-3ce9-4e5d-b0c5-8ab5c900c30f', 'return b + str(a+c)', '"Str"');
INSERT INTO public.codes
VALUES ('86ce86b0-aee2-4fae-80d8-b24f4fff2ed9', 'return str(10 + a)', '"Str"');
INSERT INTO public.codes
VALUES ('c88dfbea-0dab-4eef-80ca-138155ff0277', 'return str(a)', '"Str"');
INSERT INTO public.codes
VALUES ('3dd4d7a4-cebf-4a97-9b61-65415d260dd0', 'return str(c)', '"Str"');
INSERT INTO public.codes
VALUES ('9e03f58f-28a7-4510-b539-b70d60e97bed', 'return str(c)', '"Str"');
INSERT INTO public.codes
VALUES ('6674e4ab-e565-42cc-a2e6-8e1ea1308b0c', 'return 10 + c', '"Str"');
INSERT INTO public.codes
VALUES ('e3e908de-9902-4beb-bead-bf673b33dee2', 'return str(a) + b', '"Str"');
INSERT INTO public.codes
VALUES ('668d8648-2574-4e14-8fdd-d59cf9413055', 'return b + str(a+c)', '"Str"');
INSERT INTO public.codes
VALUES ('46ef7df3-0a44-4c70-ae0c-d769b6466785', 'return str(10 + a)', '"Str"');
INSERT INTO public.codes
VALUES ('138a832b-6c7d-46a9-a94b-af597c8eb469', 'return str(a)', '"Str"');
INSERT INTO public.codes
VALUES ('72cf1f0a-e9fb-4dd6-b397-ad05534e7a74', 'return str(c)', '"Str"');
INSERT INTO public.codes
VALUES ('77a554b7-f098-4da5-9354-0e6b15a445f2', 'return str(c)', '"Str"');
INSERT INTO public.codes
VALUES ('f4ef35b1-1c08-4ebe-9ab5-2c798074266b', 'return 10 + c', '"Str"');
INSERT INTO public.codes
VALUES ('e2b9f9d6-e0d6-415f-973e-23d42ce79dba', 'return str(a) + b', '"Str"');
INSERT INTO public.codes
VALUES ('e37d38d5-00f9-4028-bc3b-b07324a0d524', 'return b + str(a+c)', '"Str"');
INSERT INTO public.codes
VALUES ('8585361f-f685-4091-ba02-e1fe282d408d', 'return str(10 + a)', '"Str"');
INSERT INTO public.codes
VALUES ('5af3953e-5a63-4e12-8c87-c06175326cc6', 'return str(a)', '"Str"');
INSERT INTO public.codes
VALUES ('6f131e50-ded6-47c1-afc4-797899eb3d17', 'return str(c)', '"Str"');
INSERT INTO public.codes
VALUES ('573e1b69-c04f-4b03-ad9d-6eaacfe1b51c', 'return str(c)', '"Str"');
INSERT INTO public.codes
VALUES ('074f6eaa-11af-473a-a969-b295df1076e0', 'return 10 + c', '"Str"');
INSERT INTO public.codes
VALUES ('50fd314f-73a9-472d-be56-3ee15bdfd461', 'return str(a) + b', '"Str"');
INSERT INTO public.codes
VALUES ('dc6e7dcb-1d51-46d4-acee-c3bd3053aef2', 'return b + str(a+c)', '"Str"');
INSERT INTO public.codes
VALUES ('6869a86f-8a4d-4448-9164-bbf789719898', 'return str(10 + a)', '"Str"');
INSERT INTO public.codes
VALUES ('a21c905f-4cf8-4282-b990-462c0956c1c7', 'return str(a)', '"Str"');
INSERT INTO public.codes
VALUES ('062d91ac-b8bb-462b-8e20-64558c532a9c', 'return str(c)', '"Str"');
INSERT INTO public.codes
VALUES ('65e8a56f-2ff4-4586-bc51-2e1952db821d', 'return str(c)', '"Str"');
INSERT INTO public.codes
VALUES ('ca290f18-8821-42b2-98c1-42bbf6b537af', 'return 10 + c', '"Str"');
INSERT INTO public.codes
VALUES ('c1d7f6a5-d868-4e5b-ab5a-8d4b73e941ad', 'return str(a) + b', '"Str"');
INSERT INTO public.codes
VALUES ('a77384a1-5053-4681-8f53-46c8bd5b1ef2', 'return b + str(a+c)', '"Str"');
INSERT INTO public.codes
VALUES ('0a06b6bb-f5a2-4bef-a306-7073c0557908', 'return str(10 + a)', '"Str"');
INSERT INTO public.codes
VALUES ('edcc89ce-57a1-4d07-93fe-80d3da555b7b', 'return str(a)', '"Str"');
INSERT INTO public.codes
VALUES ('7bb54a5e-9c97-4a7c-b57a-53ef39e55a7e', 'return str(c)', '"Str"');
INSERT INTO public.codes
VALUES ('cb8e09e3-31cc-4f2e-84e6-e656cd695b50', 'return str(c)', '"Str"');
INSERT INTO public.codes
VALUES ('898430ad-25ff-44ff-a3e8-954a16f31cca', 'return 10 + c', '"Str"');
INSERT INTO public.codes
VALUES ('0169b19c-4a0e-4087-acdf-ae7e0551aa73', 'return str(a) + b', '"Str"');
INSERT INTO public.codes
VALUES ('a0105cd4-e091-4572-957c-fe29fb61d89c', 'return b + str(a+c)', '"Str"');
INSERT INTO public.codes
VALUES ('a19d4c0f-f6f3-4bbe-978f-69465060d072', 'return str(10 + a)', '"Str"');
INSERT INTO public.codes
VALUES ('5990ae16-0627-4f5a-922a-26e9efea2774', 'return str(a)', '"Str"');
INSERT INTO public.codes
VALUES ('0de077d3-e69b-4215-a78e-607848e87322', 'return str(c)', '"Str"');
INSERT INTO public.codes
VALUES ('dc52a5a2-9c55-471b-9754-0ee64218cd77', 'return str(c)', '"Str"');
INSERT INTO public.codes
VALUES ('61ec652a-95b3-4a2b-a210-f580a8d9224a', 'return 10 + c', '"Str"');
INSERT INTO public.codes
VALUES ('ff5d267b-4162-451b-9c4a-c3d9a4315534', 'return str(a) + b', '"Str"');
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



INSERT INTO public.immutable_test_models
VALUES (false, false, '2025-05-08 13:04:44.720227+00', NULL, '2b0a5f12-c101-4667-9666-0a3e74adf9ba',
        '6b769665-9a44-471a-a2ca-72cad191aa0c', 'Test Exam 1', 'ACTIVE');
INSERT INTO public.immutable_test_models
VALUES (false, false, '2025-05-08 13:06:31.7345+00', NULL, '2b0a5f12-c101-4667-9666-0a3e74adf9ba',
        'ca258114-b7e2-43fb-b47f-09332da6dbf9', 'Test Exam 1 - I12', 'ARCHIVED');
INSERT INTO public.immutable_test_models
VALUES (false, false, '2025-05-08 12:56:34.4447+00', NULL, '2b0a5f12-c101-4667-9666-0a3e74adf9ba',
        '2209c2a1-f3a4-49db-b8db-b673f88bf1ef', 'Test Exam 1', 'ARCHIVED');
INSERT INTO public.immutable_test_models
VALUES (false, false, '2025-05-08 21:46:13.266302+00', '2025-05-08 21:51:13.242+00',
        '2b0a5f12-c101-4667-9666-0a3e74adf9ba', 'c4d4357b-37be-43e6-a531-f8c6d08d79bd', 'sdf - Instance', 'ARCHIVED');
INSERT INTO public.immutable_test_models
VALUES (false, false, '2025-05-08 21:53:37.849395+00', '2025-05-08 21:54:37.826+00',
        '2b0a5f12-c101-4667-9666-0a3e74adf9ba', '7c23263c-2e1c-4ccc-93e2-867dd7ec9bdf', 'qwe - Instance', 'ARCHIVED');
INSERT INTO public.immutable_test_models
VALUES (false, false, '2025-05-08 22:52:28.885023+00', '2025-05-08 22:53:28.824+00',
        '2b0a5f12-c101-4667-9666-0a3e74adf9ba', '90b5cb53-15d5-4803-93c6-aebc5f58d438', 'qwe - Instance expire soon',
        'ARCHIVED');
INSERT INTO public.immutable_test_models
VALUES (true, true, '2025-05-09 10:54:58.266712+00', NULL, '2b0a5f12-c101-4667-9666-0a3e74adf9ba',
        'bff940d9-1108-46a3-b092-78a0c7d30b28', 'Test Example #1 - Instance', 'ACTIVE');



INSERT INTO public.immutable_test_models_user_tests
VALUES ('e91029d5-b56c-46fa-96ef-9a351a08f789', '68ae6478-f6fa-44c4-8703-3835b3e42e9d');



INSERT INTO public.immutable_test_questions
VALUES ('2209c2a1-f3a4-49db-b8db-b673f88bf1ef', 'fcfcea25-4f80-4558-a76c-be834c5a4712');
INSERT INTO public.immutable_test_questions
VALUES ('2209c2a1-f3a4-49db-b8db-b673f88bf1ef', '8e90ea82-573b-4025-8ab8-83772d341445');
INSERT INTO public.immutable_test_questions
VALUES ('6b769665-9a44-471a-a2ca-72cad191aa0c', '2ac1f035-eb13-43d4-8af3-4df815d8d93b');
INSERT INTO public.immutable_test_questions
VALUES ('6b769665-9a44-471a-a2ca-72cad191aa0c', 'e758f53f-2e72-474d-9326-ae38ef9eec03');
INSERT INTO public.immutable_test_questions
VALUES ('ca258114-b7e2-43fb-b47f-09332da6dbf9', 'cf35398d-6efe-4540-8408-794d95ab2bc8');
INSERT INTO public.immutable_test_questions
VALUES ('ca258114-b7e2-43fb-b47f-09332da6dbf9', '5af3b89c-59ba-4a6c-8afd-22ce157f6bec');
INSERT INTO public.immutable_test_questions
VALUES ('c4d4357b-37be-43e6-a531-f8c6d08d79bd', '9502f9f0-60af-4907-935b-49ef9822c750');
INSERT INTO public.immutable_test_questions
VALUES ('c4d4357b-37be-43e6-a531-f8c6d08d79bd', '6f176c79-22ee-4029-9e84-9256be82d7e2');
INSERT INTO public.immutable_test_questions
VALUES ('7c23263c-2e1c-4ccc-93e2-867dd7ec9bdf', '2ff031fe-83c9-4612-8a3b-65b92d5e41fd');
INSERT INTO public.immutable_test_questions
VALUES ('7c23263c-2e1c-4ccc-93e2-867dd7ec9bdf', '423149ed-5e0b-43dc-a244-4ac68d56f747');
INSERT INTO public.immutable_test_questions
VALUES ('90b5cb53-15d5-4803-93c6-aebc5f58d438', 'ba23f875-03a5-419c-8d08-719e57c50fa4');
INSERT INTO public.immutable_test_questions
VALUES ('90b5cb53-15d5-4803-93c6-aebc5f58d438', '31c60fd3-59de-40d2-9e5b-1d1276ad9d28');
INSERT INTO public.immutable_test_questions
VALUES ('bff940d9-1108-46a3-b092-78a0c7d30b28', 'e890b187-f3fc-4af1-ab88-1435066b9d4a');
INSERT INTO public.immutable_test_questions
VALUES ('bff940d9-1108-46a3-b092-78a0c7d30b28', '181baf83-4592-4bda-b64d-b850fe205677');



INSERT INTO public.question_call_args
VALUES ('28390539-6a70-4ab4-8eb5-d80a6a1eb4b3', '{"identifier":"P_1","name":"a"}');
INSERT INTO public.question_call_args
VALUES ('28390539-6a70-4ab4-8eb5-d80a6a1eb4b3', '{"identifier":"P_2","name":"b"}');
INSERT INTO public.question_call_args
VALUES ('28390539-6a70-4ab4-8eb5-d80a6a1eb4b3', '{"identifier":"P_3","name":"c"}');
INSERT INTO public.question_call_args
VALUES ('c1cc0172-f55e-446c-b717-f6ec53a65196', '{"identifier":"P_1","name":"a"}');
INSERT INTO public.question_call_args
VALUES ('c1cc0172-f55e-446c-b717-f6ec53a65196', '{"identifier":"P_2","name":"b"}');
INSERT INTO public.question_call_args
VALUES ('c1cc0172-f55e-446c-b717-f6ec53a65196', '{"identifier":"P_3","name":"c"}');
INSERT INTO public.question_call_args
VALUES ('fcfcea25-4f80-4558-a76c-be834c5a4712', '{"identifier":"P_1","name":"a"}');
INSERT INTO public.question_call_args
VALUES ('fcfcea25-4f80-4558-a76c-be834c5a4712', '{"identifier":"P_2","name":"b"}');
INSERT INTO public.question_call_args
VALUES ('fcfcea25-4f80-4558-a76c-be834c5a4712', '{"identifier":"P_3","name":"c"}');
INSERT INTO public.question_call_args
VALUES ('8e90ea82-573b-4025-8ab8-83772d341445', '{"identifier":"P_1","name":"a"}');
INSERT INTO public.question_call_args
VALUES ('8e90ea82-573b-4025-8ab8-83772d341445', '{"identifier":"P_2","name":"b"}');
INSERT INTO public.question_call_args
VALUES ('8e90ea82-573b-4025-8ab8-83772d341445', '{"identifier":"P_3","name":"c"}');
INSERT INTO public.question_call_args
VALUES ('2ac1f035-eb13-43d4-8af3-4df815d8d93b', '{"identifier":"P_1","name":"a"}');
INSERT INTO public.question_call_args
VALUES ('2ac1f035-eb13-43d4-8af3-4df815d8d93b', '{"identifier":"P_2","name":"b"}');
INSERT INTO public.question_call_args
VALUES ('2ac1f035-eb13-43d4-8af3-4df815d8d93b', '{"identifier":"P_3","name":"c"}');
INSERT INTO public.question_call_args
VALUES ('e758f53f-2e72-474d-9326-ae38ef9eec03', '{"identifier":"P_1","name":"a"}');
INSERT INTO public.question_call_args
VALUES ('e758f53f-2e72-474d-9326-ae38ef9eec03', '{"identifier":"P_2","name":"b"}');
INSERT INTO public.question_call_args
VALUES ('e758f53f-2e72-474d-9326-ae38ef9eec03', '{"identifier":"P_3","name":"c"}');
INSERT INTO public.question_call_args
VALUES ('cf35398d-6efe-4540-8408-794d95ab2bc8', '{"identifier":"P_1","name":"a"}');
INSERT INTO public.question_call_args
VALUES ('cf35398d-6efe-4540-8408-794d95ab2bc8', '{"identifier":"P_2","name":"b"}');
INSERT INTO public.question_call_args
VALUES ('cf35398d-6efe-4540-8408-794d95ab2bc8', '{"identifier":"P_3","name":"c"}');
INSERT INTO public.question_call_args
VALUES ('5af3b89c-59ba-4a6c-8afd-22ce157f6bec', '{"identifier":"P_1","name":"a"}');
INSERT INTO public.question_call_args
VALUES ('5af3b89c-59ba-4a6c-8afd-22ce157f6bec', '{"identifier":"P_2","name":"b"}');
INSERT INTO public.question_call_args
VALUES ('5af3b89c-59ba-4a6c-8afd-22ce157f6bec', '{"identifier":"P_3","name":"c"}');
INSERT INTO public.question_call_args
VALUES ('9502f9f0-60af-4907-935b-49ef9822c750', '{"identifier":"P_1","name":"a"}');
INSERT INTO public.question_call_args
VALUES ('9502f9f0-60af-4907-935b-49ef9822c750', '{"identifier":"P_2","name":"b"}');
INSERT INTO public.question_call_args
VALUES ('9502f9f0-60af-4907-935b-49ef9822c750', '{"identifier":"P_3","name":"c"}');
INSERT INTO public.question_call_args
VALUES ('6f176c79-22ee-4029-9e84-9256be82d7e2', '{"identifier":"P_1","name":"a"}');
INSERT INTO public.question_call_args
VALUES ('6f176c79-22ee-4029-9e84-9256be82d7e2', '{"identifier":"P_2","name":"b"}');
INSERT INTO public.question_call_args
VALUES ('6f176c79-22ee-4029-9e84-9256be82d7e2', '{"identifier":"P_3","name":"c"}');
INSERT INTO public.question_call_args
VALUES ('2ff031fe-83c9-4612-8a3b-65b92d5e41fd', '{"identifier":"P_1","name":"a"}');
INSERT INTO public.question_call_args
VALUES ('2ff031fe-83c9-4612-8a3b-65b92d5e41fd', '{"identifier":"P_2","name":"b"}');
INSERT INTO public.question_call_args
VALUES ('2ff031fe-83c9-4612-8a3b-65b92d5e41fd', '{"identifier":"P_3","name":"c"}');
INSERT INTO public.question_call_args
VALUES ('423149ed-5e0b-43dc-a244-4ac68d56f747', '{"identifier":"P_1","name":"a"}');
INSERT INTO public.question_call_args
VALUES ('423149ed-5e0b-43dc-a244-4ac68d56f747', '{"identifier":"P_2","name":"b"}');
INSERT INTO public.question_call_args
VALUES ('423149ed-5e0b-43dc-a244-4ac68d56f747', '{"identifier":"P_3","name":"c"}');
INSERT INTO public.question_call_args
VALUES ('ba23f875-03a5-419c-8d08-719e57c50fa4', '{"identifier":"P_1","name":"a"}');
INSERT INTO public.question_call_args
VALUES ('ba23f875-03a5-419c-8d08-719e57c50fa4', '{"identifier":"P_2","name":"b"}');
INSERT INTO public.question_call_args
VALUES ('ba23f875-03a5-419c-8d08-719e57c50fa4', '{"identifier":"P_3","name":"c"}');
INSERT INTO public.question_call_args
VALUES ('31c60fd3-59de-40d2-9e5b-1d1276ad9d28', '{"identifier":"P_1","name":"a"}');
INSERT INTO public.question_call_args
VALUES ('31c60fd3-59de-40d2-9e5b-1d1276ad9d28', '{"identifier":"P_2","name":"b"}');
INSERT INTO public.question_call_args
VALUES ('31c60fd3-59de-40d2-9e5b-1d1276ad9d28', '{"identifier":"P_3","name":"c"}');
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
VALUES (true, '2025-05-08 12:53:46.027625+00', 'fb5344eb-54ec-4659-b4ed-b4938d95bbae',
        '2b0a5f12-c101-4667-9666-0a3e74adf9ba', '4c0d6970-b008-45e4-a784-afcdd2c9651a');
INSERT INTO public.variants
VALUES (true, '2025-05-08 12:54:04.701321+00', '0cfbd752-180a-4d5c-9a72-a6fb95b42fed',
        '2b0a5f12-c101-4667-9666-0a3e74adf9ba', '9d7ae2ab-ec79-4df2-a66f-d0d9e4e4c328');
INSERT INTO public.variants
VALUES (true, '2025-05-08 12:54:15.872206+00', '6d8f755f-a7a0-41e9-b78e-085920839025',
        '2b0a5f12-c101-4667-9666-0a3e74adf9ba', '2d92c1ce-0007-4e3b-8945-d7db13ae36c7');
INSERT INTO public.variants
VALUES (true, '2025-05-08 12:54:25.242438+00', 'fc6c1979-6bdb-4b51-8ae1-77c0771433ba',
        '2b0a5f12-c101-4667-9666-0a3e74adf9ba', 'f0ad79a7-6e59-423f-8b11-4fa5969913da');
INSERT INTO public.variants
VALUES (true, '2025-05-08 12:55:53.992944+00', 'd868192e-129a-4a31-b079-e10db1e11165',
        '2b0a5f12-c101-4667-9666-0a3e74adf9ba', 'a4984c9f-8f37-42b5-b81c-05571f44bef1');
INSERT INTO public.variants
VALUES (true, '2025-05-08 12:56:04.038357+00', '5bb46611-884b-4f18-b127-7e49603e7ee9',
        '2b0a5f12-c101-4667-9666-0a3e74adf9ba', 'd6622b7d-ba34-48a6-b6fa-98306554a47a');
INSERT INTO public.variants
VALUES (true, '2025-05-08 12:56:11.016029+00', 'e1014a94-4b07-48d3-a2a7-c5047d651157',
        '2b0a5f12-c101-4667-9666-0a3e74adf9ba', '177f9130-b967-4bca-9674-53a53daf19c7');
INSERT INTO public.variants
VALUES (false, '2025-05-08 12:56:34.440266+00', '08ce2dc7-3ce9-4e5d-b0c5-8ab5c900c30f',
        '2b0a5f12-c101-4667-9666-0a3e74adf9ba', '528740a2-5ab1-4d7d-bee5-304377e85f9e');
INSERT INTO public.variants
VALUES (false, '2025-05-08 12:56:34.440272+00', '86ce86b0-aee2-4fae-80d8-b24f4fff2ed9',
        '2b0a5f12-c101-4667-9666-0a3e74adf9ba', '9876a016-ef51-47d2-a53c-4f261df4c2b2');
INSERT INTO public.variants
VALUES (false, '2025-05-08 12:56:34.440828+00', 'c88dfbea-0dab-4eef-80ca-138155ff0277',
        '2b0a5f12-c101-4667-9666-0a3e74adf9ba', '4dffe2ae-3770-4a5d-ab95-f2997d7482e9');
INSERT INTO public.variants
VALUES (false, '2025-05-08 12:56:34.440829+00', '3dd4d7a4-cebf-4a97-9b61-65415d260dd0',
        '2b0a5f12-c101-4667-9666-0a3e74adf9ba', 'f1c4cb6a-64cd-4a89-b2eb-7a4278a64836');
INSERT INTO public.variants
VALUES (false, '2025-05-08 12:56:34.441981+00', '9e03f58f-28a7-4510-b539-b70d60e97bed',
        '2b0a5f12-c101-4667-9666-0a3e74adf9ba', 'e9725211-2d82-42e3-9e38-82013d4b7661');
INSERT INTO public.variants
VALUES (false, '2025-05-08 12:56:34.441982+00', '6674e4ab-e565-42cc-a2e6-8e1ea1308b0c',
        '2b0a5f12-c101-4667-9666-0a3e74adf9ba', 'e3e69500-5f25-42b1-98c0-0b80b8322cb8');
INSERT INTO public.variants
VALUES (false, '2025-05-08 12:56:34.442619+00', 'e3e908de-9902-4beb-bead-bf673b33dee2',
        '2b0a5f12-c101-4667-9666-0a3e74adf9ba', '95614525-e9c7-4b56-9a2f-9e46de8d19bf');
INSERT INTO public.variants
VALUES (false, '2025-05-08 13:04:44.71671+00', '668d8648-2574-4e14-8fdd-d59cf9413055',
        '2b0a5f12-c101-4667-9666-0a3e74adf9ba', '49cd9feb-19fe-4ac5-b802-655e422f8619');
INSERT INTO public.variants
VALUES (false, '2025-05-08 13:04:44.716711+00', '46ef7df3-0a44-4c70-ae0c-d769b6466785',
        '2b0a5f12-c101-4667-9666-0a3e74adf9ba', 'ef649b01-392a-4db8-ae44-506df32d2134');
INSERT INTO public.variants
VALUES (false, '2025-05-08 13:04:44.717265+00', '138a832b-6c7d-46a9-a94b-af597c8eb469',
        '2b0a5f12-c101-4667-9666-0a3e74adf9ba', 'af7de1f4-f360-47c4-83c1-da709ec052f9');
INSERT INTO public.variants
VALUES (false, '2025-05-08 13:04:44.717267+00', '72cf1f0a-e9fb-4dd6-b397-ad05534e7a74',
        '2b0a5f12-c101-4667-9666-0a3e74adf9ba', 'fede1298-0920-4688-b501-3068bbff4fe2');
INSERT INTO public.variants
VALUES (false, '2025-05-08 13:04:44.718557+00', '77a554b7-f098-4da5-9354-0e6b15a445f2',
        '2b0a5f12-c101-4667-9666-0a3e74adf9ba', 'fe5fc2bb-ae38-4c73-84e8-b6befe6098c0');
INSERT INTO public.variants
VALUES (false, '2025-05-08 13:04:44.718558+00', 'f4ef35b1-1c08-4ebe-9ab5-2c798074266b',
        '2b0a5f12-c101-4667-9666-0a3e74adf9ba', 'b1c1d4b4-46da-44ed-9a10-9d61e0628e6f');
INSERT INTO public.variants
VALUES (false, '2025-05-08 13:04:44.719069+00', 'e2b9f9d6-e0d6-415f-973e-23d42ce79dba',
        '2b0a5f12-c101-4667-9666-0a3e74adf9ba', 'e3120692-fa1f-491c-aefc-451335e9fad4');
INSERT INTO public.variants
VALUES (false, '2025-05-08 13:06:31.727996+00', 'e37d38d5-00f9-4028-bc3b-b07324a0d524',
        '2b0a5f12-c101-4667-9666-0a3e74adf9ba', 'a953345e-cabe-4570-b273-6f8c87865175');
INSERT INTO public.variants
VALUES (false, '2025-05-08 13:06:31.728005+00', '8585361f-f685-4091-ba02-e1fe282d408d',
        '2b0a5f12-c101-4667-9666-0a3e74adf9ba', '392bf863-b58d-4343-8ba4-2e0bde2c819b');
INSERT INTO public.variants
VALUES (false, '2025-05-08 13:06:31.729334+00', '5af3953e-5a63-4e12-8c87-c06175326cc6',
        '2b0a5f12-c101-4667-9666-0a3e74adf9ba', '9ec36d2d-bb37-4a69-91dd-28936bd8cb83');
INSERT INTO public.variants
VALUES (false, '2025-05-08 13:06:31.729335+00', '6f131e50-ded6-47c1-afc4-797899eb3d17',
        '2b0a5f12-c101-4667-9666-0a3e74adf9ba', '22311791-60b2-4ad1-8e1d-bf9f70e822eb');
INSERT INTO public.variants
VALUES (false, '2025-05-08 13:06:31.731485+00', '573e1b69-c04f-4b03-ad9d-6eaacfe1b51c',
        '2b0a5f12-c101-4667-9666-0a3e74adf9ba', '8d7c4282-7aba-481e-bf7b-bce651e28d25');
INSERT INTO public.variants
VALUES (false, '2025-05-08 13:06:31.731486+00', '074f6eaa-11af-473a-a969-b295df1076e0',
        '2b0a5f12-c101-4667-9666-0a3e74adf9ba', '357ba8cb-540c-41c4-ac69-c0fa995eec33');
INSERT INTO public.variants
VALUES (false, '2025-05-08 13:06:31.732235+00', '50fd314f-73a9-472d-be56-3ee15bdfd461',
        '2b0a5f12-c101-4667-9666-0a3e74adf9ba', 'f2ac1e5b-bb17-42a1-8f50-c23fa7b56cf7');
INSERT INTO public.variants
VALUES (false, '2025-05-08 21:46:13.263227+00', 'dc6e7dcb-1d51-46d4-acee-c3bd3053aef2',
        '2b0a5f12-c101-4667-9666-0a3e74adf9ba', '8a9dfd3d-46a3-4372-8d57-55012fbc2b5d');
INSERT INTO public.variants
VALUES (false, '2025-05-08 21:46:13.263233+00', '6869a86f-8a4d-4448-9164-bbf789719898',
        '2b0a5f12-c101-4667-9666-0a3e74adf9ba', '1a256434-1b9b-4e90-bc62-0233b7434c97');
INSERT INTO public.variants
VALUES (false, '2025-05-08 21:46:13.26379+00', 'a21c905f-4cf8-4282-b990-462c0956c1c7',
        '2b0a5f12-c101-4667-9666-0a3e74adf9ba', '8a0eceb6-0fc7-410c-81f5-7be322512d14');
INSERT INTO public.variants
VALUES (false, '2025-05-08 21:46:13.263791+00', '062d91ac-b8bb-462b-8e20-64558c532a9c',
        '2b0a5f12-c101-4667-9666-0a3e74adf9ba', '66dbc6b7-39da-4ecd-9ab2-e3d3322ec7be');
INSERT INTO public.variants
VALUES (false, '2025-05-08 21:46:13.264756+00', '65e8a56f-2ff4-4586-bc51-2e1952db821d',
        '2b0a5f12-c101-4667-9666-0a3e74adf9ba', 'c39d2364-fa3c-4d2f-afb5-20f5459e1723');
INSERT INTO public.variants
VALUES (false, '2025-05-08 21:46:13.264757+00', 'ca290f18-8821-42b2-98c1-42bbf6b537af',
        '2b0a5f12-c101-4667-9666-0a3e74adf9ba', 'ded68236-648c-4df7-9002-669d681b6652');
INSERT INTO public.variants
VALUES (false, '2025-05-08 21:46:13.265215+00', 'c1d7f6a5-d868-4e5b-ab5a-8d4b73e941ad',
        '2b0a5f12-c101-4667-9666-0a3e74adf9ba', 'a5ea9849-8108-46ad-aa84-99a6e5c1fb0f');
INSERT INTO public.variants
VALUES (false, '2025-05-08 21:53:37.845699+00', 'a77384a1-5053-4681-8f53-46c8bd5b1ef2',
        '2b0a5f12-c101-4667-9666-0a3e74adf9ba', 'f8e57f1e-9b73-4f2b-9698-241f722d49ae');
INSERT INTO public.variants
VALUES (false, '2025-05-08 21:53:37.845702+00', '0a06b6bb-f5a2-4bef-a306-7073c0557908',
        '2b0a5f12-c101-4667-9666-0a3e74adf9ba', '9de55bfc-97aa-43b4-8ff8-68ceb9b2d48a');
INSERT INTO public.variants
VALUES (false, '2025-05-08 21:53:37.846672+00', 'edcc89ce-57a1-4d07-93fe-80d3da555b7b',
        '2b0a5f12-c101-4667-9666-0a3e74adf9ba', '398642e5-abad-4134-9faa-1ba65fbb1f60');
INSERT INTO public.variants
VALUES (false, '2025-05-08 21:53:37.846674+00', '7bb54a5e-9c97-4a7c-b57a-53ef39e55a7e',
        '2b0a5f12-c101-4667-9666-0a3e74adf9ba', 'b6afc8cc-7905-40fe-b06f-b4a9f0ecd269');
INSERT INTO public.variants
VALUES (false, '2025-05-08 21:53:37.847943+00', 'cb8e09e3-31cc-4f2e-84e6-e656cd695b50',
        '2b0a5f12-c101-4667-9666-0a3e74adf9ba', 'b94ff080-3899-4947-a7a5-69cdbb6b0bb9');
INSERT INTO public.variants
VALUES (false, '2025-05-08 21:53:37.847945+00', '898430ad-25ff-44ff-a3e8-954a16f31cca',
        '2b0a5f12-c101-4667-9666-0a3e74adf9ba', '6b7fec12-4fb7-40d6-91b6-b9f20bc2ec86');
INSERT INTO public.variants
VALUES (false, '2025-05-08 21:53:37.848637+00', '0169b19c-4a0e-4087-acdf-ae7e0551aa73',
        '2b0a5f12-c101-4667-9666-0a3e74adf9ba', '7d60d6ad-f619-4196-9c0d-7b2c99d03b78');
INSERT INTO public.variants
VALUES (false, '2025-05-08 22:52:28.877991+00', 'a0105cd4-e091-4572-957c-fe29fb61d89c',
        '2b0a5f12-c101-4667-9666-0a3e74adf9ba', '85542c81-b91a-42dc-95e9-8fb46d83bceb');
INSERT INTO public.variants
VALUES (false, '2025-05-08 22:52:28.877999+00', 'a19d4c0f-f6f3-4bbe-978f-69465060d072',
        '2b0a5f12-c101-4667-9666-0a3e74adf9ba', '633d1b62-0ef7-4460-a0a7-89e63f1995c7');
INSERT INTO public.variants
VALUES (false, '2025-05-08 22:52:28.879606+00', '5990ae16-0627-4f5a-922a-26e9efea2774',
        '2b0a5f12-c101-4667-9666-0a3e74adf9ba', '80acba72-4c1a-477f-a155-70e55197f923');
INSERT INTO public.variants
VALUES (false, '2025-05-08 22:52:28.879607+00', '0de077d3-e69b-4215-a78e-607848e87322',
        '2b0a5f12-c101-4667-9666-0a3e74adf9ba', 'a1885816-4d1b-4cbd-bf7d-4edd8dbc1b3e');
INSERT INTO public.variants
VALUES (false, '2025-05-08 22:52:28.882474+00', 'dc52a5a2-9c55-471b-9754-0ee64218cd77',
        '2b0a5f12-c101-4667-9666-0a3e74adf9ba', '0d8de776-a907-4645-be6c-60c63113556b');
INSERT INTO public.variants
VALUES (false, '2025-05-08 22:52:28.882475+00', '61ec652a-95b3-4a2b-a210-f580a8d9224a',
        '2b0a5f12-c101-4667-9666-0a3e74adf9ba', '2c8f9072-37a7-4863-932b-2fd7fb66e55a');
INSERT INTO public.variants
VALUES (false, '2025-05-08 22:52:28.883349+00', 'ff5d267b-4162-451b-9c4a-c3d9a4315534',
        '2b0a5f12-c101-4667-9666-0a3e74adf9ba', '341e3ade-8728-4184-84ad-d9315d43902e');
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
VALUES ('28390539-6a70-4ab4-8eb5-d80a6a1eb4b3', '4c0d6970-b008-45e4-a784-afcdd2c9651a');
INSERT INTO public.question_correct_variants
VALUES ('28390539-6a70-4ab4-8eb5-d80a6a1eb4b3', 'f0ad79a7-6e59-423f-8b11-4fa5969913da');
INSERT INTO public.question_correct_variants
VALUES ('c1cc0172-f55e-446c-b717-f6ec53a65196', 'a4984c9f-8f37-42b5-b81c-05571f44bef1');
INSERT INTO public.question_correct_variants
VALUES ('c1cc0172-f55e-446c-b717-f6ec53a65196', '177f9130-b967-4bca-9674-53a53daf19c7');
INSERT INTO public.question_correct_variants
VALUES ('fcfcea25-4f80-4558-a76c-be834c5a4712', '528740a2-5ab1-4d7d-bee5-304377e85f9e');
INSERT INTO public.question_correct_variants
VALUES ('fcfcea25-4f80-4558-a76c-be834c5a4712', '9876a016-ef51-47d2-a53c-4f261df4c2b2');
INSERT INTO public.question_correct_variants
VALUES ('8e90ea82-573b-4025-8ab8-83772d341445', 'e9725211-2d82-42e3-9e38-82013d4b7661');
INSERT INTO public.question_correct_variants
VALUES ('8e90ea82-573b-4025-8ab8-83772d341445', 'e3e69500-5f25-42b1-98c0-0b80b8322cb8');
INSERT INTO public.question_correct_variants
VALUES ('2ac1f035-eb13-43d4-8af3-4df815d8d93b', '49cd9feb-19fe-4ac5-b802-655e422f8619');
INSERT INTO public.question_correct_variants
VALUES ('2ac1f035-eb13-43d4-8af3-4df815d8d93b', 'ef649b01-392a-4db8-ae44-506df32d2134');
INSERT INTO public.question_correct_variants
VALUES ('e758f53f-2e72-474d-9326-ae38ef9eec03', 'fe5fc2bb-ae38-4c73-84e8-b6befe6098c0');
INSERT INTO public.question_correct_variants
VALUES ('e758f53f-2e72-474d-9326-ae38ef9eec03', 'b1c1d4b4-46da-44ed-9a10-9d61e0628e6f');
INSERT INTO public.question_correct_variants
VALUES ('cf35398d-6efe-4540-8408-794d95ab2bc8', 'a953345e-cabe-4570-b273-6f8c87865175');
INSERT INTO public.question_correct_variants
VALUES ('cf35398d-6efe-4540-8408-794d95ab2bc8', '392bf863-b58d-4343-8ba4-2e0bde2c819b');
INSERT INTO public.question_correct_variants
VALUES ('5af3b89c-59ba-4a6c-8afd-22ce157f6bec', '8d7c4282-7aba-481e-bf7b-bce651e28d25');
INSERT INTO public.question_correct_variants
VALUES ('5af3b89c-59ba-4a6c-8afd-22ce157f6bec', '357ba8cb-540c-41c4-ac69-c0fa995eec33');
INSERT INTO public.question_correct_variants
VALUES ('9502f9f0-60af-4907-935b-49ef9822c750', '8a9dfd3d-46a3-4372-8d57-55012fbc2b5d');
INSERT INTO public.question_correct_variants
VALUES ('9502f9f0-60af-4907-935b-49ef9822c750', '1a256434-1b9b-4e90-bc62-0233b7434c97');
INSERT INTO public.question_correct_variants
VALUES ('6f176c79-22ee-4029-9e84-9256be82d7e2', 'c39d2364-fa3c-4d2f-afb5-20f5459e1723');
INSERT INTO public.question_correct_variants
VALUES ('6f176c79-22ee-4029-9e84-9256be82d7e2', 'ded68236-648c-4df7-9002-669d681b6652');
INSERT INTO public.question_correct_variants
VALUES ('2ff031fe-83c9-4612-8a3b-65b92d5e41fd', 'f8e57f1e-9b73-4f2b-9698-241f722d49ae');
INSERT INTO public.question_correct_variants
VALUES ('2ff031fe-83c9-4612-8a3b-65b92d5e41fd', '9de55bfc-97aa-43b4-8ff8-68ceb9b2d48a');
INSERT INTO public.question_correct_variants
VALUES ('423149ed-5e0b-43dc-a244-4ac68d56f747', 'b94ff080-3899-4947-a7a5-69cdbb6b0bb9');
INSERT INTO public.question_correct_variants
VALUES ('423149ed-5e0b-43dc-a244-4ac68d56f747', '6b7fec12-4fb7-40d6-91b6-b9f20bc2ec86');
INSERT INTO public.question_correct_variants
VALUES ('ba23f875-03a5-419c-8d08-719e57c50fa4', '85542c81-b91a-42dc-95e9-8fb46d83bceb');
INSERT INTO public.question_correct_variants
VALUES ('ba23f875-03a5-419c-8d08-719e57c50fa4', '633d1b62-0ef7-4460-a0a7-89e63f1995c7');
INSERT INTO public.question_correct_variants
VALUES ('31c60fd3-59de-40d2-9e5b-1d1276ad9d28', '0d8de776-a907-4645-be6c-60c63113556b');
INSERT INTO public.question_correct_variants
VALUES ('31c60fd3-59de-40d2-9e5b-1d1276ad9d28', '2c8f9072-37a7-4863-932b-2fd7fb66e55a');
INSERT INTO public.question_correct_variants
VALUES ('5622480b-03f9-4788-af4a-507ac64502bb', 'd68d3a96-fd49-463c-b55d-b7aef780f2f6');
INSERT INTO public.question_correct_variants
VALUES ('75dd7aef-199a-4191-a61f-ec69885a8cd5', '45325f70-8b99-4bdf-b420-d6c034e41f9a');
INSERT INTO public.question_correct_variants
VALUES ('e890b187-f3fc-4af1-ab88-1435066b9d4a', 'cc24314f-6158-4ef0-b1d6-37468b37014e');
INSERT INTO public.question_correct_variants
VALUES ('181baf83-4592-4bda-b64d-b850fe205677', '792977ba-e876-409c-9f23-be2069fd78e6');



INSERT INTO public.question_incorrect_variants
VALUES ('28390539-6a70-4ab4-8eb5-d80a6a1eb4b3', '9d7ae2ab-ec79-4df2-a66f-d0d9e4e4c328');
INSERT INTO public.question_incorrect_variants
VALUES ('28390539-6a70-4ab4-8eb5-d80a6a1eb4b3', '2d92c1ce-0007-4e3b-8945-d7db13ae36c7');
INSERT INTO public.question_incorrect_variants
VALUES ('c1cc0172-f55e-446c-b717-f6ec53a65196', 'd6622b7d-ba34-48a6-b6fa-98306554a47a');
INSERT INTO public.question_incorrect_variants
VALUES ('fcfcea25-4f80-4558-a76c-be834c5a4712', '4dffe2ae-3770-4a5d-ab95-f2997d7482e9');
INSERT INTO public.question_incorrect_variants
VALUES ('fcfcea25-4f80-4558-a76c-be834c5a4712', 'f1c4cb6a-64cd-4a89-b2eb-7a4278a64836');
INSERT INTO public.question_incorrect_variants
VALUES ('8e90ea82-573b-4025-8ab8-83772d341445', '95614525-e9c7-4b56-9a2f-9e46de8d19bf');
INSERT INTO public.question_incorrect_variants
VALUES ('2ac1f035-eb13-43d4-8af3-4df815d8d93b', 'af7de1f4-f360-47c4-83c1-da709ec052f9');
INSERT INTO public.question_incorrect_variants
VALUES ('2ac1f035-eb13-43d4-8af3-4df815d8d93b', 'fede1298-0920-4688-b501-3068bbff4fe2');
INSERT INTO public.question_incorrect_variants
VALUES ('e758f53f-2e72-474d-9326-ae38ef9eec03', 'e3120692-fa1f-491c-aefc-451335e9fad4');
INSERT INTO public.question_incorrect_variants
VALUES ('cf35398d-6efe-4540-8408-794d95ab2bc8', '9ec36d2d-bb37-4a69-91dd-28936bd8cb83');
INSERT INTO public.question_incorrect_variants
VALUES ('cf35398d-6efe-4540-8408-794d95ab2bc8', '22311791-60b2-4ad1-8e1d-bf9f70e822eb');
INSERT INTO public.question_incorrect_variants
VALUES ('5af3b89c-59ba-4a6c-8afd-22ce157f6bec', 'f2ac1e5b-bb17-42a1-8f50-c23fa7b56cf7');
INSERT INTO public.question_incorrect_variants
VALUES ('9502f9f0-60af-4907-935b-49ef9822c750', '8a0eceb6-0fc7-410c-81f5-7be322512d14');
INSERT INTO public.question_incorrect_variants
VALUES ('9502f9f0-60af-4907-935b-49ef9822c750', '66dbc6b7-39da-4ecd-9ab2-e3d3322ec7be');
INSERT INTO public.question_incorrect_variants
VALUES ('6f176c79-22ee-4029-9e84-9256be82d7e2', 'a5ea9849-8108-46ad-aa84-99a6e5c1fb0f');
INSERT INTO public.question_incorrect_variants
VALUES ('2ff031fe-83c9-4612-8a3b-65b92d5e41fd', '398642e5-abad-4134-9faa-1ba65fbb1f60');
INSERT INTO public.question_incorrect_variants
VALUES ('2ff031fe-83c9-4612-8a3b-65b92d5e41fd', 'b6afc8cc-7905-40fe-b06f-b4a9f0ecd269');
INSERT INTO public.question_incorrect_variants
VALUES ('423149ed-5e0b-43dc-a244-4ac68d56f747', '7d60d6ad-f619-4196-9c0d-7b2c99d03b78');
INSERT INTO public.question_incorrect_variants
VALUES ('ba23f875-03a5-419c-8d08-719e57c50fa4', '80acba72-4c1a-477f-a155-70e55197f923');
INSERT INTO public.question_incorrect_variants
VALUES ('ba23f875-03a5-419c-8d08-719e57c50fa4', 'a1885816-4d1b-4cbd-bf7d-4edd8dbc1b3e');
INSERT INTO public.question_incorrect_variants
VALUES ('31c60fd3-59de-40d2-9e5b-1d1276ad9d28', '341e3ade-8728-4184-84ad-d9315d43902e');
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



INSERT INTO public.test_metadata
VALUES ('49c6a0e7-dd4b-4d80-be87-ec14b51435c7', 'ca258114-b7e2-43fb-b47f-09332da6dbf9', 'Test Exam 1 - I12');
INSERT INTO public.test_metadata
VALUES ('4c5fa7f3-25ed-4c4c-acd5-ac76f1a22a8b', '2209c2a1-f3a4-49db-b8db-b673f88bf1ef', 'Test Exam 1');
INSERT INTO public.test_metadata
VALUES ('e55df6cc-4d13-4156-b606-df00bc6e15f3', '6b769665-9a44-471a-a2ca-72cad191aa0c', 'Test Exam 1');
INSERT INTO public.test_metadata
VALUES ('294900d7-426f-4027-a7e9-066e5adf7220', '7c23263c-2e1c-4ccc-93e2-867dd7ec9bdf', 'qwe - Instance');
INSERT INTO public.test_metadata
VALUES ('ca83decd-63f1-49c9-89d4-05bb27611a0a', '90b5cb53-15d5-4803-93c6-aebc5f58d438', 'qwe - Instance expire soon');
INSERT INTO public.test_metadata
VALUES ('d7a5b231-ef71-4da5-904e-a1397a9f9553', 'bff940d9-1108-46a3-b092-78a0c7d30b28', 'Test Example #1 - Instance');
INSERT INTO public.test_metadata
VALUES ('7217158a-73cb-45f1-acf5-16a6a79ba0e9', 'bff940d9-1108-46a3-b092-78a0c7d30b28', 'Test Example #1 - Instance');



INSERT INTO public.question_metadata
VALUES ('b513813c-57c2-4301-848f-30ad54769862', 'cf35398d-6efe-4540-8408-794d95ab2bc8',
        '49c6a0e7-dd4b-4d80-be87-ec14b51435c7', '{"format":"python","code":"print(''Hello, world!'')"}', 'Question 1');
INSERT INTO public.question_metadata
VALUES ('d06a96ee-e104-48d1-b54d-85eb2c5ae3f0', '5af3b89c-59ba-4a6c-8afd-22ce157f6bec',
        '49c6a0e7-dd4b-4d80-be87-ec14b51435c7', '{"format":"python","code":"print(''Hello, world!'')"}', 'Question 2');
INSERT INTO public.question_metadata
VALUES ('fdf805b7-3c5d-4ab5-aaf9-0339f6f610db', 'fcfcea25-4f80-4558-a76c-be834c5a4712',
        '4c5fa7f3-25ed-4c4c-acd5-ac76f1a22a8b', '{"format":"python","code":"print(''Hello, world!'')"}', 'Question 1');
INSERT INTO public.question_metadata
VALUES ('9b5a2c48-2594-4571-a93d-c7d94663d503', '8e90ea82-573b-4025-8ab8-83772d341445',
        '4c5fa7f3-25ed-4c4c-acd5-ac76f1a22a8b', '{"format":"python","code":"print(''Hello, world!'')"}', 'Question 2');
INSERT INTO public.question_metadata
VALUES ('df832cb9-4dba-4dcb-9ab7-a1e0beaf55b3', '2ac1f035-eb13-43d4-8af3-4df815d8d93b',
        'e55df6cc-4d13-4156-b606-df00bc6e15f3', '{"format":"python","code":"print(''Hello, world!'')"}', 'Question 1');
INSERT INTO public.question_metadata
VALUES ('08baa9c6-8191-4bb4-b0b6-dd4de6ad30c6', 'e758f53f-2e72-474d-9326-ae38ef9eec03',
        'e55df6cc-4d13-4156-b606-df00bc6e15f3', '{"format":"python","code":"print(''Hello, world!'')"}', 'Question 2');
INSERT INTO public.question_metadata
VALUES ('92adebb0-13f1-4c7c-8d6e-dcd7a3d4cfe7', '2ff031fe-83c9-4612-8a3b-65b92d5e41fd',
        '294900d7-426f-4027-a7e9-066e5adf7220', '{"format":"python","code":"print(''Hello, world!'')"}', 'Question 1');
INSERT INTO public.question_metadata
VALUES ('fdec2b11-659a-479d-a70d-19dc43e515fc', '423149ed-5e0b-43dc-a244-4ac68d56f747',
        '294900d7-426f-4027-a7e9-066e5adf7220', '{"format":"python","code":"print(''Hello, world!'')"}', 'Question 2');
INSERT INTO public.question_metadata
VALUES ('02578e09-8af1-494d-ac5f-5f1256930187', 'ba23f875-03a5-419c-8d08-719e57c50fa4',
        'ca83decd-63f1-49c9-89d4-05bb27611a0a', '{"format":"python","code":"print(''Hello, world!'')"}', 'Question 1');
INSERT INTO public.question_metadata
VALUES ('27995b26-b2b1-4b91-be69-703c76e483a5', '31c60fd3-59de-40d2-9e5b-1d1276ad9d28',
        'ca83decd-63f1-49c9-89d4-05bb27611a0a', '{"format":"python","code":"print(''Hello, world!'')"}', 'Question 2');
INSERT INTO public.question_metadata
VALUES ('df4a1111-1e0f-4b65-8a82-22d08205d91c', 'e890b187-f3fc-4af1-ab88-1435066b9d4a',
        'd7a5b231-ef71-4da5-904e-a1397a9f9553',
        '{"format":"csharp","code":"int a = 5;\nint b = 3 * a;\na *= -3;\nint c = b - a;\nConsole.WriteLine(c);"}',
        'Question Example #1');
INSERT INTO public.question_metadata
VALUES ('3cd1dc6a-ddd0-481d-b57c-9e795126ad37', '181baf83-4592-4bda-b64d-b850fe205677',
        'd7a5b231-ef71-4da5-904e-a1397a9f9553',
        '{"format":"kotlin","code":"var a = 10\nfor (i in 1..4) {\n    a += i\n}\nprintln(a)"}', 'Question Example #2');
INSERT INTO public.question_metadata
VALUES ('fb5d5709-f0ad-4093-8231-fd3bb19b2cc2', 'e890b187-f3fc-4af1-ab88-1435066b9d4a',
        '7217158a-73cb-45f1-acf5-16a6a79ba0e9',
        '{"format":"csharp","code":"int a = 20;\nint b = 2 * a;\na *= -3;\nint c = b - a;\nConsole.WriteLine(c);"}',
        'Question Example #1');
INSERT INTO public.question_metadata
VALUES ('ca217d4b-3b9e-43eb-a002-663c94925eeb', '181baf83-4592-4bda-b64d-b850fe205677',
        '7217158a-73cb-45f1-acf5-16a6a79ba0e9',
        '{"format":"kotlin","code":"var a = 20\nfor (i in 1..5) {\n    a += i\n}\nprintln(a)"}', 'Question Example #2');



INSERT INTO public.question_metadata_correct_answers
VALUES ('6c6b8550-21b9-42a0-b0dc-75ba028f5aad', 'b513813c-57c2-4301-848f-30ad54769862');
INSERT INTO public.question_metadata_correct_answers
VALUES ('6a14d759-a42c-4c3f-b951-befa9321a3b6', 'b513813c-57c2-4301-848f-30ad54769862');
INSERT INTO public.question_metadata_correct_answers
VALUES ('8537fc45-f276-4b95-8084-3ec7f5cb86db', 'd06a96ee-e104-48d1-b54d-85eb2c5ae3f0');
INSERT INTO public.question_metadata_correct_answers
VALUES ('b6317d18-3a90-4193-96c1-213ff1c11d95', 'd06a96ee-e104-48d1-b54d-85eb2c5ae3f0');
INSERT INTO public.question_metadata_correct_answers
VALUES ('4f0bdd9b-e0d5-47fb-8da3-6a79776f2abf', 'fdf805b7-3c5d-4ab5-aaf9-0339f6f610db');
INSERT INTO public.question_metadata_correct_answers
VALUES ('dc4b2a30-ef96-48a8-8efc-769085f4a354', 'fdf805b7-3c5d-4ab5-aaf9-0339f6f610db');
INSERT INTO public.question_metadata_correct_answers
VALUES ('17583103-7117-4f07-bb17-dc8f15f1803e', '9b5a2c48-2594-4571-a93d-c7d94663d503');
INSERT INTO public.question_metadata_correct_answers
VALUES ('135ddf5b-bf50-4aad-b096-55c32b8af634', '9b5a2c48-2594-4571-a93d-c7d94663d503');
INSERT INTO public.question_metadata_correct_answers
VALUES ('07ba3600-b382-4b09-905d-a4ab9280ffd9', 'df832cb9-4dba-4dcb-9ab7-a1e0beaf55b3');
INSERT INTO public.question_metadata_correct_answers
VALUES ('67caa485-69fc-41ff-a1d2-54b434d3c459', 'df832cb9-4dba-4dcb-9ab7-a1e0beaf55b3');
INSERT INTO public.question_metadata_correct_answers
VALUES ('15d766f2-6a26-4e3a-8ef4-be5d15c78919', '08baa9c6-8191-4bb4-b0b6-dd4de6ad30c6');
INSERT INTO public.question_metadata_correct_answers
VALUES ('6c26bdfd-b67c-45cf-b700-8a30d44ed6a8', '08baa9c6-8191-4bb4-b0b6-dd4de6ad30c6');
INSERT INTO public.question_metadata_correct_answers
VALUES ('1808b5ab-cd9e-446f-8751-d38a9db637ae', '92adebb0-13f1-4c7c-8d6e-dcd7a3d4cfe7');
INSERT INTO public.question_metadata_correct_answers
VALUES ('197e5434-6634-45f8-8428-f23e4592f864', '92adebb0-13f1-4c7c-8d6e-dcd7a3d4cfe7');
INSERT INTO public.question_metadata_correct_answers
VALUES ('01c77efe-40ab-47db-a24d-53591c035327', 'fdec2b11-659a-479d-a70d-19dc43e515fc');
INSERT INTO public.question_metadata_correct_answers
VALUES ('e6e8436a-1b1d-47a6-8c82-565775249631', 'fdec2b11-659a-479d-a70d-19dc43e515fc');
INSERT INTO public.question_metadata_correct_answers
VALUES ('201661c6-2d88-4bfb-8aa3-8cefc1934331', '02578e09-8af1-494d-ac5f-5f1256930187');
INSERT INTO public.question_metadata_correct_answers
VALUES ('cb4c20be-380b-4f17-bfc7-ae32726d0b0f', '02578e09-8af1-494d-ac5f-5f1256930187');
INSERT INTO public.question_metadata_correct_answers
VALUES ('372ae5c3-4c9a-4bed-ab88-d283d2935131', '27995b26-b2b1-4b91-be69-703c76e483a5');
INSERT INTO public.question_metadata_correct_answers
VALUES ('8bb99137-7448-4eca-9228-5d80c2cd6e9c', '27995b26-b2b1-4b91-be69-703c76e483a5');
INSERT INTO public.question_metadata_correct_answers
VALUES ('02415f25-d07c-417d-8bde-1b3a075740f4', 'df4a1111-1e0f-4b65-8a82-22d08205d91c');
INSERT INTO public.question_metadata_correct_answers
VALUES ('85f41095-d6ec-41b3-92a1-eb2c35932d52', '3cd1dc6a-ddd0-481d-b57c-9e795126ad37');
INSERT INTO public.question_metadata_correct_answers
VALUES ('b14ff878-8849-4cff-a9bf-a93939ba33ca', 'fb5d5709-f0ad-4093-8231-fd3bb19b2cc2');
INSERT INTO public.question_metadata_correct_answers
VALUES ('5779bc06-cef7-42c9-89d5-0a69c39114d2', 'ca217d4b-3b9e-43eb-a002-663c94925eeb');



INSERT INTO public.question_metadata_incorrect_answers
VALUES ('28d698e6-2e82-4cfb-a42d-0ca77296d7de', 'b513813c-57c2-4301-848f-30ad54769862');
INSERT INTO public.question_metadata_incorrect_answers
VALUES ('e2426ae5-db7b-4c98-85e4-7f02c01246de', 'b513813c-57c2-4301-848f-30ad54769862');
INSERT INTO public.question_metadata_incorrect_answers
VALUES ('b377e6e7-2b8b-4944-97c0-5529d21c4ddf', 'd06a96ee-e104-48d1-b54d-85eb2c5ae3f0');
INSERT INTO public.question_metadata_incorrect_answers
VALUES ('717164e6-86b1-4141-9e5a-d1e6e98478a9', 'fdf805b7-3c5d-4ab5-aaf9-0339f6f610db');
INSERT INTO public.question_metadata_incorrect_answers
VALUES ('aa478669-40cc-48b3-a4aa-99776033bed9', 'fdf805b7-3c5d-4ab5-aaf9-0339f6f610db');
INSERT INTO public.question_metadata_incorrect_answers
VALUES ('8cf70d02-2c95-44cb-af52-9739e3ee4de6', '9b5a2c48-2594-4571-a93d-c7d94663d503');
INSERT INTO public.question_metadata_incorrect_answers
VALUES ('349cff38-8f3a-4255-9158-5dff8b51a5d1', 'df832cb9-4dba-4dcb-9ab7-a1e0beaf55b3');
INSERT INTO public.question_metadata_incorrect_answers
VALUES ('b5484893-0d8d-435b-975d-83119e2ddf17', 'df832cb9-4dba-4dcb-9ab7-a1e0beaf55b3');
INSERT INTO public.question_metadata_incorrect_answers
VALUES ('faf66c0e-c112-4c64-92c0-ec0e3becb438', '08baa9c6-8191-4bb4-b0b6-dd4de6ad30c6');
INSERT INTO public.question_metadata_incorrect_answers
VALUES ('ff3ada7a-1de6-4936-a66e-cf75cbdba8c8', '92adebb0-13f1-4c7c-8d6e-dcd7a3d4cfe7');
INSERT INTO public.question_metadata_incorrect_answers
VALUES ('dba123d0-a051-499f-aa16-49af82987ff4', '92adebb0-13f1-4c7c-8d6e-dcd7a3d4cfe7');
INSERT INTO public.question_metadata_incorrect_answers
VALUES ('7b205e02-6010-4e64-a1ed-31a4d7defdad', 'fdec2b11-659a-479d-a70d-19dc43e515fc');
INSERT INTO public.question_metadata_incorrect_answers
VALUES ('dad8f7e4-57db-4524-a131-b8f789140bbe', '02578e09-8af1-494d-ac5f-5f1256930187');
INSERT INTO public.question_metadata_incorrect_answers
VALUES ('ab56daa6-02d1-42bd-822e-fead4c278e53', '02578e09-8af1-494d-ac5f-5f1256930187');
INSERT INTO public.question_metadata_incorrect_answers
VALUES ('2fea4a27-7190-4c8a-8efe-c1359e66c067', '27995b26-b2b1-4b91-be69-703c76e483a5');
INSERT INTO public.question_metadata_incorrect_answers
VALUES ('8742d97e-8aa5-48ec-a22b-099a3c9972ae', 'df4a1111-1e0f-4b65-8a82-22d08205d91c');
INSERT INTO public.question_metadata_incorrect_answers
VALUES ('07398fc6-65a0-4968-a86a-04a9221f0baa', 'df4a1111-1e0f-4b65-8a82-22d08205d91c');
INSERT INTO public.question_metadata_incorrect_answers
VALUES ('4e8d0387-aae6-4311-a3ce-a48ea8a68979', 'df4a1111-1e0f-4b65-8a82-22d08205d91c');
INSERT INTO public.question_metadata_incorrect_answers
VALUES ('b9ac82f8-fcdc-4184-8d78-a358e55e5ed5', 'df4a1111-1e0f-4b65-8a82-22d08205d91c');
INSERT INTO public.question_metadata_incorrect_answers
VALUES ('4c0d71ab-4e1e-4c46-9a01-1efa5092b77a', '3cd1dc6a-ddd0-481d-b57c-9e795126ad37');
INSERT INTO public.question_metadata_incorrect_answers
VALUES ('c27993ee-d28c-45aa-af7c-b5e766c70306', '3cd1dc6a-ddd0-481d-b57c-9e795126ad37');
INSERT INTO public.question_metadata_incorrect_answers
VALUES ('b7b99b8a-a845-49e4-976c-f621a5b574d2', '3cd1dc6a-ddd0-481d-b57c-9e795126ad37');
INSERT INTO public.question_metadata_incorrect_answers
VALUES ('f928420e-7e0e-4645-9416-23fce6a54b39', 'fb5d5709-f0ad-4093-8231-fd3bb19b2cc2');
INSERT INTO public.question_metadata_incorrect_answers
VALUES ('0427b870-d762-4612-ba3c-6c08230777c4', 'fb5d5709-f0ad-4093-8231-fd3bb19b2cc2');
INSERT INTO public.question_metadata_incorrect_answers
VALUES ('c05edcbe-3428-4dfb-98ea-f5801ce0eb94', 'fb5d5709-f0ad-4093-8231-fd3bb19b2cc2');
INSERT INTO public.question_metadata_incorrect_answers
VALUES ('e3889cc4-6f74-4c5b-9218-4d206e069732', 'fb5d5709-f0ad-4093-8231-fd3bb19b2cc2');
INSERT INTO public.question_metadata_incorrect_answers
VALUES ('1bb28054-e2ad-4ec4-b11d-07c092c57940', 'ca217d4b-3b9e-43eb-a002-663c94925eeb');
INSERT INTO public.question_metadata_incorrect_answers
VALUES ('f40036d9-0cd7-4f6d-b050-d4de8fd85b15', 'ca217d4b-3b9e-43eb-a002-663c94925eeb');
INSERT INTO public.question_metadata_incorrect_answers
VALUES ('5015fa6f-98e1-418d-8d3a-8ce32ce9589d', 'ca217d4b-3b9e-43eb-a002-663c94925eeb');



INSERT INTO public.question_placeholder_definitions
VALUES ('28390539-6a70-4ab4-8eb5-d80a6a1eb4b3', 'P_2', '{"type":"str_random_one_of","options":["ASD","FDs"]}');
INSERT INTO public.question_placeholder_definitions
VALUES ('28390539-6a70-4ab4-8eb5-d80a6a1eb4b3', 'P_1', '{"type":"i32_random_one_of","options":[12,32]}');
INSERT INTO public.question_placeholder_definitions
VALUES ('28390539-6a70-4ab4-8eb5-d80a6a1eb4b3', 'P_3', '{"type":"i32_range","start":0,"end":10}');
INSERT INTO public.question_placeholder_definitions
VALUES ('c1cc0172-f55e-446c-b717-f6ec53a65196', 'P_2', '{"type":"str_value","value":"stable value"}');
INSERT INTO public.question_placeholder_definitions
VALUES ('c1cc0172-f55e-446c-b717-f6ec53a65196', 'P_1', '{"type":"i32_random_one_of","options":[1,2,3]}');
INSERT INTO public.question_placeholder_definitions
VALUES ('c1cc0172-f55e-446c-b717-f6ec53a65196', 'P_3', '{"type":"i32_range","start":12,"end":30}');
INSERT INTO public.question_placeholder_definitions
VALUES ('fcfcea25-4f80-4558-a76c-be834c5a4712', 'P_3', '{"type":"i32_range","start":0,"end":10}');
INSERT INTO public.question_placeholder_definitions
VALUES ('fcfcea25-4f80-4558-a76c-be834c5a4712', 'P_2', '{"type":"str_random_one_of","options":["ASD","FDs"]}');
INSERT INTO public.question_placeholder_definitions
VALUES ('fcfcea25-4f80-4558-a76c-be834c5a4712', 'P_1', '{"type":"i32_random_one_of","options":[12,32]}');
INSERT INTO public.question_placeholder_definitions
VALUES ('8e90ea82-573b-4025-8ab8-83772d341445', 'P_3', '{"type":"i32_range","start":12,"end":30}');
INSERT INTO public.question_placeholder_definitions
VALUES ('8e90ea82-573b-4025-8ab8-83772d341445', 'P_2', '{"type":"str_value","value":"stable value"}');
INSERT INTO public.question_placeholder_definitions
VALUES ('8e90ea82-573b-4025-8ab8-83772d341445', 'P_1', '{"type":"i32_random_one_of","options":[1,2,3]}');
INSERT INTO public.question_placeholder_definitions
VALUES ('2ac1f035-eb13-43d4-8af3-4df815d8d93b', 'P_3', '{"type":"i32_range","start":0,"end":10}');
INSERT INTO public.question_placeholder_definitions
VALUES ('2ac1f035-eb13-43d4-8af3-4df815d8d93b', 'P_2', '{"type":"str_random_one_of","options":["ASD","FDs"]}');
INSERT INTO public.question_placeholder_definitions
VALUES ('2ac1f035-eb13-43d4-8af3-4df815d8d93b', 'P_1', '{"type":"i32_random_one_of","options":[12,32]}');
INSERT INTO public.question_placeholder_definitions
VALUES ('e758f53f-2e72-474d-9326-ae38ef9eec03', 'P_3', '{"type":"i32_range","start":12,"end":30}');
INSERT INTO public.question_placeholder_definitions
VALUES ('e758f53f-2e72-474d-9326-ae38ef9eec03', 'P_2', '{"type":"str_value","value":"stable value"}');
INSERT INTO public.question_placeholder_definitions
VALUES ('e758f53f-2e72-474d-9326-ae38ef9eec03', 'P_1', '{"type":"i32_random_one_of","options":[1,2,3]}');
INSERT INTO public.question_placeholder_definitions
VALUES ('cf35398d-6efe-4540-8408-794d95ab2bc8', 'P_3', '{"type":"i32_range","start":0,"end":10}');
INSERT INTO public.question_placeholder_definitions
VALUES ('cf35398d-6efe-4540-8408-794d95ab2bc8', 'P_2', '{"type":"str_random_one_of","options":["ASD","FDs"]}');
INSERT INTO public.question_placeholder_definitions
VALUES ('cf35398d-6efe-4540-8408-794d95ab2bc8', 'P_1', '{"type":"i32_random_one_of","options":[12,32]}');
INSERT INTO public.question_placeholder_definitions
VALUES ('5af3b89c-59ba-4a6c-8afd-22ce157f6bec', 'P_3', '{"type":"i32_range","start":12,"end":30}');
INSERT INTO public.question_placeholder_definitions
VALUES ('5af3b89c-59ba-4a6c-8afd-22ce157f6bec', 'P_2', '{"type":"str_value","value":"stable value"}');
INSERT INTO public.question_placeholder_definitions
VALUES ('5af3b89c-59ba-4a6c-8afd-22ce157f6bec', 'P_1', '{"type":"i32_random_one_of","options":[1,2,3]}');
INSERT INTO public.question_placeholder_definitions
VALUES ('9502f9f0-60af-4907-935b-49ef9822c750', 'P_3', '{"type":"i32_range","start":0,"end":10}');
INSERT INTO public.question_placeholder_definitions
VALUES ('9502f9f0-60af-4907-935b-49ef9822c750', 'P_2', '{"type":"str_random_one_of","options":["ASD","FDs"]}');
INSERT INTO public.question_placeholder_definitions
VALUES ('9502f9f0-60af-4907-935b-49ef9822c750', 'P_1', '{"type":"i32_random_one_of","options":[12,32]}');
INSERT INTO public.question_placeholder_definitions
VALUES ('6f176c79-22ee-4029-9e84-9256be82d7e2', 'P_3', '{"type":"i32_range","start":12,"end":30}');
INSERT INTO public.question_placeholder_definitions
VALUES ('6f176c79-22ee-4029-9e84-9256be82d7e2', 'P_2', '{"type":"str_value","value":"stable value"}');
INSERT INTO public.question_placeholder_definitions
VALUES ('6f176c79-22ee-4029-9e84-9256be82d7e2', 'P_1', '{"type":"i32_random_one_of","options":[1,2,3]}');
INSERT INTO public.question_placeholder_definitions
VALUES ('2ff031fe-83c9-4612-8a3b-65b92d5e41fd', 'P_3', '{"type":"i32_range","start":0,"end":10}');
INSERT INTO public.question_placeholder_definitions
VALUES ('2ff031fe-83c9-4612-8a3b-65b92d5e41fd', 'P_2', '{"type":"str_random_one_of","options":["ASD","FDs"]}');
INSERT INTO public.question_placeholder_definitions
VALUES ('2ff031fe-83c9-4612-8a3b-65b92d5e41fd', 'P_1', '{"type":"i32_random_one_of","options":[12,32]}');
INSERT INTO public.question_placeholder_definitions
VALUES ('423149ed-5e0b-43dc-a244-4ac68d56f747', 'P_3', '{"type":"i32_range","start":12,"end":30}');
INSERT INTO public.question_placeholder_definitions
VALUES ('423149ed-5e0b-43dc-a244-4ac68d56f747', 'P_2', '{"type":"str_value","value":"stable value"}');
INSERT INTO public.question_placeholder_definitions
VALUES ('423149ed-5e0b-43dc-a244-4ac68d56f747', 'P_1', '{"type":"i32_random_one_of","options":[1,2,3]}');
INSERT INTO public.question_placeholder_definitions
VALUES ('ba23f875-03a5-419c-8d08-719e57c50fa4', 'P_3', '{"type":"i32_range","start":0,"end":10}');
INSERT INTO public.question_placeholder_definitions
VALUES ('ba23f875-03a5-419c-8d08-719e57c50fa4', 'P_2', '{"type":"str_random_one_of","options":["ASD","FDs"]}');
INSERT INTO public.question_placeholder_definitions
VALUES ('ba23f875-03a5-419c-8d08-719e57c50fa4', 'P_1', '{"type":"i32_random_one_of","options":[12,32]}');
INSERT INTO public.question_placeholder_definitions
VALUES ('31c60fd3-59de-40d2-9e5b-1d1276ad9d28', 'P_3', '{"type":"i32_range","start":12,"end":30}');
INSERT INTO public.question_placeholder_definitions
VALUES ('31c60fd3-59de-40d2-9e5b-1d1276ad9d28', 'P_2', '{"type":"str_value","value":"stable value"}');
INSERT INTO public.question_placeholder_definitions
VALUES ('31c60fd3-59de-40d2-9e5b-1d1276ad9d28', 'P_1', '{"type":"i32_random_one_of","options":[1,2,3]}');
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
VALUES ('2025-05-08 12:56:26.372497+00', '2b0a5f12-c101-4667-9666-0a3e74adf9ba', '54638434-6bde-4ac9-a9c8-1b8f90a747f4',
        'Test Exam 1');
INSERT INTO public.test_models
VALUES ('2025-05-08 21:53:30.263205+00', '2b0a5f12-c101-4667-9666-0a3e74adf9ba', '1f7c9285-9098-405b-9da2-1fe5d185457b',
        'qwe');
INSERT INTO public.test_models
VALUES ('2025-05-09 10:54:45.994245+00', '2b0a5f12-c101-4667-9666-0a3e74adf9ba', '05282ebb-5241-47e2-a1b5-0121a1b9fe96',
        'Test Example #1');



INSERT INTO public.test_models_questions
VALUES ('28390539-6a70-4ab4-8eb5-d80a6a1eb4b3', '54638434-6bde-4ac9-a9c8-1b8f90a747f4');
INSERT INTO public.test_models_questions
VALUES ('c1cc0172-f55e-446c-b717-f6ec53a65196', '54638434-6bde-4ac9-a9c8-1b8f90a747f4');
INSERT INTO public.test_models_questions
VALUES ('28390539-6a70-4ab4-8eb5-d80a6a1eb4b3', '1f7c9285-9098-405b-9da2-1fe5d185457b');
INSERT INTO public.test_models_questions
VALUES ('c1cc0172-f55e-446c-b717-f6ec53a65196', '1f7c9285-9098-405b-9da2-1fe5d185457b');
INSERT INTO public.test_models_questions
VALUES ('5622480b-03f9-4788-af4a-507ac64502bb', '05282ebb-5241-47e2-a1b5-0121a1b9fe96');
INSERT INTO public.test_models_questions
VALUES ('75dd7aef-199a-4191-a61f-ec69885a8cd5', '05282ebb-5241-47e2-a1b5-0121a1b9fe96');



INSERT INTO public.user_question_answer
VALUES ('3decf6fb-071f-45e6-8402-255302f1b7b6', 'b513813c-57c2-4301-848f-30ad54769862');
INSERT INTO public.user_question_answer
VALUES ('46bc94cc-7d3c-45d3-a93a-ce4c3384ae61', 'd06a96ee-e104-48d1-b54d-85eb2c5ae3f0');
INSERT INTO public.user_question_answer
VALUES ('e3dafcae-d9c5-4830-8759-a7fe9cb3c89c', 'b513813c-57c2-4301-848f-30ad54769862');
INSERT INTO public.user_question_answer
VALUES ('e068f2fe-b8c2-45ed-9472-75db0f7f95b3', 'd06a96ee-e104-48d1-b54d-85eb2c5ae3f0');
INSERT INTO public.user_question_answer
VALUES ('54330d33-2f10-488f-a8a7-31527c4a1ebe', 'd06a96ee-e104-48d1-b54d-85eb2c5ae3f0');
INSERT INTO public.user_question_answer
VALUES ('c6050796-974c-4eb7-a51a-a9d9d3a11897', 'b513813c-57c2-4301-848f-30ad54769862');
INSERT INTO public.user_question_answer
VALUES ('bce0652d-69b2-421d-8295-6f419cf19379', 'd06a96ee-e104-48d1-b54d-85eb2c5ae3f0');
INSERT INTO public.user_question_answer
VALUES ('d471a1ec-7ab1-4cd2-8805-a69660d6973a', 'b513813c-57c2-4301-848f-30ad54769862');
INSERT INTO public.user_question_answer
VALUES ('80ad2393-882c-40af-89d0-8f7f5bd74dc9', 'd06a96ee-e104-48d1-b54d-85eb2c5ae3f0');
INSERT INTO public.user_question_answer
VALUES ('c0c93c3b-db8f-4ab4-9ec2-ab4e5f6f2b1c', 'b513813c-57c2-4301-848f-30ad54769862');
INSERT INTO public.user_question_answer
VALUES ('635a461b-2a50-4585-9896-12b9f0e0f76f', '08baa9c6-8191-4bb4-b0b6-dd4de6ad30c6');
INSERT INTO public.user_question_answer
VALUES ('29fd883c-d102-4796-835e-0f848a35d3ed', 'df4a1111-1e0f-4b65-8a82-22d08205d91c');
INSERT INTO public.user_question_answer
VALUES ('48b931d7-c36b-4b0c-a56e-22aaa05d776c', '3cd1dc6a-ddd0-481d-b57c-9e795126ad37');
INSERT INTO public.user_question_answer
VALUES ('9d408cd2-f7da-459f-be78-de720b0db7cd', 'ca217d4b-3b9e-43eb-a002-663c94925eeb');



INSERT INTO public.user_question_answer_mapping
VALUES ('28d698e6-2e82-4cfb-a42d-0ca77296d7de', '3decf6fb-071f-45e6-8402-255302f1b7b6');
INSERT INTO public.user_question_answer_mapping
VALUES ('6a14d759-a42c-4c3f-b951-befa9321a3b6', '3decf6fb-071f-45e6-8402-255302f1b7b6');
INSERT INTO public.user_question_answer_mapping
VALUES ('b377e6e7-2b8b-4944-97c0-5529d21c4ddf', '46bc94cc-7d3c-45d3-a93a-ce4c3384ae61');
INSERT INTO public.user_question_answer_mapping
VALUES ('28d698e6-2e82-4cfb-a42d-0ca77296d7de', 'e3dafcae-d9c5-4830-8759-a7fe9cb3c89c');
INSERT INTO public.user_question_answer_mapping
VALUES ('6a14d759-a42c-4c3f-b951-befa9321a3b6', 'e3dafcae-d9c5-4830-8759-a7fe9cb3c89c');
INSERT INTO public.user_question_answer_mapping
VALUES ('b377e6e7-2b8b-4944-97c0-5529d21c4ddf', 'e068f2fe-b8c2-45ed-9472-75db0f7f95b3');
INSERT INTO public.user_question_answer_mapping
VALUES ('b377e6e7-2b8b-4944-97c0-5529d21c4ddf', '54330d33-2f10-488f-a8a7-31527c4a1ebe');
INSERT INTO public.user_question_answer_mapping
VALUES ('6a14d759-a42c-4c3f-b951-befa9321a3b6', 'c6050796-974c-4eb7-a51a-a9d9d3a11897');
INSERT INTO public.user_question_answer_mapping
VALUES ('b377e6e7-2b8b-4944-97c0-5529d21c4ddf', 'bce0652d-69b2-421d-8295-6f419cf19379');
INSERT INTO public.user_question_answer_mapping
VALUES ('6a14d759-a42c-4c3f-b951-befa9321a3b6', 'd471a1ec-7ab1-4cd2-8805-a69660d6973a');
INSERT INTO public.user_question_answer_mapping
VALUES ('b377e6e7-2b8b-4944-97c0-5529d21c4ddf', '80ad2393-882c-40af-89d0-8f7f5bd74dc9');
INSERT INTO public.user_question_answer_mapping
VALUES ('6a14d759-a42c-4c3f-b951-befa9321a3b6', 'c0c93c3b-db8f-4ab4-9ec2-ab4e5f6f2b1c');
INSERT INTO public.user_question_answer_mapping
VALUES ('faf66c0e-c112-4c64-92c0-ec0e3becb438', '635a461b-2a50-4585-9896-12b9f0e0f76f');
INSERT INTO public.user_question_answer_mapping
VALUES ('02415f25-d07c-417d-8bde-1b3a075740f4', '29fd883c-d102-4796-835e-0f848a35d3ed');
INSERT INTO public.user_question_answer_mapping
VALUES ('85f41095-d6ec-41b3-92a1-eb2c35932d52', '48b931d7-c36b-4b0c-a56e-22aaa05d776c');
INSERT INTO public.user_question_answer_mapping
VALUES ('1bb28054-e2ad-4ec4-b11d-07c092c57940', '9d408cd2-f7da-459f-be78-de720b0db7cd');



INSERT INTO public.user_tests
VALUES (0, '2025-05-08 13:39:53.323455+00', '2025-05-08 13:08:02.258093+00', 'a2f8ab60-7dac-457a-851c-a26ddabf71e0',
        'ca258114-b7e2-43fb-b47f-09332da6dbf9', '49c6a0e7-dd4b-4d80-be87-ec14b51435c7',
        '9a195c3c-d644-4fe5-a9e9-71e6387e81d5', 'COMPLETED');
INSERT INTO public.user_tests
VALUES (NULL, '2025-05-08 21:06:33.291707+00', '2025-05-08 21:06:14.340047+00', 'cd7d163c-b86e-4a3d-a47f-d1738b049790',
        '2209c2a1-f3a4-49db-b8db-b673f88bf1ef', '4c5fa7f3-25ed-4c4c-acd5-ac76f1a22a8b',
        '9a195c3c-d644-4fe5-a9e9-71e6387e81d5', 'CANCELLED');
INSERT INTO public.user_tests
VALUES (NULL, '2025-05-08 21:54:37.826+00', '2025-05-08 21:53:47.944251+00', '0915b7c5-e2e9-47c7-9da2-365a8fee9908',
        '7c23263c-2e1c-4ccc-93e2-867dd7ec9bdf', '294900d7-426f-4027-a7e9-066e5adf7220',
        '9a195c3c-d644-4fe5-a9e9-71e6387e81d5', 'EXPIRED');
INSERT INTO public.user_tests
VALUES (NULL, '2025-05-08 22:53:28.824+00', '2025-05-08 22:52:36.621666+00', '06521292-a7fe-4ec2-8038-c68806cd1da5',
        '90b5cb53-15d5-4803-93c6-aebc5f58d438', 'ca83decd-63f1-49c9-89d4-05bb27611a0a',
        '9a195c3c-d644-4fe5-a9e9-71e6387e81d5', 'EXPIRED');
INSERT INTO public.user_tests
VALUES (0, '2025-05-08 22:53:37.604352+00', '2025-05-08 21:09:44.026432+00', 'ebb7a75b-71c9-45ce-895a-b5b6e9de1ede',
        '6b769665-9a44-471a-a2ca-72cad191aa0c', 'e55df6cc-4d13-4156-b606-df00bc6e15f3',
        '9a195c3c-d644-4fe5-a9e9-71e6387e81d5', 'COMPLETED');
INSERT INTO public.user_tests
VALUES (100, '2025-05-09 10:59:22.703217+00', '2025-05-09 10:55:27.479695+00', 'e63eef3e-581c-4961-9df3-064412571665',
        'bff940d9-1108-46a3-b092-78a0c7d30b28', 'd7a5b231-ef71-4da5-904e-a1397a9f9553',
        '9a195c3c-d644-4fe5-a9e9-71e6387e81d5', 'COMPLETED');
INSERT INTO public.user_tests
VALUES (0, '2025-05-09 11:01:52.74877+00', '2025-05-09 11:00:58.732278+00', '8cf9abaa-d05c-44bc-a15b-c74f7dd8dbba',
        'bff940d9-1108-46a3-b092-78a0c7d30b28', '7217158a-73cb-45f1-acf5-16a6a79ba0e9',
        'd355c40c-2092-40a7-9db9-83ddef900164', 'COMPLETED');



INSERT INTO public.user_test_question_answers_mapping
VALUES ('80ad2393-882c-40af-89d0-8f7f5bd74dc9', 'a2f8ab60-7dac-457a-851c-a26ddabf71e0');
INSERT INTO public.user_test_question_answers_mapping
VALUES ('c0c93c3b-db8f-4ab4-9ec2-ab4e5f6f2b1c', 'a2f8ab60-7dac-457a-851c-a26ddabf71e0');
INSERT INTO public.user_test_question_answers_mapping
VALUES ('635a461b-2a50-4585-9896-12b9f0e0f76f', 'ebb7a75b-71c9-45ce-895a-b5b6e9de1ede');
INSERT INTO public.user_test_question_answers_mapping
VALUES ('29fd883c-d102-4796-835e-0f848a35d3ed', 'e63eef3e-581c-4961-9df3-064412571665');
INSERT INTO public.user_test_question_answers_mapping
VALUES ('48b931d7-c36b-4b0c-a56e-22aaa05d776c', 'e63eef3e-581c-4961-9df3-064412571665');
INSERT INTO public.user_test_question_answers_mapping
VALUES ('9d408cd2-f7da-459f-be78-de720b0db7cd', '8cf9abaa-d05c-44bc-a15b-c74f7dd8dbba');
