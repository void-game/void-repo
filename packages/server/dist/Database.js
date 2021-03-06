"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeid = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const defaultPosition = {
    x: 0,
    y: 0,
};
function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}
exports.makeid = makeid;
class Database {
    constructor() {
        this._players = {};
    }
    authenticate(username, password, color) {
        return __awaiter(this, void 0, void 0, function* () {
            const player = this.findPlayerByUsername(username);
            if (player) {
                const match = yield bcrypt_1.default.compare(password, player.passwordDigest);
                if (match) {
                    return player;
                }
                throw new Error('UNAUTHORIZED');
            }
            else {
                const passwordDigest = yield bcrypt_1.default.hash(password, 10);
                const id = makeid(10);
                const savedPlayer = {
                    id,
                    passwordDigest,
                    username,
                    color: color || 'blue',
                    position: defaultPosition,
                };
                this.save(savedPlayer);
                return savedPlayer;
            }
        });
    }
    ;
    getPlayerById(id) {
        return this._players[id];
    }
    save(player) {
        this._players[player.id] = player;
    }
    findPlayerByUsername(username) {
        const keys = Object.keys(this._players);
        for (let i = 0; i < keys.length; i++) {
            const player = this._players[keys[i]];
            if (player.username === username) {
                return player;
            }
        }
    }
}
exports.default = Database;
//# sourceMappingURL=Database.js.map