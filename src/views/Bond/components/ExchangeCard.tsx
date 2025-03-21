import React from 'react';
import styled from 'styled-components';

import {Button, Card} from '@mui/material';

// import Button from '../../../components/Button';
// import Card from '../../../components/Card';
import CardContent from '../../../components/CardContent';
import useGrapeFinance from '../../../hooks/useGrapeFinance';
import Label from '../../../components/Label';
import TokenSymbol from '../../../components/TokenSymbol';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowRight} from '@fortawesome/free-solid-svg-icons';
import useModal from '../../../hooks/useModal';
import ExchangeModal from './ExchangeModal';
import ERC20 from '../../../grape-finance/ERC20';
import useTokenBalance from '../../../hooks/useTokenBalance';
import useApprove, {ApprovalState} from '../../../hooks/useApprove';
import useCatchError from '../../../hooks/useCatchError';

interface ExchangeCardProps {
  action: string;
  fromToken: ERC20;
  fromTokenName: string;
  toToken: ERC20;
  toTokenName: string;
  priceDesc: string;
  onExchange: (amount: string) => void;
  disabled?: boolean;
  disabledDescription?: string;
}

const ExchangeCard: React.FC<ExchangeCardProps> = ({
  action,
  fromToken,
  fromTokenName,
  toToken,
  toTokenName,
  priceDesc,
  onExchange,
  disabled = false,
  disabledDescription,
}) => {
  const catchError = useCatchError();
  const {
    contracts: {Treasury},
  } = useGrapeFinance();
  const [approveStatus, approve] = useApprove(fromToken, Treasury.address);

  const balance = useTokenBalance(fromToken);
  const [onPresent, onDismiss] = useModal(
    <ExchangeModal
      title={action}
      description={priceDesc}
      max={balance}
      onConfirm={(value) => {
        onExchange(value);
        onDismiss();
      }}
      action={action}
      tokenName={fromTokenName}
    />,
  );
  return (
    <Card>
      <CardContent>
        <StyledCardContentInner>
          
          <StyledCardTitle>{`${action} ${toTokenName}`}</StyledCardTitle>
          <StyledExchanger>
            <StyledToken>
              <StyledCardIcon>
                <TokenSymbol width={55} height={50} symbol={fromToken.symbol} />
              </StyledCardIcon>
              <Label text={fromTokenName} color="#930993" />
            </StyledToken>
            <StyledExchangeArrow>
              <FontAwesomeIcon icon={faArrowRight} />
            </StyledExchangeArrow>
            <StyledToken>
              <StyledCardIcon>
                <TokenSymbol width={55} height={50} symbol={toToken.symbol} />
              </StyledCardIcon>
              <Label text={toTokenName} color="#930993" />
            </StyledToken>
          </StyledExchanger>
          <StyledDesc>{priceDesc}</StyledDesc>
          <StyledCardActions>
            {approveStatus !== ApprovalState.APPROVED && !disabled ? (
              <Button
                className="shinyButton"
                disabled={approveStatus === ApprovalState.PENDING || approveStatus === ApprovalState.UNKNOWN}
                onClick={() => catchError(approve(), `Unable to approve ${fromTokenName}`)}
              >
                {`Approve ${fromTokenName}`}
              </Button>
            ) : (
              <Button
                className={disabled ? 'shinyButtonDisabled' : 'shinyButton'}
                onClick={onPresent}
                disabled={disabled}
              >
                {disabledDescription || action}
              </Button>
            )}
          </StyledCardActions>
        </StyledCardContentInner>
      </CardContent>
    </Card>
  );
};

const StyledCardTitle = styled.div`
  align-items: center;
  display: flex;
  font-size: 20px;
  font-weight: 700;
  height: 64px;
  justify-content: center;
  color: #ccf;
  margin-top: ${(props) => -props.theme.spacing[3]}px;
`;

const StyledCardIcon = styled.div`
  background-color: rgba(0,0,0,0.2);
  width: 80px;
  height: 80px;
  border-radius: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${(props) => props.theme.spacing[2]}px;
`;

const StyledExchanger = styled.div`
  align-items: center;
  display: flex;
  margin-bottom: ${(props) => props.theme.spacing[5]}px;
`;

const StyledExchangeArrow = styled.div`
  font-size: 20px;
  padding-left: ${(props) => props.theme.spacing[3]}px;
  padding-right: ${(props) => props.theme.spacing[3]}px;
  padding-bottom: ${(props) => props.theme.spacing[4]}px;
`;

const StyledToken = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  font-weight: 600;
`;

const StyledCardActions = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${(props) => props.theme.spacing[3]}px;
  width: 100%;
`;

const StyledDesc = styled.span``;

const StyledCardContentInner = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`;

export default ExchangeCard;
