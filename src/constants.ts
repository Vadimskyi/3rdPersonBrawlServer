export enum GameEvent {
    CONNECT = 'connection',
    CONNECTED = 'connected',
    DISCONNECT = 'disconnect',
    JOIN_GAME = 'join_game',
    USER_DATA = 'user_data',
    COMBAT_ROOM_DATA = 'combat_room_data',
    NEW_USER_JOINED = 'new_user_joined',
    MOVE_CHARACTER = 'move_character',
    CHARACTER_MOVED = 'character_moved',
    ROTATE_CHARACTER = 'rotate_character',
    CHARACTER_ROTATED = 'character_rotated',
    FIRE_GUN_CHARACTER = 'fire_gun_character',
    CHARACTER_FIRED_GUN = 'character_fired_gun',
    TAKE_DAMAGE_CHARACTER = 'take_damage_character',
    CHARACTER_TAKEN_DAMAGE = 'character_taken_damage',
    USER_LEFT_GAME = 'user_left_game'
}