CREATE TABLE public.answer
(
    task_id     bigint NOT NULL,
    id          uuid   NOT NULL,
    question_id uuid   NOT NULL,
    answer      text   NOT NULL
);

CREATE TABLE public.codes
(
    id          uuid                   NOT NULL,
    code        character varying(255) NOT NULL,
    output_type character varying(255) NOT NULL
);

CREATE TABLE public.immutable_test_models
(
    shuffle_answers   boolean                     NOT NULL,
    shuffle_questions boolean                     NOT NULL,
    created_at        timestamp(6) with time zone NOT NULL,
    expires_after     timestamp(6) with time zone,
    creator_id        uuid,
    id                uuid                        NOT NULL,
    name              character varying(255)      NOT NULL,
    status            character varying(255)      NOT NULL,
    CONSTRAINT immutable_test_models_status_check CHECK (((status)::text = ANY
                                                          ((ARRAY ['ACTIVE'::character varying, 'ARCHIVED'::character varying])::text[])))
);

CREATE TABLE public.immutable_test_models_user_tests
(
    immutable_test_entity_id uuid NOT NULL,
    user_tests_id            uuid NOT NULL
);



CREATE TABLE public.immutable_test_questions
(
    immutable_test_id uuid NOT NULL,
    question_id       uuid NOT NULL
);



CREATE TABLE public.question_additional_check
(
    code_id     uuid,
    question_id uuid NOT NULL
);



CREATE TABLE public.question_call_args
(
    question_id       uuid NOT NULL,
    placeholder_label character varying(255)
);



CREATE TABLE public.question_correct_variants
(
    question_id uuid NOT NULL,
    variant_id  uuid NOT NULL
);



CREATE TABLE public.question_incorrect_variants
(
    question_id uuid NOT NULL,
    variant_id  uuid NOT NULL
);



CREATE TABLE public.question_metadata
(
    id               uuid NOT NULL,
    question_id      uuid NOT NULL,
    test_metadata_id uuid NOT NULL,
    format_and_code  text NOT NULL,
    text             text NOT NULL
);



CREATE TABLE public.question_metadata_correct_answers
(
    answer_id            uuid NOT NULL,
    question_metadata_id uuid NOT NULL
);



CREATE TABLE public.question_metadata_incorrect_answers
(
    answer_id            uuid NOT NULL,
    question_metadata_id uuid NOT NULL
);



CREATE TABLE public.question_placeholder_definitions
(
    question_id       uuid                   NOT NULL,
    placeholder_key   character varying(255) NOT NULL,
    placeholder_value character varying(255)
);



CREATE TABLE public.questions
(
    is_public       boolean                     NOT NULL,
    is_validated    boolean                     NOT NULL,
    created_at      timestamp(6) with time zone NOT NULL,
    creator_id      uuid,
    id              uuid                        NOT NULL,
    body            character varying(255)      NOT NULL,
    format_and_code character varying(255)      NOT NULL,
    lang            character varying(255)      NOT NULL
);



CREATE TABLE public.stabs
(
    id bigint NOT NULL
);



CREATE SEQUENCE public.stabs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE public.stabs_id_seq OWNED BY public.stabs.id;



CREATE TABLE public.test_metadata
(
    id                uuid                   NOT NULL,
    immutable_test_id uuid                   NOT NULL,
    name              character varying(255) NOT NULL
);



CREATE TABLE public.test_models
(
    created_at timestamp(6) with time zone NOT NULL,
    creator_id uuid,
    id         uuid                        NOT NULL,
    name       character varying(255)      NOT NULL
);



CREATE TABLE public.test_models_questions
(
    question_id   uuid NOT NULL,
    test_model_id uuid NOT NULL
);



CREATE TABLE public.user_question_answer
(
    id                   uuid NOT NULL,
    question_metadata_id uuid NOT NULL
);



CREATE TABLE public.user_question_answer_mapping
(
    answer_id               uuid NOT NULL,
    user_question_answer_id uuid NOT NULL
);



