class Room {
    constructor(id, composerId) {
        this.roomId = id;
        this.composerId = composerId;
        this.users = [];

        this.users.push(composerId);
    }

    addUser(socketId) {
        this.users.push(socketId);
    }

    removeUser(socketId) {
        this.users = this.users.filter((userid) => userid !== socketId);
    }

    getUserLCount() {

    }
}

module.exports = {Room};