const cannedReplies = [
  "Hi. What are you building right now?",
  "This interface looks clean. Is it your first version?",
  "I am mostly here for random conversations and new playlists.",
  "Tell me something unexpected about your day.",
  "If this becomes real-time, it could be fun.",
];

const randomItem = (items) => {
  return items[Math.floor(Math.random() * items.length)];
};

export const createIntroMessage = (profile) => {
  return {
    id: crypto.randomUUID(),
    author: "partner",
    text: `Hey, I am ${profile.name} from ${profile.city}.`,
  };
};

export const createAutoReply = () => {
  return {
    id: crypto.randomUUID(),
    author: "partner",
    text: randomItem(cannedReplies),
  };
};
