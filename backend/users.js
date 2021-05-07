let rooms = [];
let queue = [];

const joinQue = ({ id }) => {
  const doubleUser = queue.find((user) => user.id === id);

  if (doubleUser) return { error: "User is already in que!." };

  const user = { id };
  queue.push(user);

  return { user };
};

const leaveQue = (id) => {
  const index = queue.findIndex((user) => user.id === id);
  if (index !== -1) {
    return queue.splice(index, 1);
  } else {
    return { error: "User with this id is not in Queque." };
  }
};

const getQue = () => {
  return queue;
};

const createRoom = (id) => {
  const getUser = queue.find((user) => user.id === id);
  const matchedWith = queue.find((user) => user.id !== id);

  if (!getUser) return { error: "User is not in queque." };
  if (!matchedWith) return false;

  const roomID = `${getUser.id}+${matchedWith.id}`;

  if (queue.length > 1) {
    leaveQue(getUser.id);
    leaveQue(matchedWith.id);
    rooms.push({
      roomID: roomID,
      inside: { user1: getUser.id, user2: matchedWith.id },
      messages: [],
    });
    return { peer: matchedWith.id, room: roomID };
  }
};

const removeRoom = (id) => {
  const index = rooms.findIndex((room) => room.id === id);

  if (index !== -1) {
    return users.splice(index, 1);
  }
};

const allRooms = () => {
  return rooms;
};

const getRoom = (id) => rooms.find((room) => room.roomID === id);

const updateRoomMessages = (room, message) => {
  const index = rooms.findIndex((found) => found.roomID === room);
  let newRooms = [...rooms];
  const msgs = newRooms[index].messages;
  const newMsg = [{ user: message.user, message: message.message }];

  newRooms[index] = { ...newRooms[index], messages: msgs.concat(newMsg) };
  rooms = newRooms;
};

module.exports = {
  createRoom,
  removeRoom,
  getRoom,
  joinQue,
  leaveQue,
  getQue,
  allRooms,
  updateRoomMessages,
};
