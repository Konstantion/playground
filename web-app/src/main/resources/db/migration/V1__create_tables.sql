CREATE TABLE public.answer
(
    task_id     bigint NOT NULL,
    id          uuid   NOT NULL,
    question_id uuid   NOT NULL,
    variant_id  uuid   NOT NULL,
    answer      text   NOT NULL
);

CREATE TABLE public.codes
(
    id          uuid                 NOT NULL,
    code        character varying(5000) NOT NULL,
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
    question_id       uuid                 NOT NULL,
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
    format_and_code character varying(5000)      NOT NULL,
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
    id                uuid                 NOT NULL,
    immutable_test_id uuid                 NOT NULL,
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
    answer_id                 uuid NOT NULL,
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
    id                uuid                 NOT NULL,
    immutable_test_id uuid                 NOT NULL,
    test_metadata_id  uuid                 NOT NULL,
    user_id           uuid                 NOT NULL,
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
ALTER TABLE ONLY public.question_additional_check
    ADD CONSTRAINT question_additional_check_pkey PRIMARY KEY (question_id);
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
ALTER TABLE ONLY public.user_question_answer
    ADD CONSTRAINT user_question_answer_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.user_tests
    ADD CONSTRAINT user_tests_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.variants
    ADD CONSTRAINT variants_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.immutable_test_questions
    ADD CONSTRAINT immutable_test_questions_question_id_key UNIQUE (question_id);
ALTER TABLE ONLY public.question_additional_check
    ADD CONSTRAINT question_additional_check_code_id_key UNIQUE (code_id);
ALTER TABLE ONLY public.question_correct_variants
    ADD CONSTRAINT question_correct_variants_variant_id_key UNIQUE (variant_id);
ALTER TABLE ONLY public.question_incorrect_variants
    ADD CONSTRAINT question_incorrect_variants_variant_id_key UNIQUE (variant_id);
ALTER TABLE ONLY public.question_metadata_correct_answers
    ADD CONSTRAINT question_metadata_correct_answers_answer_id_key UNIQUE (answer_id);
ALTER TABLE ONLY public.question_metadata_incorrect_answers
    ADD CONSTRAINT question_metadata_incorrect_answers_answer_id_key UNIQUE (answer_id);
ALTER TABLE ONLY public.immutable_test_models_user_tests
    ADD CONSTRAINT uk_jht9s4fjd3a1lhfuwsvduvkeo UNIQUE (user_tests_id);
ALTER TABLE ONLY public.user_test_question_answers_mapping
    ADD CONSTRAINT user_test_question_answers_mapping_user_question_answer_id_key UNIQUE (user_question_answer_id);
ALTER TABLE ONLY public.user_tests
    ADD CONSTRAINT user_tests_test_metadata_id_key UNIQUE (test_metadata_id);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);
ALTER TABLE ONLY public.variants
    ADD CONSTRAINT variants_code_id_key UNIQUE (code_id);

ALTER TABLE ONLY public.user_question_answer_mapping
    ADD CONSTRAINT fk_usr_qn_ans_map_ans_id FOREIGN KEY (answer_id) REFERENCES public.answer (id) ON DELETE CASCADE;

ALTER TABLE ONLY public.question_correct_variants
    ADD CONSTRAINT fk_qn_corr_var_qn_id FOREIGN KEY (question_id) REFERENCES public.questions (id) ON DELETE CASCADE;

ALTER TABLE ONLY public.question_correct_variants
    ADD CONSTRAINT fk_qn_corr_var_var_id FOREIGN KEY (variant_id) REFERENCES public.variants (id) ON DELETE CASCADE;

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT fk_qn_usrs_creator_id FOREIGN KEY (creator_id) REFERENCES public.users (id) ON DELETE SET NULL;

ALTER TABLE ONLY public.user_test_question_answers_mapping
    ADD CONSTRAINT fk_usr_test_qn_ans_map_usr_tests_id FOREIGN KEY (user_test_id) REFERENCES public.user_tests (id) ON DELETE CASCADE;

ALTER TABLE ONLY public.question_metadata
    ADD CONSTRAINT fk_qn_meta_test_meta_id FOREIGN KEY (test_metadata_id) REFERENCES public.test_metadata (id) ON DELETE CASCADE;

ALTER TABLE ONLY public.test_models
    ADD CONSTRAINT fk_test_mdl_usrs_creator_id FOREIGN KEY (creator_id) REFERENCES public.users (id) ON DELETE SET NULL;

ALTER TABLE ONLY public.answer
    ADD CONSTRAINT fk_ans_qn_id FOREIGN KEY (question_id) REFERENCES public.questions (id) ON DELETE CASCADE;

ALTER TABLE ONLY public.answer
    ADD CONSTRAINT fk_ans_var_id FOREIGN KEY (variant_id) REFERENCES public.variants (id) ON DELETE CASCADE;

ALTER TABLE ONLY public.user_tests
    ADD CONSTRAINT fk_usr_tests_test_meta_id FOREIGN KEY (test_metadata_id) REFERENCES public.test_metadata (id) ON DELETE CASCADE;

ALTER TABLE ONLY public.user_tests
    ADD CONSTRAINT fk_usr_tests_usrs_id FOREIGN KEY (user_id) REFERENCES public.users (id) ON DELETE CASCADE;

ALTER TABLE ONLY public.immutable_test_questions
    ADD CONSTRAINT fk_imm_test_qn_imm_test_mdl_id FOREIGN KEY (immutable_test_id) REFERENCES public.immutable_test_models (id) ON DELETE CASCADE;

ALTER TABLE ONLY public.question_incorrect_variants
    ADD CONSTRAINT fk_qn_incorr_var_qn_id FOREIGN KEY (question_id) REFERENCES public.questions (id) ON DELETE CASCADE;

