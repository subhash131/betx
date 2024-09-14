use anchor_lang::{
    prelude::*,
    solana_program::{program::invoke, system_instruction::transfer},
};
mod constant;
mod errors;
mod state;
use crate::{constant::*, errors::*, state::*};

declare_id!("DfDwFTWM6f99KRBYEWxShUsbXgJ4K1NR9KbSNWvQVu4H");

#[program]
mod bet_game {
    use super::*;

    pub fn init_master(ctx: Context<InitMaster>) -> Result<()> {
        let master = &mut ctx.accounts.master;
        let deployer = ctx.accounts.payer.key();
        master.owner = deployer;
        master.last_lobby_id = 0;
        master.user_count = 0;
        Ok(())
    }

    pub fn register_user(ctx: Context<RegisterUser>, user_name: String) -> Result<()> {
        let user = &mut ctx.accounts.user;
        let master = &mut ctx.accounts.master;
        user.user_name = user_name;
        user.authority = ctx.accounts.authority.key();
        master.user_count += 1;
        Ok(())
    }

    pub fn create_lobby(ctx: Context<CreateLobby>, bet_amount: u64) -> Result<()> {
        let lobby = &mut ctx.accounts.lobby;
        let master = &mut ctx.accounts.master;

        let default_pubkey = Pubkey::default();
        if master.owner == default_pubkey {
            return err!(LobbyError::OwnerNotFound);
        }

        master.last_lobby_id += 1;

        lobby.id = master.last_lobby_id;
        lobby.player_one = ctx.accounts.authority.key();
        lobby.bet_amount = bet_amount;
        lobby.is_active = true;
        lobby.claimed = false;
        lobby.player_one_placed_bet = false;
        lobby.player_two_placed_bet = false;
        Ok(())
    }

    pub fn join_lobby(ctx: Context<JoinLobby>, lobby_id: u32) -> Result<()> {
        let lobby = &mut ctx.accounts.lobby;

        if lobby.id != lobby_id {
            return err!(LobbyError::LobbyNotFound);
        }

        if lobby.player_two.is_some() {
            return err!(LobbyError::LobbyFull);
        }

        if Some(ctx.accounts.player_two.key()) == Some(lobby.player_one.key()) {
            return err!(LobbyError::CannotJoinWithSameWallet);
        }

        lobby.player_two = Some(ctx.accounts.player_two.key());
        Ok(())
    }

