--
-- PostgreSQL database dump
--

-- Dumped from database version 15.3 (Debian 15.3-1.pgdg120+1)
-- Dumped by pg_dump version 15.3 (Debian 15.3-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: myschema; Type: SCHEMA; Schema: -; Owner: myuser
--

CREATE SCHEMA myschema;


ALTER SCHEMA myschema OWNER TO myuser;

--
-- Name: MODE; Type: TYPE; Schema: myschema; Owner: myuser
--

CREATE TYPE myschema."MODE" AS ENUM (
    'classic',
    'AI',
    'Friends'
);


ALTER TYPE myschema."MODE" OWNER TO myuser;

--
-- Name: Role; Type: TYPE; Schema: myschema; Owner: myuser
--

CREATE TYPE myschema."Role" AS ENUM (
    'USER',
    'ADMIN'
);


ALTER TYPE myschema."Role" OWNER TO myuser;

--
-- Name: notificationType; Type: TYPE; Schema: myschema; Owner: myuser
--

CREATE TYPE myschema."notificationType" AS ENUM (
    'Accepted_request',
    'game_invitation',
    'Achievement',
    'GroupInvitation'
);


ALTER TYPE myschema."notificationType" OWNER TO myuser;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Friendship; Type: TABLE; Schema: myschema; Owner: myuser
--

CREATE TABLE myschema."Friendship" (
    "FriendshipId" integer NOT NULL,
    "SenderId" text NOT NULL,
    "ReceiverId" text NOT NULL,
    "CreationTime" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "Accepted" boolean DEFAULT false NOT NULL,
    "blockedByReceiver" boolean DEFAULT false NOT NULL,
    "blockedBySender" boolean DEFAULT false NOT NULL
);


ALTER TABLE myschema."Friendship" OWNER TO myuser;

--
-- Name: Friendship_FriendshipId_seq; Type: SEQUENCE; Schema: myschema; Owner: myuser
--

CREATE SEQUENCE myschema."Friendship_FriendshipId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE myschema."Friendship_FriendshipId_seq" OWNER TO myuser;

--
-- Name: Friendship_FriendshipId_seq; Type: SEQUENCE OWNED BY; Schema: myschema; Owner: myuser
--

ALTER SEQUENCE myschema."Friendship_FriendshipId_seq" OWNED BY myschema."Friendship"."FriendshipId";


--
-- Name: Game; Type: TABLE; Schema: myschema; Owner: myuser
--

CREATE TABLE myschema."Game" (
    "GameId" integer NOT NULL,
    "PlayerId1" text NOT NULL,
    "PlayerId2" text NOT NULL,
    "isDraw" boolean DEFAULT false NOT NULL,
    "Rounds" integer NOT NULL,
    "Mode" myschema."MODE" NOT NULL,
    "CreationTime" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "WinnerId" text,
    "WinnerXP" integer,
    "looserXP" integer
);


ALTER TABLE myschema."Game" OWNER TO myuser;

--
-- Name: Game_GameId_seq; Type: SEQUENCE; Schema: myschema; Owner: myuser
--

CREATE SEQUENCE myschema."Game_GameId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE myschema."Game_GameId_seq" OWNER TO myuser;

--
-- Name: Game_GameId_seq; Type: SEQUENCE OWNED BY; Schema: myschema; Owner: myuser
--

ALTER SEQUENCE myschema."Game_GameId_seq" OWNED BY myschema."Game"."GameId";


--
-- Name: Membership; Type: TABLE; Schema: myschema; Owner: myuser
--

CREATE TABLE myschema."Membership" (
    "GroupId" integer NOT NULL,
    "RoomId" integer NOT NULL,
    "UserId" text NOT NULL,
    "isBanned" boolean NOT NULL,
    "isMuted" boolean NOT NULL,
    "CreationTime" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "Role" myschema."Role" DEFAULT 'USER'::myschema."Role" NOT NULL
);


ALTER TABLE myschema."Membership" OWNER TO myuser;

--
-- Name: Membership_GroupId_seq; Type: SEQUENCE; Schema: myschema; Owner: myuser
--

CREATE SEQUENCE myschema."Membership_GroupId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE myschema."Membership_GroupId_seq" OWNER TO myuser;

--
-- Name: Membership_GroupId_seq; Type: SEQUENCE OWNED BY; Schema: myschema; Owner: myuser
--

ALTER SEQUENCE myschema."Membership_GroupId_seq" OWNED BY myschema."Membership"."GroupId";


--
-- Name: Message; Type: TABLE; Schema: myschema; Owner: myuser
--

CREATE TABLE myschema."Message" (
    "MessageId" integer NOT NULL,
    "RoomId" integer NOT NULL,
    "UserId" text NOT NULL,
    "Content" text NOT NULL,
    "SendTime" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE myschema."Message" OWNER TO myuser;

--
-- Name: Message_MessageId_seq; Type: SEQUENCE; Schema: myschema; Owner: myuser
--

CREATE SEQUENCE myschema."Message_MessageId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE myschema."Message_MessageId_seq" OWNER TO myuser;

--
-- Name: Message_MessageId_seq; Type: SEQUENCE OWNED BY; Schema: myschema; Owner: myuser
--

ALTER SEQUENCE myschema."Message_MessageId_seq" OWNED BY myschema."Message"."MessageId";


--
-- Name: Notification; Type: TABLE; Schema: myschema; Owner: myuser
--

CREATE TABLE myschema."Notification" (
    "NotificationId" integer NOT NULL,
    "CreationTime" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "isRead" boolean NOT NULL,
    "Type" myschema."notificationType" NOT NULL,
    "receiverId" text NOT NULL,
    "senderId" text NOT NULL
);


ALTER TABLE myschema."Notification" OWNER TO myuser;

--
-- Name: Notification_NotificationId_seq; Type: SEQUENCE; Schema: myschema; Owner: myuser
--

CREATE SEQUENCE myschema."Notification_NotificationId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE myschema."Notification_NotificationId_seq" OWNER TO myuser;

--
-- Name: Notification_NotificationId_seq; Type: SEQUENCE OWNED BY; Schema: myschema; Owner: myuser
--

ALTER SEQUENCE myschema."Notification_NotificationId_seq" OWNED BY myschema."Notification"."NotificationId";


--
-- Name: Room; Type: TABLE; Schema: myschema; Owner: myuser
--

CREATE TABLE myschema."Room" (
    "RoomId" integer NOT NULL,
    "RoomNAme" text NOT NULL,
    "CreationTime" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updateTime" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    ischannel boolean NOT NULL,
    "Password" text NOT NULL
);


ALTER TABLE myschema."Room" OWNER TO myuser;

--
-- Name: Room_RoomId_seq; Type: SEQUENCE; Schema: myschema; Owner: myuser
--

CREATE SEQUENCE myschema."Room_RoomId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE myschema."Room_RoomId_seq" OWNER TO myuser;

--
-- Name: Room_RoomId_seq; Type: SEQUENCE OWNED BY; Schema: myschema; Owner: myuser
--

ALTER SEQUENCE myschema."Room_RoomId_seq" OWNED BY myschema."Room"."RoomId";


--
-- Name: User; Type: TABLE; Schema: myschema; Owner: myuser
--

CREATE TABLE myschema."User" (
    "FA_On" boolean,
    "FAsecret" text,
    "FullName" text NOT NULL,
    "UserId" text NOT NULL,
    "XP" integer DEFAULT 0,
    avatar text NOT NULL,
    badge text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    username text NOT NULL,
    email text NOT NULL,
    level integer DEFAULT 0,
    status boolean DEFAULT true NOT NULL
);


ALTER TABLE myschema."User" OWNER TO myuser;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: myschema; Owner: myuser
--

CREATE TABLE myschema._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE myschema._prisma_migrations OWNER TO myuser;

--
-- Name: badges; Type: TABLE; Schema: myschema; Owner: myuser
--

CREATE TABLE myschema.badges (
    "badgesId" integer NOT NULL,
    "Bronze" boolean DEFAULT true NOT NULL,
    "Silver" boolean DEFAULT false NOT NULL,
    "Gold" boolean DEFAULT false NOT NULL,
    "Platinum" boolean DEFAULT false NOT NULL,
    "Diamond" boolean DEFAULT false NOT NULL,
    "Master" boolean DEFAULT false NOT NULL,
    "Grandmaster" boolean DEFAULT false NOT NULL,
    "Legend" boolean DEFAULT false NOT NULL,
    "Elite" boolean DEFAULT false NOT NULL,
    "Champion" boolean DEFAULT false NOT NULL,
    "UserId" text NOT NULL
);


ALTER TABLE myschema.badges OWNER TO myuser;

--
-- Name: badges_badgesId_seq; Type: SEQUENCE; Schema: myschema; Owner: myuser
--

CREATE SEQUENCE myschema."badges_badgesId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE myschema."badges_badgesId_seq" OWNER TO myuser;

--
-- Name: badges_badgesId_seq; Type: SEQUENCE OWNED BY; Schema: myschema; Owner: myuser
--

ALTER SEQUENCE myschema."badges_badgesId_seq" OWNED BY myschema.badges."badgesId";


--
-- Name: Friendship FriendshipId; Type: DEFAULT; Schema: myschema; Owner: myuser
--

ALTER TABLE ONLY myschema."Friendship" ALTER COLUMN "FriendshipId" SET DEFAULT nextval('myschema."Friendship_FriendshipId_seq"'::regclass);


--
-- Name: Game GameId; Type: DEFAULT; Schema: myschema; Owner: myuser
--

ALTER TABLE ONLY myschema."Game" ALTER COLUMN "GameId" SET DEFAULT nextval('myschema."Game_GameId_seq"'::regclass);


--
-- Name: Membership GroupId; Type: DEFAULT; Schema: myschema; Owner: myuser
--

ALTER TABLE ONLY myschema."Membership" ALTER COLUMN "GroupId" SET DEFAULT nextval('myschema."Membership_GroupId_seq"'::regclass);


--
-- Name: Message MessageId; Type: DEFAULT; Schema: myschema; Owner: myuser
--

ALTER TABLE ONLY myschema."Message" ALTER COLUMN "MessageId" SET DEFAULT nextval('myschema."Message_MessageId_seq"'::regclass);


--
-- Name: Notification NotificationId; Type: DEFAULT; Schema: myschema; Owner: myuser
--

ALTER TABLE ONLY myschema."Notification" ALTER COLUMN "NotificationId" SET DEFAULT nextval('myschema."Notification_NotificationId_seq"'::regclass);


--
-- Name: Room RoomId; Type: DEFAULT; Schema: myschema; Owner: myuser
--

ALTER TABLE ONLY myschema."Room" ALTER COLUMN "RoomId" SET DEFAULT nextval('myschema."Room_RoomId_seq"'::regclass);


--
-- Name: badges badgesId; Type: DEFAULT; Schema: myschema; Owner: myuser
--

ALTER TABLE ONLY myschema.badges ALTER COLUMN "badgesId" SET DEFAULT nextval('myschema."badges_badgesId_seq"'::regclass);


--
-- Data for Name: Friendship; Type: TABLE DATA; Schema: myschema; Owner: myuser
--

COPY myschema."Friendship" ("FriendshipId", "SenderId", "ReceiverId", "CreationTime", "Accepted", "blockedByReceiver", "blockedBySender") FROM stdin;
\.


--
-- Data for Name: Game; Type: TABLE DATA; Schema: myschema; Owner: myuser
--

COPY myschema."Game" ("GameId", "PlayerId1", "PlayerId2", "isDraw", "Rounds", "Mode", "CreationTime", "WinnerId", "WinnerXP", "looserXP") FROM stdin;
1	98879	94426	f	0	classic	2023-07-16 23:44:14.171	98879	\N	\N
2	99046	99045	f	0	classic	2023-07-16 23:45:25.843	99046	\N	\N
\.


--
-- Data for Name: Membership; Type: TABLE DATA; Schema: myschema; Owner: myuser
--

COPY myschema."Membership" ("GroupId", "RoomId", "UserId", "isBanned", "isMuted", "CreationTime", "Role") FROM stdin;
\.


--
-- Data for Name: Message; Type: TABLE DATA; Schema: myschema; Owner: myuser
--

COPY myschema."Message" ("MessageId", "RoomId", "UserId", "Content", "SendTime") FROM stdin;
\.


--
-- Data for Name: Notification; Type: TABLE DATA; Schema: myschema; Owner: myuser
--

COPY myschema."Notification" ("NotificationId", "CreationTime", "isRead", "Type", "receiverId", "senderId") FROM stdin;
\.


--
-- Data for Name: Room; Type: TABLE DATA; Schema: myschema; Owner: myuser
--

COPY myschema."Room" ("RoomId", "RoomNAme", "CreationTime", "updateTime", ischannel, "Password") FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: myschema; Owner: myuser
--

COPY myschema."User" ("FA_On", "FAsecret", "FullName", "UserId", "XP", avatar, badge, "createdAt", username, email, level, status) FROM stdin;
f	\N	Mostapha Moutawakil	99046	0	https://cdn.intra.42.fr/users/6f17239eaa4c09503310349bc50e6328/medium_mmoutawa.jpg	\N	2023-07-16 23:36:30.826	trma7a	mmoutawa@student.1337.ma	0	t
f	\N	Chaimaa El Mhandez	94426	0	https://cdn.intra.42.fr/users/5ed2e6c1c785228db8440fdc0bf40445/medium_cel-mhan.jpg	\N	2023-07-16 23:38:04.195	cel-mhan	cel-mhan@student.1337.ma	0	t
f	\N	Taha Chtaibi	98879	0	https://cdn.intra.42.fr/users/6a2c03ee95b681acca46263bcfa2e850/medium_tchtaibi.jpg	\N	2023-07-16 23:38:33.881	tchtaibi	tchtaibi@student.1337.ma	0	t
f	\N	Hemza Boukili	102109265031908659149	0	https://lh3.googleusercontent.com/a/AAcHTtdNd_EGpv6Wsgbog6OUTj4LGJkSi6SsHnTw6MHqND15=s96-c	\N	2023-07-16 23:39:03.524	HBoukili221	hm.boukiili97@gmail.com	0	t
f	\N	Saber Choukoukou	99045	0	https://cdn.intra.42.fr/users/16a8917f3a4b43161e770e46b7b1f65f/medium_schoukou.jpg	\N	2023-07-16 23:38:47.961	schoukou	schoukou@student.1337.ma	0	f
f	\N	Yassine Dahni	98935	0	https://cdn.intra.42.fr/users/6a849842d7abd046f5c5cbe6bee8b934/medium_ydahni.jpg	\N	2023-07-17 02:49:03.896	ydahni	ydahni@student.1337.ma	0	t
f	\N	Hamza Boukili	98937	0	https://cdn.intra.42.fr/users/505cbe5d91097ae88576c9ad5b38b66b/medium_hboukili.jpg	\N	2023-07-17 03:21:42.287	hboukili	hboukili@student.1337.ma	0	t
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: myschema; Owner: myuser
--

COPY myschema._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
fa2c47f2-a35c-449f-acf6-c08d16728b63	3de9e0465a22932a5a941f8f9a96591ac8be6d3e3bcbd66871fde9b0902d33c0	2023-07-16 23:21:43.074048+00	20230605014623_init	\N	\N	2023-07-16 23:21:42.786919+00	1
875217ce-e80a-49de-a59c-bcf3dc2c5b1b	e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855	2023-07-16 23:21:44.248066+00	20230621005732_	\N	\N	2023-07-16 23:21:44.234214+00	1
11724e2f-9bb2-4a30-9ee4-124d437d6456	73775d652cbf41bdb0e3f78e17d8384e59e5d6db181ad54fa083f541b794170e	2023-07-16 23:21:43.356384+00	20230606012335_init	\N	\N	2023-07-16 23:21:43.081401+00	1
1b364d31-0363-4351-ab46-8a9e7f10ddd0	702b130e5eca3759bce1db90771a35c30d93d9e231de0443e412dba02b5625a0	2023-07-16 23:21:43.38216+00	20230607160915_myschema	\N	\N	2023-07-16 23:21:43.360657+00	1
cca060c2-a8b4-4b13-9ee2-dfebdf274abd	d9ed2071d3fab89fd889844819ce75bfcecd956ee50398f99f3201ae7ee2c6e3	2023-07-16 23:21:43.403558+00	20230612035255_add_refresh_token	\N	\N	2023-07-16 23:21:43.384901+00	1
db037fb2-1000-41ef-9cee-2c47e30399c4	4d3a7370c271cd0d551d9a189326709d0174d321071c77cf362bd9aa0a7beff5	2023-07-16 23:21:44.26931+00	20230621040514_myschema	\N	\N	2023-07-16 23:21:44.250318+00	1
4eadcfc6-7d8f-4669-af9e-01911477abde	a80b09589dd758339dcab5acb4ffafe7ebb93cd01305ae778f262e4dd5ffe93b	2023-07-16 23:21:43.4395+00	20230614041123_myschema3	\N	\N	2023-07-16 23:21:43.412643+00	1
ce8963b2-6b77-4e34-bc8a-ab00d2bf0b8c	e09e80a658298fed832d8739f36b2fc6b93b927537dc1d5e6e380211e5ce0a7c	2023-07-16 23:21:43.450824+00	20230615144243_myschema	\N	\N	2023-07-16 23:21:43.443101+00	1
53b5e511-d4a4-460c-86a0-7f590634b347	c9639cce7c2f81e619889982e7162f2c880cb0aafbdf2283a8dc1b74f4b39144	2023-07-16 23:21:43.739871+00	20230616025120_myschema	\N	\N	2023-07-16 23:21:43.454109+00	1
b27f08d7-f9f8-40be-baf6-9be4b16fb2ce	e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855	2023-07-16 23:21:44.284324+00	20230622162812_	\N	\N	2023-07-16 23:21:44.278017+00	1
97781c3f-9157-497d-b4b9-92d50f8df042	8f99884738269262fadc163f0f98b49aed7b40e512b2791a36bc4353307044d7	2023-07-16 23:21:44.075987+00	20230616025402_myschema	\N	\N	2023-07-16 23:21:43.742647+00	1
3ad5a81f-610e-4176-a6b8-7b2285957bd1	787d9b130656e80a016a2b0d5b020f8fe8a77d3704b6d7b5b63c3284f1f16c74	2023-07-16 23:21:44.125474+00	20230616210218_myschema	\N	\N	2023-07-16 23:21:44.082737+00	1
1c2d2c03-37ea-4f43-a506-7420bf252bbf	5f05f7c56b7c1ffaadd563c52fe7b0428bc9c4e5736b5164498676e56eda61f8	2023-07-16 23:21:44.151703+00	20230616210702_myschema	\N	\N	2023-07-16 23:21:44.127862+00	1
bffbd54e-b796-469c-8e7c-2ae69611ded8	984121ae2964a396a8983ca248cb7e7c676860426b59baededf38c894953cc3a	2023-07-16 23:21:44.301288+00	20230714024421_upload	\N	\N	2023-07-16 23:21:44.291433+00	1
4716284b-88b0-43fd-935c-155b094e1007	aafcadbd9f2d10d57bc2329e150a599200073018610830e66beb8fbca1656aa7	2023-07-16 23:21:44.164003+00	20230619212304_myschema	\N	\N	2023-07-16 23:21:44.154779+00	1
beaa5016-d803-4756-83fe-a7a2a6cbe0cf	d2280109a126d706db9174e4cada49c0b3863d0484e3928bb3c576ada6e12e34	2023-07-16 23:21:44.186767+00	20230620192424_	\N	\N	2023-07-16 23:21:44.175127+00	1
94da744b-9606-40cf-8ba9-4695b1eec792	c1aa1358ec56c0013ebe7f251f27d499e447d19b7e4b3730ecff983b0b9fa0f6	2023-07-16 23:21:44.215131+00	20230620221832_myschema	\N	\N	2023-07-16 23:21:44.192375+00	1
d80c9962-0463-4c4f-b2d6-58c880c4c75f	068d005119b4597553418795bb96d617cd6a0f5a9a3fc6b8333841dc300a14a8	2023-07-16 23:21:44.318679+00	20230714201412_no_upload	\N	\N	2023-07-16 23:21:44.308733+00	1
361cf09a-a38d-4e62-8e8e-4710b348a805	2974e88ad1fc9cc74d81ac94506fc808377daeb0f39795d72d848b9fe2d10908	2023-07-16 23:21:44.2297+00	20230621001326_myschema	\N	\N	2023-07-16 23:21:44.219588+00	1
946d276a-fcea-4df0-987b-8e6f71ea7b88	01e0b2a14abb44e7c814895475022d7c271f3245d757a60e9ae351a9d93a8db4	2023-07-16 23:21:44.391584+00	20230716231216_asa	\N	\N	2023-07-16 23:21:44.325856+00	1
6d7a47d5-8f86-498e-b633-e11e36f769b4	e16e0c38310b1497b1b71aee70c72cbb132d2a29ac0bae4456ba9182609a5d1a	2023-07-16 23:21:53.330303+00	20230716232153_myschema	\N	\N	2023-07-16 23:21:53.314961+00	1
2e1fc152-8d53-42b0-adb8-71655125e14f	ac11624ac44a06ec3c80beecc8e07852227fc150d3a57e8a9adb4c9f3cf61ffd	2023-07-17 03:16:06.966749+00	20230717031606_badges	\N	\N	2023-07-17 03:16:06.726974+00	1
\.


--
-- Data for Name: badges; Type: TABLE DATA; Schema: myschema; Owner: myuser
--

COPY myschema.badges ("badgesId", "Bronze", "Silver", "Gold", "Platinum", "Diamond", "Master", "Grandmaster", "Legend", "Elite", "Champion", "UserId") FROM stdin;
1	t	f	f	f	f	f	f	f	f	f	98937
\.


--
-- Name: Friendship_FriendshipId_seq; Type: SEQUENCE SET; Schema: myschema; Owner: myuser
--

SELECT pg_catalog.setval('myschema."Friendship_FriendshipId_seq"', 9, true);


--
-- Name: Game_GameId_seq; Type: SEQUENCE SET; Schema: myschema; Owner: myuser
--

SELECT pg_catalog.setval('myschema."Game_GameId_seq"', 2, true);


--
-- Name: Membership_GroupId_seq; Type: SEQUENCE SET; Schema: myschema; Owner: myuser
--

SELECT pg_catalog.setval('myschema."Membership_GroupId_seq"', 1, false);


--
-- Name: Message_MessageId_seq; Type: SEQUENCE SET; Schema: myschema; Owner: myuser
--

SELECT pg_catalog.setval('myschema."Message_MessageId_seq"', 1, false);


--
-- Name: Notification_NotificationId_seq; Type: SEQUENCE SET; Schema: myschema; Owner: myuser
--

SELECT pg_catalog.setval('myschema."Notification_NotificationId_seq"', 3, true);


--
-- Name: Room_RoomId_seq; Type: SEQUENCE SET; Schema: myschema; Owner: myuser
--

SELECT pg_catalog.setval('myschema."Room_RoomId_seq"', 1, false);


--
-- Name: badges_badgesId_seq; Type: SEQUENCE SET; Schema: myschema; Owner: myuser
--

SELECT pg_catalog.setval('myschema."badges_badgesId_seq"', 1, true);


--
-- Name: Friendship Friendship_pkey; Type: CONSTRAINT; Schema: myschema; Owner: myuser
--

ALTER TABLE ONLY myschema."Friendship"
    ADD CONSTRAINT "Friendship_pkey" PRIMARY KEY ("FriendshipId");


--
-- Name: Game Game_pkey; Type: CONSTRAINT; Schema: myschema; Owner: myuser
--

ALTER TABLE ONLY myschema."Game"
    ADD CONSTRAINT "Game_pkey" PRIMARY KEY ("GameId");


--
-- Name: Membership Membership_pkey; Type: CONSTRAINT; Schema: myschema; Owner: myuser
--

ALTER TABLE ONLY myschema."Membership"
    ADD CONSTRAINT "Membership_pkey" PRIMARY KEY ("GroupId");


--
-- Name: Message Message_pkey; Type: CONSTRAINT; Schema: myschema; Owner: myuser
--

ALTER TABLE ONLY myschema."Message"
    ADD CONSTRAINT "Message_pkey" PRIMARY KEY ("MessageId");


--
-- Name: Notification Notification_pkey; Type: CONSTRAINT; Schema: myschema; Owner: myuser
--

ALTER TABLE ONLY myschema."Notification"
    ADD CONSTRAINT "Notification_pkey" PRIMARY KEY ("NotificationId");


--
-- Name: Room Room_pkey; Type: CONSTRAINT; Schema: myschema; Owner: myuser
--

ALTER TABLE ONLY myschema."Room"
    ADD CONSTRAINT "Room_pkey" PRIMARY KEY ("RoomId");


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: myschema; Owner: myuser
--

ALTER TABLE ONLY myschema."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY ("UserId");


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: myschema; Owner: myuser
--

ALTER TABLE ONLY myschema._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: badges badges_pkey; Type: CONSTRAINT; Schema: myschema; Owner: myuser
--

ALTER TABLE ONLY myschema.badges
    ADD CONSTRAINT badges_pkey PRIMARY KEY ("badgesId");


--
-- Name: User_email_key; Type: INDEX; Schema: myschema; Owner: myuser
--

CREATE UNIQUE INDEX "User_email_key" ON myschema."User" USING btree (email);


--
-- Name: User_username_key; Type: INDEX; Schema: myschema; Owner: myuser
--

CREATE UNIQUE INDEX "User_username_key" ON myschema."User" USING btree (username);


--
-- Name: badges_UserId_key; Type: INDEX; Schema: myschema; Owner: myuser
--

CREATE UNIQUE INDEX "badges_UserId_key" ON myschema.badges USING btree ("UserId");


--
-- Name: Friendship Friendship_ReceiverId_fkey; Type: FK CONSTRAINT; Schema: myschema; Owner: myuser
--

ALTER TABLE ONLY myschema."Friendship"
    ADD CONSTRAINT "Friendship_ReceiverId_fkey" FOREIGN KEY ("ReceiverId") REFERENCES myschema."User"("UserId") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Friendship Friendship_SenderId_fkey; Type: FK CONSTRAINT; Schema: myschema; Owner: myuser
--

ALTER TABLE ONLY myschema."Friendship"
    ADD CONSTRAINT "Friendship_SenderId_fkey" FOREIGN KEY ("SenderId") REFERENCES myschema."User"("UserId") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Game Game_PlayerId1_fkey; Type: FK CONSTRAINT; Schema: myschema; Owner: myuser
--

ALTER TABLE ONLY myschema."Game"
    ADD CONSTRAINT "Game_PlayerId1_fkey" FOREIGN KEY ("PlayerId1") REFERENCES myschema."User"("UserId") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Game Game_PlayerId2_fkey; Type: FK CONSTRAINT; Schema: myschema; Owner: myuser
--

ALTER TABLE ONLY myschema."Game"
    ADD CONSTRAINT "Game_PlayerId2_fkey" FOREIGN KEY ("PlayerId2") REFERENCES myschema."User"("UserId") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Game Game_WinnerId_fkey; Type: FK CONSTRAINT; Schema: myschema; Owner: myuser
--

ALTER TABLE ONLY myschema."Game"
    ADD CONSTRAINT "Game_WinnerId_fkey" FOREIGN KEY ("WinnerId") REFERENCES myschema."User"("UserId") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Membership Membership_RoomId_fkey; Type: FK CONSTRAINT; Schema: myschema; Owner: myuser
--

ALTER TABLE ONLY myschema."Membership"
    ADD CONSTRAINT "Membership_RoomId_fkey" FOREIGN KEY ("RoomId") REFERENCES myschema."Room"("RoomId") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Membership Membership_UserId_fkey; Type: FK CONSTRAINT; Schema: myschema; Owner: myuser
--

ALTER TABLE ONLY myschema."Membership"
    ADD CONSTRAINT "Membership_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES myschema."User"("UserId") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Message Message_RoomId_fkey; Type: FK CONSTRAINT; Schema: myschema; Owner: myuser
--

ALTER TABLE ONLY myschema."Message"
    ADD CONSTRAINT "Message_RoomId_fkey" FOREIGN KEY ("RoomId") REFERENCES myschema."Room"("RoomId") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Message Message_UserId_fkey; Type: FK CONSTRAINT; Schema: myschema; Owner: myuser
--

ALTER TABLE ONLY myschema."Message"
    ADD CONSTRAINT "Message_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES myschema."User"("UserId") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Notification Notification_receiverId_fkey; Type: FK CONSTRAINT; Schema: myschema; Owner: myuser
--

ALTER TABLE ONLY myschema."Notification"
    ADD CONSTRAINT "Notification_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES myschema."User"("UserId") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Notification Notification_senderId_fkey; Type: FK CONSTRAINT; Schema: myschema; Owner: myuser
--

ALTER TABLE ONLY myschema."Notification"
    ADD CONSTRAINT "Notification_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES myschema."User"("UserId") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: badges badges_UserId_fkey; Type: FK CONSTRAINT; Schema: myschema; Owner: myuser
--

ALTER TABLE ONLY myschema.badges
    ADD CONSTRAINT "badges_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES myschema."User"("UserId") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