ALTER TABLE ONLY public.immutable_test_models
    ADD CONSTRAINT fk_imm_test_mdl_usrs_creator_id FOREIGN KEY (creator_id) REFERENCES public.users (id) ON DELETE SET NULL;

ALTER TABLE ONLY public.user_test_question_answers_mapping
    ADD CONSTRAINT fk_usr_test_qn_ans_map_usr_qn_ans_id FOREIGN KEY (user_question_answer_id) REFERENCES public.user_question_answer (id) ON DELETE CASCADE;

ALTER TABLE ONLY public.user_question_answer_mapping
    ADD CONSTRAINT fk_usr_qn_ans_map_usr_qn_ans_id FOREIGN KEY (user_question_answer_id) REFERENCES public.user_question_answer (id) ON DELETE CASCADE;

ALTER TABLE ONLY public.question_metadata
    ADD CONSTRAINT fk_qn_meta_qn_id FOREIGN KEY (question_id) REFERENCES public.questions (id) ON DELETE CASCADE;

ALTER TABLE ONLY public.test_metadata
    ADD CONSTRAINT fk_test_meta_imm_test_mdl_id FOREIGN KEY (immutable_test_id) REFERENCES public.immutable_test_models (id) ON DELETE CASCADE;

ALTER TABLE ONLY public.question_incorrect_variants
    ADD CONSTRAINT fk_qn_incorr_var_var_id FOREIGN KEY (variant_id) REFERENCES public.variants (id) ON DELETE CASCADE;

ALTER TABLE ONLY public.question_call_args
    ADD CONSTRAINT fk_qn_call_args_qn_id FOREIGN KEY (question_id) REFERENCES public.questions (id) ON DELETE CASCADE;

ALTER TABLE ONLY public.question_additional_check
    ADD CONSTRAINT fk_qn_add_chk_qn_id FOREIGN KEY (question_id) REFERENCES public.questions (id) ON DELETE CASCADE;

ALTER TABLE ONLY public.test_models_questions
    ADD CONSTRAINT fk_test_mdl_qn_test_mdl_id FOREIGN KEY (test_model_id) REFERENCES public.test_models (id) ON DELETE CASCADE;

ALTER TABLE ONLY public.user_tests
    ADD CONSTRAINT fk_usr_tests_imm_test_mdl_id FOREIGN KEY (immutable_test_id) REFERENCES public.immutable_test_models (id) ON DELETE CASCADE;

ALTER TABLE ONLY public.question_metadata_incorrect_answers
    ADD CONSTRAINT fk_qn_meta_incorr_ans_ans_id FOREIGN KEY (answer_id) REFERENCES public.answer (id) ON DELETE CASCADE;

ALTER TABLE ONLY public.question_additional_check
    ADD CONSTRAINT fk_qn_add_chk_codes_id FOREIGN KEY (code_id) REFERENCES public.codes (id) ON DELETE SET NULL;

ALTER TABLE ONLY public.variants
    ADD CONSTRAINT fk_var_codes_id FOREIGN KEY (code_id) REFERENCES public.codes (id) ON DELETE SET NULL;

ALTER TABLE ONLY public.question_metadata_correct_answers
    ADD CONSTRAINT fk_qn_meta_corr_ans_ans_id FOREIGN KEY (answer_id) REFERENCES public.answer (id) ON DELETE CASCADE;

ALTER TABLE ONLY public.test_models_questions
    ADD CONSTRAINT fk_test_mdl_qn_qn_id FOREIGN KEY (question_id) REFERENCES public.questions (id) ON DELETE CASCADE;

ALTER TABLE ONLY public.user_question_answer
    ADD CONSTRAINT fk_usr_qn_ans_qn_meta_id FOREIGN KEY (question_metadata_id) REFERENCES public.question_metadata (id) ON DELETE CASCADE;

ALTER TABLE ONLY public.question_metadata_incorrect_answers
    ADD CONSTRAINT fk_qn_meta_incorr_ans_qn_meta_id FOREIGN KEY (question_metadata_id) REFERENCES public.question_metadata (id) ON DELETE CASCADE;

ALTER TABLE ONLY public.variants
    ADD CONSTRAINT fk_var_usrs_created_by FOREIGN KEY (created_by) REFERENCES public.users (id) ON DELETE SET NULL;

ALTER TABLE ONLY public.question_metadata_correct_answers
    ADD CONSTRAINT fk_qn_meta_corr_ans_qn_meta_id FOREIGN KEY (question_metadata_id) REFERENCES public.question_metadata (id) ON DELETE CASCADE;

ALTER TABLE ONLY public.immutable_test_questions
    ADD CONSTRAINT fk_imm_test_qn_qn_id FOREIGN KEY (question_id) REFERENCES public.questions (id) ON DELETE CASCADE;

ALTER TABLE ONLY public.question_placeholder_definitions
    ADD CONSTRAINT fk_qn_ph_defs_qn_id FOREIGN KEY (question_id) REFERENCES public.questions (id) ON DELETE CASCADE;

ALTER TABLE ONLY public.immutable_test_models_user_tests
    ADD CONSTRAINT fk_imm_test_mdl_usr_tests_imm_test_ent_id FOREIGN KEY (immutable_test_entity_id) REFERENCES public.immutable_test_models (id) ON DELETE CASCADE;

ALTER TABLE ONLY public.immutable_test_models_user_tests
    ADD CONSTRAINT fk_imm_test_mdl_usr_tests_usr_tests_id FOREIGN KEY (user_tests_id) REFERENCES public.user_tests (id) ON DELETE CASCADE;