    pub fn place_bet(ctx: Context<PlaceBet>, _lobby_id: u32) -> Result<()> {
        let lobby = &mut ctx.accounts.lobby;
        let payer = &ctx.accounts.payer;

        if !lobby.is_active {
            return err!(LobbyError::GameNotActive);
        }

        if lobby.player_one == payer.key() {
            if lobby.player_one_placed_bet {
                return err!(LobbyError::BetAlreadyPlaced);
            }
        } else if lobby.player_two == Some(payer.key()) {
            if lobby.player_two_placed_bet {
                return err!(LobbyError::BetAlreadyPlaced);
            }
        }

        invoke(
            &transfer(&payer.key(), &lobby.key(), lobby.bet_amount),
            &[
                payer.to_account_info(),
                lobby.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
        )?;

        if lobby.player_one == payer.key() {
            lobby.player_one_placed_bet = true;
        } else if lobby.player_two == Some(payer.key()) {
            lobby.player_two_placed_bet = true;
        } else {
            **lobby.to_account_info().try_borrow_mut_lamports()? -= lobby.bet_amount;
            **payer.to_account_info().try_borrow_mut_lamports()? += lobby.bet_amount;
            msg!("Refund Issued!!");
            return err!(LobbyError::UserNotInLobby);
        }
        Ok(())
    }

    pub fn update_winner(ctx: Context<UpdateWinner>, lobby_id: u32, winner: Pubkey) -> Result<()> {
        let lobby = &mut ctx.accounts.lobby;
        let master = &mut ctx.accounts.master;
        let authority = &ctx.accounts.authority;

        let default_pubkey = Pubkey::default();
        if master.owner == default_pubkey {
            return err!(LobbyError::OwnerNotFound);
        }

        if lobby.id != lobby_id {
            return err!(LobbyError::LobbyNotFound);
        }

        if lobby.player_two.is_none() {
            return err!(LobbyError::PlayersNotJoined);
        }

        if master.owner != authority.key() {
            return err!(LobbyError::OwnerPermissionDenied);
        }

        lobby.winner = Some(winner);
        lobby.is_active = false;
        Ok(())
    }

    pub fn claim_reward(ctx: Context<ClaimReward>, _lobby_id: u32) -> Result<()> {
        let lobby = &mut ctx.accounts.lobby;
        let authority = &mut ctx.accounts.authority;

        if lobby.winner != Some(authority.key()) {
            return err!(LobbyError::WinnerActionRestricted);
        }
        if lobby.claimed {
            return err!(LobbyError::RewardAlreadyClaimed);
        } else {
            lobby.claimed = true;
            **lobby.to_account_info().try_borrow_mut_lamports()? -= lobby.bet_amount;
            **authority.to_account_info().try_borrow_mut_lamports()? += lobby.bet_amount;
        }
        Ok(())
    }

}

#[derive(Accounts)]
#[instruction(lobby_id:u32)]
pub struct UpdateWinner<'info> {
    #[account(
        mut,
        seeds=[
            LOBBY_SEED.as_bytes(), 
            &lobby_id.to_le_bytes()
            ],
        bump,
    )]
    pub lobby: Account<'info, Lobby>,

    #[account(
        mut,
        seeds=[MASTER_SEED.as_bytes()],
        bump,
    )]
    pub master: Account<'info, Master>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(lobby_id:u32)]
pub struct PlaceBet<'info> {
    #[account(
        mut,
        seeds=[
            LOBBY_SEED.as_bytes(), 
            &lobby_id.to_le_bytes()
            ],
        bump,
    )]
    pub lobby: Account<'info, Lobby>,

    #[account(mut)]
    pub payer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(bet_amount:u32)]
pub struct CreateLobby<'info> {
    #[account(
        init, 
        payer = authority,
        space = 8 + std::mem::size_of::<Lobby>(),
        seeds = [LOBBY_SEED.as_bytes(),&(master.last_lobby_id+1).to_le_bytes()],
        bump 
    )]
    pub lobby: Account<'info, Lobby>,
    #[account(
        mut,
        seeds = [MASTER_SEED.as_bytes()],
        bump
    )]
    pub master: Account<'info, Master>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction()]
pub struct RegisterUser<'info> {
    #[account(
        init, 
        payer = authority,
        space = 8 + std::mem::size_of::<Master>() + std::mem::size_of::<UserProfile>(),
        seeds = [USER_SEED.as_bytes(), &authority.key().to_bytes()],
        bump 
    )]
    pub user: Account<'info, UserProfile>,

    #[account(
        mut,
        seeds = [MASTER_SEED.as_bytes()],
        bump,
    )]
    pub master: Account<'info, Master>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(lobby_id:u32)]
pub struct JoinLobby<'info> {
    #[account(
        mut, 
        seeds = [LOBBY_SEED.as_bytes(),&lobby_id.to_le_bytes()],
        bump 
    )]
    pub lobby: Account<'info, Lobby>,

    #[account(mut)]
    pub player_two: Signer<'info>,

    pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
#[instruction(lobby_id:u32)]
pub struct ClaimReward<'info> {
    #[account(
        mut, 
        seeds = [LOBBY_SEED.as_bytes(),&lobby_id.to_le_bytes()],
        bump 
    )]
    pub lobby: Account<'info, Lobby>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct InitMaster<'info> {
    #[account(
        init,
        payer=payer,
        space = 8 + std::mem::size_of::<Master>(),
        seeds = [MASTER_SEED.as_bytes()],
        bump,
    )]
    pub master: Account<'info, Master>,

    // pub
    #[account(mut)]
    pub payer: Signer<'info>,

    pub system_program: Program<'info, System>,
}
