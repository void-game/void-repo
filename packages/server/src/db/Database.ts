import bcrypt from 'bcrypt';

interface Position {
  x: number;
  y: number;
}

export interface SavedPlayer {
  id: string;
  username: string;
  passwordDigest: string;
  color: string;
  position: Position;
  screenKey: string;
}

const defaultPosition: Position = {
  x: 1296 / 2,
  y: 864 / 2,
};

export function makeid(length: number) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export class Database {
  private _players: { [key: string]: SavedPlayer } = {};

  async authenticate(username: string, password: string, color: string) {
    const player = this.findPlayerByUsername(username);
    if (player) {
      const match = await bcrypt.compare(password, player.passwordDigest);
      if (match) {
        const updatedPlayerState: SavedPlayer = { ...player, color };
        this.save(updatedPlayerState);
        return updatedPlayerState;
      }

      throw new Error('UNAUTHORIZED');
    } else {
      const passwordDigest = await bcrypt.hash(password, 10);
      const id = makeid(10);

      const savedPlayer: SavedPlayer = {
        id,
        passwordDigest,
        username,
        color: color || 'blue',
        position: defaultPosition,
        screenKey: '0,0,0',
      };

      this.save(savedPlayer);

      return savedPlayer;
    }
  }

  getPlayerById(id: string) {
    return this._players[id];
  }

  save(player: SavedPlayer) {
    this._players[player.id] = player;
  }

  findPlayerByUsername(username: string) {
    const keys = Object.keys(this._players);
    for (let i = 0; i < keys.length; i++) {
      const player = this._players[keys[i]];

      if (player.username === username) {
        return player;
      }
    }
  }
}
