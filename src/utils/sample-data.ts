import { fetchJoke } from '.';
import { Activity, Post, User } from '../models';

type AddActivity = (username: string, type: string, ts: string) => void;

export const loadSampleData = (
  addActivity: AddActivity,
  asyncLoad: (posts: Post[]) => void,
) => {
  const users = loadUsers();
  const posts = loadPostsAndComments(users, addActivity);

  new Promise<Post[]>(async (resolve) => {
    resolve(asyncLoadSamplePosts(users, addActivity));
  }).then(asyncLoad);

  return {
    users,
    posts,
  };
};

const asyncLoadSamplePosts = async (
  users: User[],
  addActivity: AddActivity,
): Promise<Post[]> => {
  const usopp = users.find((u) => u.username === 'usopp');

  const posts: Post[] = [];

  if (usopp) {
    const usoppJoke = new Post({
      userId: usopp.id,
      content: await fetchJoke(),
    });

    const ts = past(22, usoppJoke);
    posts.push(usoppJoke);

    addActivity(usopp.username, Activity.POST_CREATE, ts);
  }

  return posts;
};

const loadUsers = () => {
  const luffy = Luffy();
  const zoro = Zoro();
  const nami = Nami();
  const usopp = Usopp();
  const sanji = Sanji();
  const chopper = Chopper();
  const robin = Robin();
  const franky = Franky();
  const brook = Brook();
  const jinbe = Jinbe();

  luffy.description = 'Captain';
  zoro.description = 'Swordsman, 2nd Captain';
  nami.description = 'Navigator';
  usopp.description = 'Sniper';
  sanji.description = 'Cook';
  chopper.description = 'Doctor';
  robin.description = 'Archaeologist';
  franky.description = 'Shipwright';
  brook.description = 'Musician, Swordsman';
  jinbe.description = 'Helmsman';

  return [
    luffy,
    zoro,
    nami,
    usopp,
    sanji,
    chopper,
    robin,
    franky,
    brook,
    jinbe,
  ];
};

const loadPostsAndComments = (users: User[], addActivity: AddActivity) => {
  const [
    luffy,
    zoro,
    nami,
    usopp,
    sanji,
    chopper,
    robin,
    franky,
    brook,
    jinbe,
  ] = users;

  // ! Luffy Post
  const p1 = new Post({
    userId: luffy.id,
    content: "I'll be King of the Pirates! ☠",
  });

  const allUserIds = () => users.map((u) => u.id);

  p1.likes = allUserIds();
  const p1c1 = p1.addComment(nami.id, 'Go Luffy! 💗');
  const p1c1_1 = p1c1.addReply(luffy.id, 'Oy nami! Hihihihihihihi 👍🏻');

  addActivity(luffy.username, Activity.POST_CREATE, past(540, p1c1));
  past(518, p1c1_1);
  p1c1.likes = [luffy.id, robin.id];
  p1c1_1.likes = [nami.id];
  past(543, p1);

  // ! Zoro Post
  const p2 = new Post({
    userId: zoro.id,
    content: "I'm the greatest swordsman in the world! ⚔",
  });

  p2.likes = [luffy.id, zoro.id, nami.id, usopp.id, brook.id];

  const p2c1 = p2.addComment(
    sanji.id,
    "🔥 you can't even properly slice a ham or fish fillet",
  );
  const p2c1_1 = p2c1.addReply(zoro.id, "🔥 you can't even kick a girl!");
  const p2c1_2 = p2c1.addReply(franky.id, 'awww! SUUUUUPPEER! 😎');
  const p2c1_3 = p2c1.addReply(luffy.id, 'hiiiihihihihihihi');

  past(349, p2c1, p2c1_1, p2c1_2, p2c1_3);
  // end zoro's post
  past(459, p2);

  // ! Sanji Post
  const p3 = new Post({
    userId: sanji.id,
    content:
      'img:https://i.redd.it/ti1v42gndzhy.png\n\nCooking for Nami and Robin 🥰',
  });

  p3.likes = [luffy.id, usopp.id, brook.id, sanji.id];

  luffy.savedPosts.push(p3.id);
  robin.savedPosts.push(p3.id);
  nami.savedPosts.push(p3.id);

  const p3c1 = p3.addComment(luffy.id, 'oy Sanji, meat! 😋🍖');
  const p3c1_1 = p3c1.addReply(sanji.id, 'Hahaha! Sure Luffy 😎');

  p3c1.likes = [sanji.id, nami.id, usopp.id];
  p3c1_1.likes = [luffy.id];

  past(301, p3c1, p3c1_1);
  // end sanji's post
  past(359, p3);

  // ! Luffy Post 2
  const gear5 = new Post({
    userId: luffy.id,
    content: `img:https://media0.giphy.com/media/YRThiAEEYVNtC5acLO/giphy.gif\n\nGEAR 5 Unlocked! 🔥🔥🔥🔥🔥`,
  });

  gear5.likes = allUserIds();

  past(39, gear5);

  robin.savedPosts.push(gear5.id);
  zoro.savedPosts.push(gear5.id);

  // ! Robin Post
  const post = new Post({
    userId: robin.id,
    content: `img:https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/ab9765a0-c82d-49b6-10b6-cb83561ec800/width=450/225596.jpeg\n\nHave a great day everyone!`,
  });

  post.likes = allUserIds();

  sanji.savedPosts.push(post.id);

  const postc1 = post.addComment(
    sanji.id,
    'Robin swaaan 💘♥💖💓💙💚💛💜🧡💝💞😍🤍🤎🖤❤😍😍',
  );
  const postc1_1 = postc1.addReply(robin.id, 'Hehehe 😊');

  postc1.likes = [robin.id, luffy.id, chopper.id];
  postc1_1.likes = [sanji.id, brook.id];

  past(19, postc1, postc1_1);

  const postc2 = post.addComment(brook.id, 'Ah Robin san, can I see your ...');
  const postc2_1 = postc2.addReply(nami.id, 'oy Brook! 👊🏻💢');
  const postc2_2 = postc2.addReply(brook.id, '💀 yohohohoho!');
  const postc2_3 = postc2.addReply(robin.id, '😂');

  postc2_1.likes = [brook.id];
  postc2_3.likes = [brook.id, sanji.id];

  past(7, postc2, postc2_1);
  past(5, postc2_2, postc2_3);

  const postc3 = post.addComment(robin.id, 'Thank you all for supporting me');
  const postc3_1 = postc3.addReply(franky.id, 'Suuuuuper no problem 👍🏻');
  const postc3_2 = postc3.addReply(luffy.id, 'Hihihi, we will protect you!');
  const postc3_3 = postc3.addReply(robin.id, 'Luffy 😊');

  postc3.likes = allUserIds();
  postc3.likes = postc3.likes.filter(
    (id) => id !== robin.id && id !== jinbe.id,
  );

  postc3_1.likes = [robin.id, sanji.id, luffy.id, chopper.id];
  postc3_2.likes = [
    robin.id,
    sanji.id,
    chopper.id,
    jinbe.id,
    zoro.id,
    brook.id,
  ];
  postc3_3.likes = [luffy.id];

  const ts = past(3, postc3, postc3_1, postc3_2, postc3_3);
  // end robin's post

  past(25, post);

  addActivity(luffy.username, Activity.POST_LIKE, ts);
  addActivity(brook.username, Activity.COMMENT_LIKE, ts);
  addActivity(zoro.username, Activity.COMMENT_LIKE, ts);
  addActivity(jinbe.username, Activity.COMMENT_LIKE, ts);
  addActivity(chopper.username, Activity.COMMENT_LIKE, ts);
  addActivity(sanji.username, Activity.COMMENT_LIKE, ts);
  addActivity(robin.username, Activity.COMMENT_CREATE, ts);
  addActivity(franky.username, Activity.COMMENT_REPLY, ts);
  addActivity(luffy.username, Activity.COMMENT_REPLY, ts);
  addActivity(robin.username, Activity.COMMENT_REPLY, ts);

  // return "Posts" only, not comments
  return [p1, p2, p3, gear5, post];
};

