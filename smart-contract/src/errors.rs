use anchor_lang::prelude::error_code;

#[error_code]
pub enum LobbyError {
    #[msg("The game is not active.")]
    GameNotActive,
    #[msg("You have already placed the bet.")]
    BetAlreadyPlaced,
    #[msg("Lobby is full, players have already joined.")]
    LobbyFull,
    #[msg("lobby not found, please validate the lobby id.")]
    LobbyNotFound,
    #[msg("Owner not found: Contract is not operational.")]
    OwnerNotFound,
    #[msg("Waiting: player has not joined the game yet.")]
    PlayersNotJoined,
    #[msg("Cannot join with the same wallet")]
    CannotJoinWithSameWallet,
    #[msg("User not in lobby")]
    UserNotInLobby,
    #[msg("Action restricted: only winners can perform this action.")]
    WinnerActionRestricted,
    #[msg("Reward already claimed")]
    RewardAlreadyClaimed,
    #[msg("Permission denied: only the owner can perform this action")]
    OwnerPermissionDenied,
}
