import { IButtonMutateProps, IFormProps } from '@erxes/ui/src/types';
import React, { useState } from 'react';

import Button from '@erxes/ui/src/components/Button';
import ControlLabel from '@erxes/ui/src/components/form/Label';
import { Form } from '@erxes/ui/src/components/form';
import FormControl from '@erxes/ui/src/components/form/Control';
import FormGroup from '@erxes/ui/src/components/form/Group';
import { IParticipant } from '../../types';
import List from './List';
import { ModalFooter } from '@erxes/ui/src/styles/main';
import SelectCustomers from '@erxes/ui-contacts/src/customers/containers/SelectCustomers';

type Props = {
  deal?: any;
  participants: IParticipant[];
  closeModal?: () => void;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  modal?: boolean;
};

const ParticipantsForm = (props: Props) => {
  const { deal, closeModal, renderButton } = props;
  const object = deal || {};

  const [driver, setDriver] = useState<IParticipant>(undefined);

  const onChangeParticipants = (participants: IParticipant[]) => {
    const winner = participants.filter(p => p.status === 'won');

    if (!winner.length) {
      return;
    }

    setDriver(winner[0]);
  };

  const renderFooter = (formProps: IFormProps) => {
    const { values, isSubmitted } = formProps;

    if (deal) {
      values.dealId = deal._id;
    }

    return (
      <ModalFooter>
        <Button
          btnStyle="simple"
          type="button"
          icon="times-circle"
          onClick={closeModal}
        >
          Cancel
        </Button>

        {renderButton({
          name: 'deal',
          values: driver && {
            dealId: driver.deal._id,
            customerId: driver.customer._id
          },
          isSubmitted,
          callback: closeModal,
          object
        })}
      </ModalFooter>
    );
  };

  const renderContent = (formProps: IFormProps) => {
    return (
      <>
        <FormGroup>
          <List
            participants={props.participants}
            onChangeParticipants={onChangeParticipants}
          />
        </FormGroup>

        {renderFooter({ ...formProps })}
      </>
    );
  };

  return <Form renderContent={renderContent} />;
};

export default ParticipantsForm;