CREATE TABLE public.user_test_question_answers_mapping
(
    user_question_answer_id uuid NOT NULL,
    user_test_id            uuid NOT NULL
);



CREATE TABLE public.user_tests
(
    score             double precision,
    completed_at      timestamp(6) with time zone,
    started_at        timestamp(6) with time zone,
    id                uuid                   NOT NULL,
    immutable_test_id uuid                   NOT NULL,
    test_metadata_id  uuid                   NOT NULL,
    user_id           uuid                   NOT NULL,
    status            character varying(255) NOT NULL,
    CONSTRAINT user_tests_status_check CHECK (((status)::text = ANY
                                               ((ARRAY ['NOT_STARTED'::character varying, 'IN_PROGRESS'::character varying, 'COMPLETED'::character varying, 'ABANDONED'::character varying, 'EXPIRED'::character varying, 'CANCELLED'::character varying])::text[])))
);



CREATE TABLE public.users
(
    anonymous boolean                NOT NULL,
    id        uuid                   NOT NULL,
    password  character varying(255) NOT NULL,
    role      character varying(255),
    username  character varying(255) NOT NULL,
    email     character varying(255),
    CONSTRAINT users_role_check CHECK (((role)::text = ANY
                                        ((ARRAY ['Admin'::character varying, 'Teacher'::character varying, 'Student'::character varying])::text[])))
);



CREATE TABLE public.variants
(
    public     boolean                     NOT NULL,
    created_at timestamp(6) with time zone NOT NULL,
    code_id    uuid,
    created_by uuid,
    id         uuid                        NOT NULL
);



ALTER TABLE ONLY public.stabs
    ALTER COLUMN id SET DEFAULT nextval('public.stabs_id_seq'::regclass);



ALTER TABLE ONLY public.answer
    ADD CONSTRAINT answer_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public.codes
    ADD CONSTRAINT codes_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public.immutable_test_models
    ADD CONSTRAINT immutable_test_models_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public.immutable_test_questions
    ADD CONSTRAINT immutable_test_questions_question_id_key UNIQUE (question_id);



ALTER TABLE ONLY public.question_additional_check
    ADD CONSTRAINT question_additional_check_code_id_key UNIQUE (code_id);



ALTER TABLE ONLY public.question_additional_check
    ADD CONSTRAINT question_additional_check_pkey PRIMARY KEY (question_id);



ALTER TABLE ONLY public.question_correct_variants
    ADD CONSTRAINT question_correct_variants_variant_id_key UNIQUE (variant_id);



ALTER TABLE ONLY public.question_incorrect_variants
    ADD CONSTRAINT question_incorrect_variants_variant_id_key UNIQUE (variant_id);



ALTER TABLE ONLY public.question_metadata_correct_answers
    ADD CONSTRAINT question_metadata_correct_answers_answer_id_key UNIQUE (answer_id);



ALTER TABLE ONLY public.question_metadata_incorrect_answers
    ADD CONSTRAINT question_metadata_incorrect_answers_answer_id_key UNIQUE (answer_id);



ALTER TABLE ONLY public.question_metadata
    ADD CONSTRAINT question_metadata_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public.question_placeholder_definitions
    ADD CONSTRAINT question_placeholder_definitions_pkey PRIMARY KEY (question_id, placeholder_key);



ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public.stabs
    ADD CONSTRAINT stabs_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public.test_metadata
    ADD CONSTRAINT test_metadata_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public.test_models
    ADD CONSTRAINT test_models_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public.immutable_test_models_user_tests
    ADD CONSTRAINT uk_jht9s4fjd3a1lhfuwsvduvkeo UNIQUE (user_tests_id);



ALTER TABLE ONLY public.user_question_answer
    ADD CONSTRAINT user_question_answer_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public.user_test_question_answers_mapping
    ADD CONSTRAINT user_test_question_answers_mapping_user_question_answer_id_key UNIQUE (user_question_answer_id);



