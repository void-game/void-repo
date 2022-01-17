import { EntityState, Entity, ScreenState } from '@core';
export declare class Player implements Entity {
    state: EntityState;
    constructor({ name, color, speed, position: { x, y }, size: { height, width }, screenKey, collide, collisionMap, }: EntityState);
    private findTileByPosition;
    private findNearestTiles;
    update: (keys: any, screenState: ScreenState) => void;
}
