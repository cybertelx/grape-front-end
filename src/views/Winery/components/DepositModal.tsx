import React, {useCallback, useMemo, useState} from 'react';

import {Button} from '@mui/material';
// import Button from '../../../components/Button'
import Modal, {ModalProps} from '../../../components/Modal';
import ModalActions from '../../../components/ModalActions';
import ModalTitle from '../../../components/ModalTitle';
import TokenInput from '../../../components/TokenInput';

import {getFullDisplayBalance} from '../../../utils/formatBalance';
import {BigNumber} from 'ethers';

interface DepositModalProps extends ModalProps {
  max: BigNumber;
  onConfirm: (amount: string) => void;
  tokenName?: string;
}

const DepositModal: React.FC<DepositModalProps> = ({max, onConfirm, onDismiss, tokenName = ''}) => {
  const [val, setVal] = useState('');

  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max, tokenName === 'USDC' ? 6 : 18);
  }, [max, tokenName]);

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setVal(e.currentTarget.value);
    },
    [setVal],
  );

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance);
  }, [fullBalance, setVal]);

  return (
    <Modal>
      <ModalTitle text={`Deposit ${tokenName}`} />
      <TokenInput
        value={val}
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        max={fullBalance}
        symbol={tokenName}
      />
      <ModalActions>
        <Button color="primary" variant="contained" onClick={() => onConfirm(val)}>
          Confirm
        </Button>
      </ModalActions>
    </Modal>
  );
};

export default DepositModal;
