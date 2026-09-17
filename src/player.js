class Player {
    constructor (id, position, team) {
        this.id = id;
        this.position = position;
        this.team = team;
    }
    get id() {
        return this.id;
    }
    get position () {
        return this.position;
    }
    get team () {
        return this.team;
    }
}