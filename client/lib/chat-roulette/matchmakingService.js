const profiles = [
  {
    name: "Mia",
    age: 22,
    city: "Berlin",
    interests: ["music", "travel", "memes"],
    status: "Looking for spontaneous conversations",
  },
  {
    name: "Noah",
    age: 25,
    city: "Toronto",
    interests: ["gaming", "coffee", "movies"],
    status: "Online and ready to talk",
  },
  {
    name: "Yuki",
    age: 24,
    city: "Osaka",
    interests: ["design", "anime", "photography"],
    status: "Wants to practice English",
  },
  {
    name: "Lina",
    age: 21,
    city: "Warsaw",
    interests: ["startups", "books", "cycling"],
    status: "Just joined the queue",
  },
];

const randomItem = (items) => {
  return items[Math.floor(Math.random() * items.length)];
};

export const createMatchmakingService = () => {
  return {
    findRandomPartner() {
      return randomItem(profiles);
    },
    getMatchDelay() {
      return 1800;
    },
    getReplyDelay() {
      return 900;
    },
  };
};
