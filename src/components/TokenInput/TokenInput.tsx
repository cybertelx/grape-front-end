import React from 'react';
import styled from 'styled-components';

import {Button} from '@mui/material';
import Input, {InputProps} from '../Input';

interface TokenInputProps extends InputProps {
  max: number | string;
  symbol: string;
  onSelectMax?: () => void;
}

const TokenInput: React.FC<TokenInputProps> = ({max, symbol, onChange, onSelectMax, value}) => {
  return (
    <StyledTokenInput>
      <StyledMaxText>
        {max.toLocaleString()} {symbol} Available
      </StyledMaxText>
      <Input
        endAdornment={
          <StyledTokenAdornmentWrapper>
            {/* <StyledTokenSymbol>{symbol}</StyledTokenSymbol> */}
            <StyledSpacer />
            <div>
              <Button size="small" color="primary" variant="contained" onClick={onSelectMax}>
                <span style={{color: "#fff"}}>Max</span>
              </Button>
            </div>
          </StyledTokenAdornmentWrapper>
        }
        onChange={onChange}
        placeholder="0"
        value={value}
      />
    </StyledTokenInput>
  );
};

/*
            <div>
              <Button size="sm" text="Max" />
            </div>
*/

const StyledTokenInput = styled.div``;

const StyledSpacer = styled.div`
  width: ${(props) => props.theme.spacing[3]}px;
`;

const StyledTokenAdornmentWrapper = styled.div`
  align-items: center;
  display: flex;
`;

const StyledMaxText = styled.div`
  align-items: center;
  color: #fff;
  display: flex;
  font-size: 14px;
  font-weight: 700;
  height: 44px;
  justify-content: flex-end;
`;

export default TokenInput;
