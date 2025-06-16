INSERT INTO public.codes VALUES ('b385a81c-4184-4196-ab50-fbf6764170d4', 'acc = 0
for x in [10, 20, 30, 40, 50]:
    if acc > a:
        break
    acc += x
return acc', '"Str"');
INSERT INTO public.codes VALUES ('71cdbceb-e8b9-4f22-865c-0c8cc6ec3305', 'return sum([10, 20, 30, 40, 50])', '"Str"');
INSERT INTO public.codes VALUES ('5e55cd0f-5d99-4b34-8712-f0ff7215e7dc', 'return sum([10, 20, 30, a])', '"Str"');
INSERT INTO public.codes VALUES ('a9fd3c86-12a6-425f-83a5-bdf9579b578e', 'return "0"', '"Str"');
INSERT INTO public.codes VALUES ('c5f01426-9d1c-4ebf-bdba-829bc59c4832', 'return sum([x for x in [5, 12, 8, 130, a, 44, 9, 25] if x > a])', '"Str"');
INSERT INTO public.codes VALUES ('e6d7f0d1-7389-4b3c-a5e9-046380dd3703', 'return sum([x for x in [5, 12, 8, 130, a, 44, 9, 25] if x < a])', '"Str"');
INSERT INTO public.codes VALUES ('02b169df-d3cf-4231-a408-727d39c14df7', 'return len([x for x in [5, 12, 8, 130, a, 44, 9, 25] if x > a])', '"Str"');
INSERT INTO public.codes VALUES ('68d6b70f-8fdb-4cfb-b592-ed6199eb1cc6', 'return sum([x for x in [5, 12, 8, 130, a, 44, 9, 25] if x >= a])', '"Str"');
INSERT INTO public.codes VALUES ('4fac18e7-5678-4f95-905b-e33134aeeaf9', 'return (c + d)[a:b]', '"Str"');
INSERT INTO public.codes VALUES ('f98b4030-b31a-4591-8b94-af514ebe76e4', 'return (c + d)[a + 1:b]', '"Str"');
INSERT INTO public.codes VALUES ('71f11e87-cedd-4e3c-9820-13c1082457bd', 'return (d + c)[a:b]', '"Str"');
INSERT INTO public.codes VALUES ('d075a3c3-1293-4053-b687-be8f496a10f5', 'return "IndexError"', '"Str"');
INSERT INTO public.codes VALUES ('cef73aea-b446-4273-a2d2-e0915cb3fc03', 'res = ""
if c % a == 0: res += "Fizz"
if c % b == 0: res += "Buzz"
if res == "": res = str(c)
return res
', '"Str"');
INSERT INTO public.codes VALUES ('186d3b93-e25b-40ff-9335-b26025dc4ea4', 'data = {"USER-A-1": "Apple", "USER-A-2": "Avocado", "USER-B-1": "Banana", "USER-B-2": "Blueberry"}
key = f"USER-{a}-{b}"
return data[key]', '"Str"');
INSERT INTO public.codes VALUES ('19d29251-9e93-41ea-9f71-2975778f4987', 'return f"USER-{a}-{b}"', '"Str"');
INSERT INTO public.codes VALUES ('a84c579c-c187-4174-8109-baf0429c9718', 'return ((a | b) & a) ^ b', '"Str"');
INSERT INTO public.codes VALUES ('086e06c6-c08d-44b3-a7a1-300ea79c8be1', 'return (a | b) & a', '"Str"');
INSERT INTO public.codes VALUES ('394d80eb-b0be-4351-834b-939eb7737ff0', 'return a & b', '"Str"');
INSERT INTO public.codes VALUES ('8cfa624c-8314-4e29-b1d3-c125934d3fd7', 'res = ""
if c % a == 0: res += "Buzz";
if c % b == 0: res += "Fizz"
if res == "": res = "<empty>"
return res', '"Str"');
INSERT INTO public.codes VALUES ('41513904-7e2f-4658-9e6f-e0f19d6c257e', 'res = ""
if c % a == 0: res += "Fiz"
if c % b == 0: res += "Buz"
if res == "": res = (str(c)[::-1])
return res
', '"Str"');
INSERT INTO public.codes VALUES ('d4b8f269-96a8-4ee4-b28d-f4950d89987c', 'import math
if c == "square":
    return b * b if a == "area" else 4 * b
else: # circle
    return math.pi * b**2 if a == "area" else 2 * math.pi * b', '"Str"');
INSERT INTO public.codes VALUES ('44ca72a7-c875-4c61-819d-14828d3feb9d', 'import math
if c == "circle":
    return b * b if a == "area" else 4 * b
else:
    return math.pi * b**2 if a == "area" else 2 * math.pi * b', '"Str"');
INSERT INTO public.codes VALUES ('4da910a0-4bbe-4bf7-8efa-973a2d800212', 'return b * 2 + b ** 2', '"Str"');
INSERT INTO public.codes VALUES ('122a889b-1924-43f7-8439-36d065db406b', 'import math
return math.pi * b', '"Str"');
INSERT INTO public.codes VALUES ('01cb7422-6ff9-4d3c-a774-14f41a901ce8', '# V=IR, P=V*I=V^2/R
if c == "current in Amps":
    return a / b
else: # power in Watts
    return (a ** 2) / b
', '"Str"');
INSERT INTO public.codes VALUES ('43a4f153-1164-45d9-b8e3-7a2e05721c00', 'return a * b', '"Str"');
INSERT INTO public.codes VALUES ('e67e1ae3-2dea-4d7a-9fe1-a8274345fb70', 'return b - 2 * a', '"Str"');
INSERT INTO public.codes VALUES ('b329881a-fd48-46ec-a027-bd86bf32a86a', 'return a / b + 2 * a', '"Str"');

INSERT INTO public.users VALUES (false, '2b0a5f12-c101-4667-9666-0a3e74adf9ba', 'teacher', 'Teacher', 'teacher', NULL);
INSERT INTO public.users VALUES (false, '9a195c3c-d644-4fe5-a9e9-71e6387e81d5', 'student', 'Student', 'student', NULL);
INSERT INTO public.users VALUES (false, 'd355c40c-2092-40a7-9db9-83ddef900164', 'student1', 'Student', 'student1', NULL);

INSERT INTO public.questions VALUES (true, true, '2025-06-15 12:19:58.389782+00', '2b0a5f12-c101-4667-9666-0a3e74adf9ba', '87e73a43-4d2e-468c-a34e-70b1ae8abc95', 'Loop with a Conditional Break', '{"format":"csharp","code":"// Calculate the final value of accumulator.\n\nint accumulator = 0;\nint break_point = P_1;\nint[] values = {10, 20, 30, 40, 50};\n\nforeach (int val in values)\n{\n    if (accumulator > break_point)\n    {\n        break;\n    }\n    accumulator += val;\n}"}', '"python"');
INSERT INTO public.questions VALUES (true, true, '2025-06-15 12:21:21.051053+00', '2b0a5f12-c101-4667-9666-0a3e74adf9ba', 'fcf76fd3-ee41-41aa-b732-284d08ff0873', 'FizzBuzz with a Twist', '{"format":"python","code":"def fizz_buzz_pro(n, div1, div2):\n    output = \"\"\n    if n % div1 == 0:\n        output += \"Fizz\"\n    if n % div2 == 0:\n        output += \"Buzz\"\n    if output == \"\":\n        output = str(n)\n    return output\n\nprint(fizz_buzz_pro(P_3, P_1, P_2))"}', '"python"');
INSERT INTO public.questions VALUES (true, true, '2025-06-15 12:20:01.49238+00', '2b0a5f12-c101-4667-9666-0a3e74adf9ba', '00404ac7-6040-4854-930c-7d8304fff403', 'Array Filtering and Summation', '{"format":"javascript","code":"// What will be the value of sum_of_filtered?\n\nconst numbers = [5, 12, 8, 130, P_1, 44, 9, 25];\nconst threshold = P_1;\n\nconst filtered = numbers.filter(num => num > threshold);\nconst sum_of_filtered = filtered.reduce((acc, current) => acc + current, 0);"}', '"python"');
INSERT INTO public.questions VALUES (true, true, '2025-06-15 12:20:03.870482+00', '2b0a5f12-c101-4667-9666-0a3e74adf9ba', '35e90754-ed8e-4407-a1ce-6f4502dc1f87', 'String Manipulation and Slicing', '{"format":"python","code":"# What is the final value of result?\n\ndef combine(s1, s2):\n    full_string = s1 + s2\n    start_index = P_1\n    end_index = P_2\n    return full_string[start_index:end_index]\n\nresult = combine(P_3, P_4)"}', '"python"');
INSERT INTO public.questions VALUES (true, true, '2025-06-15 12:42:43.885094+00', '2b0a5f12-c101-4667-9666-0a3e74adf9ba', '7923a6b9-1b82-4a21-bcd5-9a0c71429922', 'Dictionary Key Manipulation', '{"format":"javascript","code":"// What is the value of retrieved_data?\nconst data = {\n    \"USER-A-1\": \"Apple\",\n    \"USER-A-2\": \"Avocado\",\n    \"USER-B-1\": \"Banana\",\n    \"USER-B-2\": \"Blueberry\",\n};\n\nconst prefix = \"USER\";\nconst category = P_1;\nconst id = P_2;\n\nconst key = `${prefix}-${category}-${id}`;\nconst retrieved_data = data[key];"}', '"python"');
INSERT INTO public.questions VALUES (true, true, '2025-06-15 13:04:41.514421+00', '2b0a5f12-c101-4667-9666-0a3e74adf9ba', '41511830-aa6f-4a1b-9298-3fe787282cd0', 'Geometry', '{"format":"txt","code":"A shape has a characteristic dimension of P_2. Calculate the P_1 of a P_3 with this dimension. (If it''s a square, the dimension is the side length; if it''s a circle, it''s the radius)."}', '"python"');
INSERT INTO public.questions VALUES (true, true, '2025-06-15 12:46:43.078817+00', '2b0a5f12-c101-4667-9666-0a3e74adf9ba', '59ee4130-f6f0-4160-9a59-def1120436d5', 'Bitwise Operations', '{"format":"java","code":"// Determine the final value of result after the bitwise operations.\nclass BitwiseFun {\n    public static void main(String[] args) {\n        int x = P_1;\n        int y = P_2;\n\n        int z = (x | y) & x;\n        int result = z ^ y; // XOR with y\n    }\n}"}', '"python"');
INSERT INTO public.questions VALUES (true, true, '2025-06-15 13:11:48.266781+00', '2b0a5f12-c101-4667-9666-0a3e74adf9ba', 'f6a98297-b6f6-4129-82f8-574e3aaaadaa', 'Physics', '{"format":"txt","code":"A simple circuit has a voltage of P_1 volts and a resistance of P_2 ohms. Calculate the P_3."}', '"python"');

INSERT INTO public.variants VALUES (true, '2025-06-15 12:19:58.389717+00', 'b385a81c-4184-4196-ab50-fbf6764170d4', NULL, '3146f48a-6867-4dec-bf68-a1fa693d5a39');
INSERT INTO public.variants VALUES (true, '2025-06-15 12:19:58.389757+00', '71cdbceb-e8b9-4f22-865c-0c8cc6ec3305', NULL, 'cf8ccae2-303c-4cf7-ac56-c51510b9127b');
INSERT INTO public.variants VALUES (true, '2025-06-15 12:19:58.389765+00', '5e55cd0f-5d99-4b34-8712-f0ff7215e7dc', NULL, 'afd8b442-f499-4a4d-9c2c-b0e5375fe9f5');
INSERT INTO public.variants VALUES (true, '2025-06-15 12:19:58.389771+00', 'a9fd3c86-12a6-425f-83a5-bdf9579b578e', NULL, '6a814cc1-cb72-4fe5-9c25-26768a32f635');
INSERT INTO public.variants VALUES (true, '2025-06-15 12:20:01.492353+00', 'c5f01426-9d1c-4ebf-bdba-829bc59c4832', NULL, 'acdb85b4-91dd-4373-bc62-0645422cf5f2');
INSERT INTO public.variants VALUES (true, '2025-06-15 12:20:01.492364+00', 'e6d7f0d1-7389-4b3c-a5e9-046380dd3703', NULL, '4771d6c5-9d2b-43ec-ab20-a5b20a47d8e5');
INSERT INTO public.variants VALUES (true, '2025-06-15 12:20:01.49237+00', '02b169df-d3cf-4231-a408-727d39c14df7', NULL, 'f9dd3aca-9639-4a97-9ac5-d22c8747445a');
INSERT INTO public.variants VALUES (true, '2025-06-15 12:20:01.492375+00', '68d6b70f-8fdb-4cfb-b592-ed6199eb1cc6', NULL, '392b5cd8-eb42-4f12-a883-9f826597fd20');
INSERT INTO public.variants VALUES (true, '2025-06-15 12:20:03.870458+00', '4fac18e7-5678-4f95-905b-e33134aeeaf9', NULL, '05375d43-d274-4561-94d6-1411deda40b0');
INSERT INTO public.variants VALUES (true, '2025-06-15 12:20:03.870467+00', 'f98b4030-b31a-4591-8b94-af514ebe76e4', NULL, '6d6651be-3e5d-4e7c-a04d-98b0b703b6a4');
INSERT INTO public.variants VALUES (true, '2025-06-15 12:20:03.870472+00', '71f11e87-cedd-4e3c-9820-13c1082457bd', NULL, 'dd9b5939-0a28-4e04-80fa-0dd22c9e8ebf');
INSERT INTO public.variants VALUES (true, '2025-06-15 12:20:03.870477+00', 'd075a3c3-1293-4053-b687-be8f496a10f5', NULL, '287c7a40-94de-41fe-a1f1-5387fea14e97');
INSERT INTO public.variants VALUES (true, '2025-06-15 12:22:48.22609+00', 'cef73aea-b446-4273-a2d2-e0915cb3fc03', '2b0a5f12-c101-4667-9666-0a3e74adf9ba', 'e9c94cad-f5f4-4e1d-bef1-00ca028c4225');
INSERT INTO public.variants VALUES (true, '2025-06-15 12:44:10.424126+00', '186d3b93-e25b-40ff-9335-b26025dc4ea4', '2b0a5f12-c101-4667-9666-0a3e74adf9ba', '7e081af0-81af-41f9-8f5e-a1673bb58529');
INSERT INTO public.variants VALUES (true, '2025-06-15 12:44:19.73973+00', '19d29251-9e93-41ea-9f71-2975778f4987', '2b0a5f12-c101-4667-9666-0a3e74adf9ba', '09637434-79e9-429b-adca-58b6547dd7ad');
INSERT INTO public.variants VALUES (true, '2025-06-15 12:48:03.802118+00', 'a84c579c-c187-4174-8109-baf0429c9718', '2b0a5f12-c101-4667-9666-0a3e74adf9ba', '0b483b3c-87ab-4b53-84a8-a335efccd46d');
INSERT INTO public.variants VALUES (true, '2025-06-15 12:48:15.400381+00', '086e06c6-c08d-44b3-a7a1-300ea79c8be1', '2b0a5f12-c101-4667-9666-0a3e74adf9ba', 'a10163bb-ce0d-414f-a7d7-9b07c9799fc9');
INSERT INTO public.variants VALUES (true, '2025-06-15 12:48:23.889344+00', '394d80eb-b0be-4351-834b-939eb7737ff0', '2b0a5f12-c101-4667-9666-0a3e74adf9ba', 'a1088586-9fc5-4325-9602-42c3dc4108cb');
INSERT INTO public.variants VALUES (true, '2025-06-15 12:55:40.345114+00', '8cfa624c-8314-4e29-b1d3-c125934d3fd7', '2b0a5f12-c101-4667-9666-0a3e74adf9ba', '36357506-e945-4f6e-8d1e-3b3a6bb7595d');
INSERT INTO public.variants VALUES (true, '2025-06-15 12:58:57.423295+00', '41513904-7e2f-4658-9e6f-e0f19d6c257e', '2b0a5f12-c101-4667-9666-0a3e74adf9ba', '5a2b8905-bb7a-489f-add3-d7f38daee611');
INSERT INTO public.variants VALUES (true, '2025-06-15 13:07:02.726614+00', 'd4b8f269-96a8-4ee4-b28d-f4950d89987c', '2b0a5f12-c101-4667-9666-0a3e74adf9ba', 'ff3e5097-4a3b-4875-824b-3cbc9f618828');
INSERT INTO public.variants VALUES (true, '2025-06-15 13:07:49.301744+00', '44ca72a7-c875-4c61-819d-14828d3feb9d', '2b0a5f12-c101-4667-9666-0a3e74adf9ba', '2b33a3c5-05c0-4fe4-90f1-a1d0b2d6e321');
INSERT INTO public.variants VALUES (true, '2025-06-15 13:08:18.113597+00', '4da910a0-4bbe-4bf7-8efa-973a2d800212', '2b0a5f12-c101-4667-9666-0a3e74adf9ba', 'e49060f6-7010-4eb2-9b88-ab33f8bfab80');
INSERT INTO public.variants VALUES (true, '2025-06-15 13:08:56.181348+00', '122a889b-1924-43f7-8439-36d065db406b', '2b0a5f12-c101-4667-9666-0a3e74adf9ba', '7278e20d-b3ab-4836-832e-64bed5c4a54a');
INSERT INTO public.variants VALUES (true, '2025-06-15 13:13:48.055737+00', '01cb7422-6ff9-4d3c-a774-14f41a901ce8', '2b0a5f12-c101-4667-9666-0a3e74adf9ba', 'dac667c8-19f7-4787-a09b-51a2e477b15a');
INSERT INTO public.variants VALUES (true, '2025-06-15 13:14:04.595391+00', '43a4f153-1164-45d9-b8e3-7a2e05721c00', '2b0a5f12-c101-4667-9666-0a3e74adf9ba', '56dbf0fa-ce64-4b30-83a9-3cfa25a4d763');
INSERT INTO public.variants VALUES (true, '2025-06-15 13:14:19.782236+00', 'e67e1ae3-2dea-4d7a-9fe1-a8274345fb70', '2b0a5f12-c101-4667-9666-0a3e74adf9ba', 'c1943206-d5d2-47ee-b6f9-5ce9394490aa');
INSERT INTO public.variants VALUES (true, '2025-06-15 13:14:51.475461+00', 'b329881a-fd48-46ec-a027-bd86bf32a86a', '2b0a5f12-c101-4667-9666-0a3e74adf9ba', '0d5729fb-009e-4456-9674-43c3b1b39a11');

INSERT INTO public.question_call_args VALUES ('87e73a43-4d2e-468c-a34e-70b1ae8abc95', '{"identifier":"P_1","name":"a"}');
INSERT INTO public.question_call_args VALUES ('00404ac7-6040-4854-930c-7d8304fff403', '{"identifier":"P_1","name":"a"}');
INSERT INTO public.question_call_args VALUES ('35e90754-ed8e-4407-a1ce-6f4502dc1f87', '{"identifier":"P_1","name":"a"}');
INSERT INTO public.question_call_args VALUES ('35e90754-ed8e-4407-a1ce-6f4502dc1f87', '{"identifier":"P_2","name":"b"}');
INSERT INTO public.question_call_args VALUES ('35e90754-ed8e-4407-a1ce-6f4502dc1f87', '{"identifier":"P_3","name":"c"}');
INSERT INTO public.question_call_args VALUES ('35e90754-ed8e-4407-a1ce-6f4502dc1f87', '{"identifier":"P_4","name":"d"}');
INSERT INTO public.question_call_args VALUES ('fcf76fd3-ee41-41aa-b732-284d08ff0873', '{"identifier":"P_1","name":"a"}');
INSERT INTO public.question_call_args VALUES ('fcf76fd3-ee41-41aa-b732-284d08ff0873', '{"identifier":"P_2","name":"b"}');
INSERT INTO public.question_call_args VALUES ('fcf76fd3-ee41-41aa-b732-284d08ff0873', '{"identifier":"P_3","name":"c"}');
INSERT INTO public.question_call_args VALUES ('7923a6b9-1b82-4a21-bcd5-9a0c71429922', '{"identifier":"P_1","name":"a"}');
INSERT INTO public.question_call_args VALUES ('7923a6b9-1b82-4a21-bcd5-9a0c71429922', '{"identifier":"P_2","name":"b"}');
INSERT INTO public.question_call_args VALUES ('59ee4130-f6f0-4160-9a59-def1120436d5', '{"identifier":"P_1","name":"a"}');
INSERT INTO public.question_call_args VALUES ('59ee4130-f6f0-4160-9a59-def1120436d5', '{"identifier":"P_2","name":"b"}');
INSERT INTO public.question_call_args VALUES ('41511830-aa6f-4a1b-9298-3fe787282cd0', '{"identifier":"P_1","name":"a"}');
INSERT INTO public.question_call_args VALUES ('41511830-aa6f-4a1b-9298-3fe787282cd0', '{"identifier":"P_2","name":"b"}');
INSERT INTO public.question_call_args VALUES ('41511830-aa6f-4a1b-9298-3fe787282cd0', '{"identifier":"P_3","name":"c"}');
INSERT INTO public.question_call_args VALUES ('f6a98297-b6f6-4129-82f8-574e3aaaadaa', '{"identifier":"P_1","name":"a"}');
INSERT INTO public.question_call_args VALUES ('f6a98297-b6f6-4129-82f8-574e3aaaadaa', '{"identifier":"P_2","name":"b"}');
INSERT INTO public.question_call_args VALUES ('f6a98297-b6f6-4129-82f8-574e3aaaadaa', '{"identifier":"P_3","name":"c"}');

INSERT INTO public.question_correct_variants VALUES ('87e73a43-4d2e-468c-a34e-70b1ae8abc95', '3146f48a-6867-4dec-bf68-a1fa693d5a39');
INSERT INTO public.question_correct_variants VALUES ('00404ac7-6040-4854-930c-7d8304fff403', 'acdb85b4-91dd-4373-bc62-0645422cf5f2');
INSERT INTO public.question_correct_variants VALUES ('35e90754-ed8e-4407-a1ce-6f4502dc1f87', '05375d43-d274-4561-94d6-1411deda40b0');
INSERT INTO public.question_correct_variants VALUES ('fcf76fd3-ee41-41aa-b732-284d08ff0873', 'e9c94cad-f5f4-4e1d-bef1-00ca028c4225');
INSERT INTO public.question_correct_variants VALUES ('7923a6b9-1b82-4a21-bcd5-9a0c71429922', '7e081af0-81af-41f9-8f5e-a1673bb58529');
INSERT INTO public.question_correct_variants VALUES ('59ee4130-f6f0-4160-9a59-def1120436d5', '0b483b3c-87ab-4b53-84a8-a335efccd46d');
INSERT INTO public.question_correct_variants VALUES ('41511830-aa6f-4a1b-9298-3fe787282cd0', 'ff3e5097-4a3b-4875-824b-3cbc9f618828');
INSERT INTO public.question_correct_variants VALUES ('f6a98297-b6f6-4129-82f8-574e3aaaadaa', 'dac667c8-19f7-4787-a09b-51a2e477b15a');

INSERT INTO public.question_incorrect_variants VALUES ('87e73a43-4d2e-468c-a34e-70b1ae8abc95', 'cf8ccae2-303c-4cf7-ac56-c51510b9127b');
INSERT INTO public.question_incorrect_variants VALUES ('87e73a43-4d2e-468c-a34e-70b1ae8abc95', 'afd8b442-f499-4a4d-9c2c-b0e5375fe9f5');
INSERT INTO public.question_incorrect_variants VALUES ('87e73a43-4d2e-468c-a34e-70b1ae8abc95', '6a814cc1-cb72-4fe5-9c25-26768a32f635');
INSERT INTO public.question_incorrect_variants VALUES ('00404ac7-6040-4854-930c-7d8304fff403', '4771d6c5-9d2b-43ec-ab20-a5b20a47d8e5');
INSERT INTO public.question_incorrect_variants VALUES ('00404ac7-6040-4854-930c-7d8304fff403', 'f9dd3aca-9639-4a97-9ac5-d22c8747445a');
INSERT INTO public.question_incorrect_variants VALUES ('00404ac7-6040-4854-930c-7d8304fff403', '392b5cd8-eb42-4f12-a883-9f826597fd20');
INSERT INTO public.question_incorrect_variants VALUES ('35e90754-ed8e-4407-a1ce-6f4502dc1f87', '6d6651be-3e5d-4e7c-a04d-98b0b703b6a4');
INSERT INTO public.question_incorrect_variants VALUES ('35e90754-ed8e-4407-a1ce-6f4502dc1f87', 'dd9b5939-0a28-4e04-80fa-0dd22c9e8ebf');
INSERT INTO public.question_incorrect_variants VALUES ('35e90754-ed8e-4407-a1ce-6f4502dc1f87', '287c7a40-94de-41fe-a1f1-5387fea14e97');
INSERT INTO public.question_incorrect_variants VALUES ('7923a6b9-1b82-4a21-bcd5-9a0c71429922', '09637434-79e9-429b-adca-58b6547dd7ad');
INSERT INTO public.question_incorrect_variants VALUES ('59ee4130-f6f0-4160-9a59-def1120436d5', 'a10163bb-ce0d-414f-a7d7-9b07c9799fc9');
INSERT INTO public.question_incorrect_variants VALUES ('59ee4130-f6f0-4160-9a59-def1120436d5', 'a1088586-9fc5-4325-9602-42c3dc4108cb');
INSERT INTO public.question_incorrect_variants VALUES ('fcf76fd3-ee41-41aa-b732-284d08ff0873', '36357506-e945-4f6e-8d1e-3b3a6bb7595d');
INSERT INTO public.question_incorrect_variants VALUES ('fcf76fd3-ee41-41aa-b732-284d08ff0873', '5a2b8905-bb7a-489f-add3-d7f38daee611');
INSERT INTO public.question_incorrect_variants VALUES ('41511830-aa6f-4a1b-9298-3fe787282cd0', '2b33a3c5-05c0-4fe4-90f1-a1d0b2d6e321');
INSERT INTO public.question_incorrect_variants VALUES ('41511830-aa6f-4a1b-9298-3fe787282cd0', 'e49060f6-7010-4eb2-9b88-ab33f8bfab80');
INSERT INTO public.question_incorrect_variants VALUES ('41511830-aa6f-4a1b-9298-3fe787282cd0', '7278e20d-b3ab-4836-832e-64bed5c4a54a');
INSERT INTO public.question_incorrect_variants VALUES ('f6a98297-b6f6-4129-82f8-574e3aaaadaa', '56dbf0fa-ce64-4b30-83a9-3cfa25a4d763');
INSERT INTO public.question_incorrect_variants VALUES ('f6a98297-b6f6-4129-82f8-574e3aaaadaa', 'c1943206-d5d2-47ee-b6f9-5ce9394490aa');
INSERT INTO public.question_incorrect_variants VALUES ('f6a98297-b6f6-4129-82f8-574e3aaaadaa', '0d5729fb-009e-4456-9674-43c3b1b39a11');
INSERT INTO public.question_placeholder_definitions VALUES ('87e73a43-4d2e-468c-a34e-70b1ae8abc95', 'P_1', '{"type":"i32_random_one_of","options":[25,55,95]}');
INSERT INTO public.question_placeholder_definitions VALUES ('00404ac7-6040-4854-930c-7d8304fff403', 'P_1', '{"type":"i32_random_one_of","options":[10,20,30,50]}');
INSERT INTO public.question_placeholder_definitions VALUES ('35e90754-ed8e-4407-a1ce-6f4502dc1f87', 'P_2', '{"type":"i32_range","start":8,"end":12}');
INSERT INTO public.question_placeholder_definitions VALUES ('35e90754-ed8e-4407-a1ce-6f4502dc1f87', 'P_1', '{"type":"i32_range","start":2,"end":5}');
INSERT INTO public.question_placeholder_definitions VALUES ('35e90754-ed8e-4407-a1ce-6f4502dc1f87', 'P_4', '{"type":"str_random_one_of","options":["ijklmnop","asdfghjk"]}');
INSERT INTO public.question_placeholder_definitions VALUES ('35e90754-ed8e-4407-a1ce-6f4502dc1f87', 'P_3', '{"type":"str_random_one_of","options":["abcdefgh","qwertyui"]}');
INSERT INTO public.question_placeholder_definitions VALUES ('7923a6b9-1b82-4a21-bcd5-9a0c71429922', 'P_2', '{"type":"i32_random_one_of","options":[1,2]}');
INSERT INTO public.question_placeholder_definitions VALUES ('7923a6b9-1b82-4a21-bcd5-9a0c71429922', 'P_1', '{"type":"str_random_one_of","options":["A","B"]}');
INSERT INTO public.question_placeholder_definitions VALUES ('59ee4130-f6f0-4160-9a59-def1120436d5', 'P_2', '{"type":"i32_random_one_of","options":[10,5,3]}');
INSERT INTO public.question_placeholder_definitions VALUES ('59ee4130-f6f0-4160-9a59-def1120436d5', 'P_1', '{"type":"i32_random_one_of","options":[12,15,7]}');
INSERT INTO public.question_placeholder_definitions VALUES ('fcf76fd3-ee41-41aa-b732-284d08ff0873', 'P_2', '{"type":"i32_random_one_of","options":[3,4,5,6]}');
INSERT INTO public.question_placeholder_definitions VALUES ('fcf76fd3-ee41-41aa-b732-284d08ff0873', 'P_1', '{"type":"i32_random_one_of","options":[2,3]}');
INSERT INTO public.question_placeholder_definitions VALUES ('fcf76fd3-ee41-41aa-b732-284d08ff0873', 'P_3', '{"type":"i32_range","start":10,"end":50}');
INSERT INTO public.question_placeholder_definitions VALUES ('41511830-aa6f-4a1b-9298-3fe787282cd0', 'P_2', '{"type":"i32_random_one_of","options":[5,20]}');
INSERT INTO public.question_placeholder_definitions VALUES ('41511830-aa6f-4a1b-9298-3fe787282cd0', 'P_1', '{"type":"str_random_one_of","options":["area","perimeter"]}');
INSERT INTO public.question_placeholder_definitions VALUES ('41511830-aa6f-4a1b-9298-3fe787282cd0', 'P_3', '{"type":"str_random_one_of","options":["square","circle"]}');
INSERT INTO public.question_placeholder_definitions VALUES ('f6a98297-b6f6-4129-82f8-574e3aaaadaa', 'P_2', '{"type":"i32_random_one_of","options":[100,220,470]}');
INSERT INTO public.question_placeholder_definitions VALUES ('f6a98297-b6f6-4129-82f8-574e3aaaadaa', 'P_1', '{"type":"i32_random_one_of","options":[5,12,24]}');
INSERT INTO public.question_placeholder_definitions VALUES ('f6a98297-b6f6-4129-82f8-574e3aaaadaa', 'P_3', '{"type":"str_random_one_of","options":["current in Amps","power in Watts"]}');