ALTER TABLE ONLY public.user_tests
    ADD CONSTRAINT user_tests_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public.user_tests
    ADD CONSTRAINT user_tests_test_metadata_id_key UNIQUE (test_metadata_id);



ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);



ALTER TABLE ONLY public.variants
    ADD CONSTRAINT variants_code_id_key UNIQUE (code_id);



ALTER TABLE ONLY public.variants
    ADD CONSTRAINT variants_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public.user_question_answer_mapping
    ADD CONSTRAINT fk1qis8goeutv99jddp40f12gyi FOREIGN KEY (answer_id) REFERENCES public.answer (id);



ALTER TABLE ONLY public.question_correct_variants
    ADD CONSTRAINT fk2aefwahlbrfqbn2xnsqs7s5ru FOREIGN KEY (question_id) REFERENCES public.questions (id);



ALTER TABLE ONLY public.question_correct_variants
    ADD CONSTRAINT fk3gls3g4d702t5w8sddd1a374p FOREIGN KEY (variant_id) REFERENCES public.variants (id);



ALTER TABLE ONLY public.questions
    ADD CONSTRAINT fk3iss7rwyj4owl79g8srmcrut FOREIGN KEY (creator_id) REFERENCES public.users (id) ON DELETE SET NULL;



ALTER TABLE ONLY public.user_test_question_answers_mapping
    ADD CONSTRAINT fk4bn66mv4w8059kiq5g9w1t53y FOREIGN KEY (user_test_id) REFERENCES public.user_tests (id);



ALTER TABLE ONLY public.question_metadata
    ADD CONSTRAINT fk6p44sla8f4njn83p8047ukcu0 FOREIGN KEY (test_metadata_id) REFERENCES public.test_metadata (id);



ALTER TABLE ONLY public.test_models
    ADD CONSTRAINT fk6qs1m0lgdbssude74wwt9a8a9 FOREIGN KEY (creator_id) REFERENCES public.users (id) ON DELETE SET NULL;



ALTER TABLE ONLY public.answer
    ADD CONSTRAINT fk7mluqeoggakn10mca9veouh1p FOREIGN KEY (question_id) REFERENCES public.questions (id);



ALTER TABLE ONLY public.user_tests
    ADD CONSTRAINT fk8367uok0k1ufu7ajdd2g9umr6 FOREIGN KEY (test_metadata_id) REFERENCES public.test_metadata (id);



ALTER TABLE ONLY public.user_tests
    ADD CONSTRAINT fk8e9rp1n7lsc6lnagryltqpbjb FOREIGN KEY (user_id) REFERENCES public.users (id);



ALTER TABLE ONLY public.immutable_test_questions
    ADD CONSTRAINT fk93gmlemvo2fpvp1rejjb7hyvk FOREIGN KEY (immutable_test_id) REFERENCES public.immutable_test_models (id);



ALTER TABLE ONLY public.question_incorrect_variants
    ADD CONSTRAINT fk9ufpepi9coty9c0ey1fvqqpe3 FOREIGN KEY (question_id) REFERENCES public.questions (id);



ALTER TABLE ONLY public.immutable_test_models
    ADD CONSTRAINT fka50y35p81f3kvdh32epjsu5vx FOREIGN KEY (creator_id) REFERENCES public.users (id) ON DELETE SET NULL;



ALTER TABLE ONLY public.user_test_question_answers_mapping
    ADD CONSTRAINT fkbigufrl4gutl79bxog7bg8nu FOREIGN KEY (user_question_answer_id) REFERENCES public.user_question_answer (id);



ALTER TABLE ONLY public.user_question_answer_mapping
    ADD CONSTRAINT fkco6xjc86ihd1adysl2qge640o FOREIGN KEY (user_question_answer_id) REFERENCES public.user_question_answer (id);



