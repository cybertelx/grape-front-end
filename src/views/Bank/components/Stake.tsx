import React, {useMemo, useContext} from 'react';
import styled from 'styled-components';

// import Button from '../../../components/Button';
import {Button, Card, CardContent, Typography} from '@mui/material';
// import Card from '../../../components/Card';
// import CardContent from '../../../components/CardContent';
import CardIcon from '../../../components/CardIcon';
import {AddIcon, RemoveIcon} from '../../../components/icons';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import IconButton from '../../../components/IconButton';
import Label from '../../../components/Label';
import Value from '../../../components/Value';
import {ThemeContext} from 'styled-components';

import useApprove, {ApprovalState} from '../../../hooks/useApprove';
import useModal from '../../../hooks/useModal';
import useStake from '../../../hooks/useStake';
import useZap from '../../../hooks/useZap';
import useZapSW from '../../../hooks/useZapSW';
import useStakedBalance from '../../../hooks/useStakedBalance';
import useStakedTokenPriceInDollars from '../../../hooks/useStakedTokenPriceInDollars';
import useTokenBalance from '../../../hooks/useTokenBalance';
import useWithdraw from '../../../hooks/useWithdraw';

import {getDisplayBalance} from '../../../utils/formatBalance';

import DepositModal from './DepositModal';
import WithdrawModal from './WithdrawModal';
import ZapModal from './ZapModal';
import ZapModalSW from './ZapModalSW';
import TokenSymbol from '../../../components/TokenSymbol';
import {Bank} from '../../../grape-finance';

interface StakeProps {
  bank: Bank;
}

const Stake: React.FC<StakeProps> = ({bank}) => {
  const [approveStatus, approve] = useApprove(bank.depositToken, bank.address);

  const {color: themeColor} = useContext(ThemeContext);
  const tokenBalance = useTokenBalance(bank.depositToken);
  const stakedBalance = useStakedBalance(bank.contract, bank.poolId);
  const stakedTokenPriceInDollars = useStakedTokenPriceInDollars(bank.depositTokenName, bank.depositToken);

  const tokenPriceInDollars = useMemo(
    () => (stakedTokenPriceInDollars ? stakedTokenPriceInDollars : null),
    [stakedTokenPriceInDollars],
  );
  const earnedInDollars = (
    Number(tokenPriceInDollars) * Number(getDisplayBalance(stakedBalance, bank.depositToken.decimal))
  ).toFixed(2);
  const {onStake} = useStake(bank);
  const {onZap} = useZap(bank);
  const {onZapSW} = useZapSW(bank);
  const {onWithdraw} = useWithdraw(bank);

  const [onPresentDeposit, onDismissDeposit] = useModal(
    <DepositModal
      max={tokenBalance}
      decimals={bank.depositToken.decimal}
      onConfirm={(amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        onStake(amount);
        onDismissDeposit();
      }}
      tokenName={bank.depositTokenName}
    />,
  );

  const [onPresentZap, onDissmissZap] = useModal(
    <ZapModal
      decimals={bank.depositToken.decimal}
      onConfirm={(zappingToken, tokenName, amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        onZap(zappingToken, tokenName, amount);
        onDissmissZap();
      }}
      LPtokenName={bank.depositTokenName}
    />,
  );

  const [onPresentZapSW, onDissmissZapSW] = useModal(
    <ZapModalSW
      decimals={bank.depositToken.decimal}
      onConfirm={(zappingToken, tokenName, amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        onZapSW(zappingToken, tokenName, amount);
        onDissmissZapSW();
      }}
      LPtokenName={bank.depositTokenName}
    />,
  );

  const [onPresentWithdraw, onDismissWithdraw] = useModal(
    <WithdrawModal
      max={stakedBalance}
      decimals={bank.depositToken.decimal}
      onConfirm={(amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        onWithdraw(amount);
        onDismissWithdraw();
      }}
      tokenName={bank.depositTokenName}
    />,
  );

  let isZapLP = false;
  if (bank.depositTokenName.includes('POPS')) {
    isZapLP = false;
  } else if(bank.depositTokenName.includes('LP')){
    isZapLP = true;
  }

  let isZapSW = false;
  if(bank.depositTokenName.includes('SW')){
    isZapSW = true;
  }
  
  return (
    <Card>
      <CardContent>
        <StyledCardContentInner>
          <StyledCardHeader>
            <CardIcon>
              <TokenSymbol height={65} width={70} symbol={bank.depositToken.symbol} />
            </CardIcon>
            <Typography style={{textTransform: 'uppercase', color: '#930993'}}>
              <Value value={getDisplayBalance(stakedBalance, bank.depositToken.decimal)} />
            </Typography>

            <Label text={`≈ $${Number(earnedInDollars).toLocaleString('en-US')}`} />

            <Typography style={{textTransform: 'uppercase', color: '#fff'}}>
              {`${bank.depositTokenName} Staked`}
            </Typography>
            {/* <Label text={`${bank.depositTokenName} Staked`} /> */}
          </StyledCardHeader>
          <StyledCardActions>
            {approveStatus !== ApprovalState.APPROVED ? (
              <Button
                disabled={
                  bank.closedForStaking ||
                  approveStatus === ApprovalState.PENDING ||
                  approveStatus === ApprovalState.UNKNOWN
                }
                onClick={approve}
                className={
                  bank.closedForStaking ||
                  approveStatus === ApprovalState.PENDING ||
                  approveStatus === ApprovalState.UNKNOWN
                    ? 'shinyButtonDisabled'
                    : 'shinyButton'
                }
                style={{marginTop: '20px'}}
              >
                {`Approve ${bank.depositTokenName}`}
              </Button>
            ) : (
              <>
                <IconButton onClick={onPresentWithdraw} size="large">
                  <RemoveIcon />
                </IconButton>
                <StyledActionSpacer />
                {isZapLP && (
                  <IconButton
                    disabled={bank.closedForStaking}
                    onClick={() => (bank.closedForStaking ? null : onPresentZap())}
                    size="large">
                    <FlashOnIcon style={{color: themeColor.grey[400]}} />
                  </IconButton>
                )}
                {isZapSW && (
                  <IconButton
                    disabled={bank.closedForStaking}
                    onClick={() => (bank.closedForStaking ? null : onPresentZapSW())}
                    size="large">
                    <FlashOnIcon style={{color: themeColor.grey[400]}} />
                  </IconButton>
                )}

                <StyledActionSpacer />
                <IconButton
                  disabled={bank.closedForStaking}
                  onClick={() => (bank.closedForStaking ? null : onPresentDeposit())}
                  size="large">
                  <AddIcon />
                </IconButton>
              </>
            )}
          </StyledCardActions>
        </StyledCardContentInner>
      </CardContent>
    </Card>
  );
};

const StyledCardHeader = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`;
const StyledCardActions = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 28px;
  width: 100%;
`;

const StyledActionSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`;

const StyledCardContentInner = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`;

export default Stake;
