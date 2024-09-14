use anchor_lang::prelude::*;

#[account]
pub struct Master {
    pub last_lobby_id: u32,
    pub user_count: u32,
    pub owner: Pubkey,
}

#[account]
#[derive(Default)]
pub struct UserProfile {
    pub authority: Pubkey,
    pub user_name: String,
}
#[account]
#[derive(Default)]
pub struct Lobby {
    pub id: u32,
    pub player_one: Pubkey,
    pub player_two: Option<Pubkey>,
    pub bet_amount: u64,
    pub is_active: bool,
    pub winner: Option<Pubkey>,
    pub claimed: bool,
    pub player_one_placed_bet: bool,
    pub player_two_placed_bet: bool,
}