ALTER TABLE ONLY public.question_metadata
    ADD CONSTRAINT fkdfxq9wcybd9j19bwvk9o9g6m FOREIGN KEY (question_id) REFERENCES public.questions (id);



ALTER TABLE ONLY public.test_metadata
    ADD CONSTRAINT fkdnrl69hfb7hruvnhxg7ht78jy FOREIGN KEY (immutable_test_id) REFERENCES public.immutable_test_models (id);



ALTER TABLE ONLY public.question_incorrect_variants
    ADD CONSTRAINT fke57um3w1mcy2krc6j5omnq5p FOREIGN KEY (variant_id) REFERENCES public.variants (id);



ALTER TABLE ONLY public.question_call_args
    ADD CONSTRAINT fkefueg5r8eex5la5wsff1qj59s FOREIGN KEY (question_id) REFERENCES public.questions (id);



ALTER TABLE ONLY public.question_additional_check
    ADD CONSTRAINT fkgjmsg445warxguiypbqcy1yrt FOREIGN KEY (question_id) REFERENCES public.questions (id);



ALTER TABLE ONLY public.test_models_questions
    ADD CONSTRAINT fki49b52m2kjmhk209l1h2cyesg FOREIGN KEY (test_model_id) REFERENCES public.test_models (id);



ALTER TABLE ONLY public.user_tests
    ADD CONSTRAINT fkibmcq1x8evrsro19s987e23gr FOREIGN KEY (immutable_test_id) REFERENCES public.immutable_test_models (id);



ALTER TABLE ONLY public.question_metadata_incorrect_answers
    ADD CONSTRAINT fkj7e20n34qvmu1fy7ho7crjk1h FOREIGN KEY (answer_id) REFERENCES public.answer (id);



ALTER TABLE ONLY public.question_additional_check
    ADD CONSTRAINT fkl01vm8fgb7f6htbd8cgbutga FOREIGN KEY (code_id) REFERENCES public.codes (id);



ALTER TABLE ONLY public.variants
    ADD CONSTRAINT fkl6ppfosu3i51q7yx3cog0kwvl FOREIGN KEY (code_id) REFERENCES public.codes (id);



ALTER TABLE ONLY public.question_metadata_correct_answers
    ADD CONSTRAINT fklne3ynpef3yb07gm7e31hak7d FOREIGN KEY (answer_id) REFERENCES public.answer (id);



ALTER TABLE ONLY public.test_models_questions
    ADD CONSTRAINT fkmc4p8snqa5tlqic1431x0dige FOREIGN KEY (question_id) REFERENCES public.questions (id) ON DELETE CASCADE;



ALTER TABLE ONLY public.user_question_answer
    ADD CONSTRAINT fknv1yhs04cecosp8pln07etf11 FOREIGN KEY (question_metadata_id) REFERENCES public.question_metadata (id);



ALTER TABLE ONLY public.question_metadata_incorrect_answers
    ADD CONSTRAINT fko8enj4vhp2xw5m9cnsv57c47g FOREIGN KEY (question_metadata_id) REFERENCES public.question_metadata (id);



ALTER TABLE ONLY public.variants
    ADD CONSTRAINT fkp6kmb83364melpfdty81rhuw7 FOREIGN KEY (created_by) REFERENCES public.users (id);



ALTER TABLE ONLY public.question_metadata_correct_answers
    ADD CONSTRAINT fkqrukw3uofvbcysbk1u89rwxx2 FOREIGN KEY (question_metadata_id) REFERENCES public.question_metadata (id);



ALTER TABLE ONLY public.immutable_test_questions
    ADD CONSTRAINT fkr47py64pe93lwu4b2frl6h13r FOREIGN KEY (question_id) REFERENCES public.questions (id);



ALTER TABLE ONLY public.question_placeholder_definitions
    ADD CONSTRAINT fkt1lmbyuxecb00hhq647afre4k FOREIGN KEY (question_id) REFERENCES public.questions (id);