export const STRAWHATS = [
  'monkey_d_luffy',
  'roronoa_zoro',
  'nami',
  'usopp',
  'sanji',
  'tonytony_chopper',
  'nico_robin',
  'franky',
  'brook',
  'jinbe',
];

export const password = import.meta.env.PROD // vite-env.d.ts
  ? 'T3st L@bs'
  : import.meta.env.VITE_STRAWHATS_PASSWORD; // .env.local
// must prefix "VITE_" for custom env to be exposed in the client

const Luffy = () =>
  new User({
    firstname: 'Luffy',
    lastname: 'Monkey',
    username: 'monkey_d_luffy', // username should be exactly the same in the STRAWHATS array
    password,
  });

const Zoro = () =>
  new User({
    firstname: 'Zoro',
    lastname: 'Roronoa',
    username: 'roronoa_zoro',
    password,
  });

const Nami = () =>
  new User({
    firstname: 'Nami',
    lastname: '',
    username: 'nami',
    password,
  });

const Usopp = () =>
  new User({
    firstname: 'Usopp',
    lastname: '',
    username: 'usopp',
    password,
  });

const Sanji = () =>
  new User({
    firstname: 'Sanji',
    lastname: 'Vinsmoke',
    username: 'sanji',
    password,
  });

const Chopper = () =>
  new User({
    firstname: 'Chopper',
    lastname: 'Tony Tony',
    username: 'tonytony_chopper',
    password,
  });

const Robin = () =>
  new User({
    firstname: 'Nico',
    lastname: 'Robin',
    username: 'nico_robin',
    password,
  });

const Franky = () =>
  new User({
    firstname: 'Cutty',
    lastname: 'Flam',
    username: 'franky',
    password,
  });

const Brook = () =>
  new User({
    firstname: 'Brook',
    lastname: '',
    username: 'brook',
    password,
  });

const Jinbe = () =>
  new User({
    firstname: 'Jinbe',
    lastname: '',
    username: 'jinbe',
    password,
  });

type DataWithTs = {
  createdTs: string;
  updatedTs: string;
};

/** Mock the createdTs and updatedTs for a post/comment by mutating the `obj` passed */
const past = (pastMinutes: number, ...objs: DataWithTs[]): string => {
  let timeResult = '0';

  objs.forEach((obj) => {
    const dateString = obj.createdTs;
    const pastSeconds = pastMinutes * 60;
    const pastTime = +dateString - pastSeconds;
    timeResult = obj.createdTs = obj.updatedTs = pastTime.toString();
  });

  return timeResult;
};
