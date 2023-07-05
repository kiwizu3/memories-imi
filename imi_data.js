//token used for testing purposes
const USER = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJIYXNoYW4gQ2hhbmRpa2EiLCJhdXRob3JpdGllcyI6WyJST0xFX1VTRVIiXSwiaWF0IjoxNTc2MjIyMTk1LCJleHAiOjE2MDc3NTgxOTUsInVkIjoiMGVhZDNlYjEtYzBlMi00NzM3LTg0YzctODUzNmU0NWI4NzhlIiwidHlwZSI6IkFDQ0VTUyJ9.2OairzdVYH0BAlRqQxQ0iTWn9LZ3lezr0mP15b5_b9A&language=TAMIL&platform=pwa';

const IMI_DATA = {
    //copy vals from dev console
    GAME_ID : "be4a95ec-7619-4568-8f39-ccd50b48ac0e", 
    LB_ID : "11c214de-e1fd-4928-bac8-40cc02716b7d",

    //copy vals from dev console
    REVIVE_1 : "0e0694c1-9c1a-4752-af7b-5465b9674282", 
    REVIVE_2 : "080c033a-f425-426a-9a5b-167730aec4bb",
    REVIVE_3 : "d4a4e7de-4e3f-4785-ba1c-19e4a2b3f722",

    //user-defined values. enter 6-digit numbers
    P_SCORE : 563175,
    Q_SCORE : 221456,
    Z_SCORE : 953147,
    SCORE_LOCK : 456120
};



//#region exports
exports.token = function () {
    return USER;
}
exports.data = function () {
    return IMI_DATA;
}
//#endregion


