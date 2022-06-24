import {
  Button,
  ControlLabel,
  DateControl,
  Form,
  FormControl,
  FormGroup,
  Wrapper,
  router,
  Tip,
  Icon
} from '@erxes/ui/src';
import { DateContainer, ScrollWrapper } from '@erxes/ui/src/styles/main';
import React from 'react';
import {
  ClearBtnContainer,
  PaddingTop,
  FilterRowContainer,
  SettingsContent
} from '../../../styles';
import ScoreFormContainer from '../containers/Form';

interface LayoutProps {
  children: React.ReactNode;
  label: string;
  clearable: boolean;
  type: string;
}
interface VObject {
  fromDate: string;
  toDate: string;
  order: string;
  ownerType: string;
}

type State = {
  variables: VObject;
};

type Props = {
  loadingMainQuery: boolean;
  history: any;
  queryParams: any;
  refetch: (variable: any) => void;
};

class SideBar extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      variables: this.props?.queryParams
    };
  }

  render() {
    const { refetch, history } = this.props;
    const { variables } = this.state;
    const btnModal = <Button>Score</Button>;

    const handleClear = (e: any, type: string) => {
      router.removeParams(history, type);
      variables[type] = '';
      refetch(variables);
      // this.setState({variables:variables})
    };

    const handleValue = (e: any) => {
      const target = e.currentTarget as HTMLInputElement;
      const name = target.name;
      const value = target.value;
      const result = { ...variables, [name]: value };
      this.setState({ variables: result });
      router.setParams(history, { [name]: value });
      refetch(result);
    };

    const handleDate = (e: any, type: string) => {
      const result = { ...variables, [type]: String(e) };
      this.setState({ variables: result });
      router.setParams(history, { [type]: String(e) });

      if (variables.fromDate && variables.toDate) {
        refetch(result);
      }
    };

    const checkParams = type => {
      return router.getParam(history, type) ? true : false;
    };
    const Form = (props: LayoutProps) => (
      <FormGroup>
        <ControlLabel>{props.label}</ControlLabel>
        <FilterRowContainer>
          {props.children}
          {props.clearable && (
            <ClearBtnContainer
              tabIndex={0}
              onClick={e => handleClear(e, props.type)}
            >
              <Tip text={'Clear filter'} placement="bottom">
                <Icon icon="cancel-1" />
              </Tip>
            </ClearBtnContainer>
          )}
        </FilterRowContainer>
      </FormGroup>
    );

    const SideBarFilter = () => {
      return (
        <ScrollWrapper>
          <Form
            label="Owner Type"
            clearable={checkParams('ownerType')}
            type="ownerType"
          >
            <FormControl
              name="ownerType"
              componentClass="select"
              defaultValue={variables?.ownerType}
              required={true}
              onChange={handleValue}
            >
              <option key={'customer'} value={'customer'}>
                {' '}
                {'customer'}{' '}
              </option>
              <option key={'user'} value={'user'}>
                {' '}
                {'user'}{' '}
              </option>
              <option key={'company'} value={'company'}>
                {' '}
                {'company'}{' '}
              </option>
            </FormControl>
          </Form>
          <Form label="Order" clearable={checkParams('order')} type="order">
            <FormControl
              name="order"
              componentClass="select"
              defaultValue={variables?.order}
              required={true}
              onChange={handleValue}
            >
              <option key={'Ascending'} value={'Ascending'}>
                {''}
                {'Ascending'}
                {''}
              </option>
              <option key={'Descending'} value={'Descending'}>
                {''}
                {'Descending'}
                {''}
              </option>
            </FormControl>
          </Form>
          <Form
            label="From"
            clearable={checkParams('fromDate')}
            type="fromDate"
          >
            <DateContainer>
              <DateControl
                required={true}
                name="startDate"
                placeholder={'date'}
                value={variables?.fromDate}
                onChange={e => handleDate(e, 'fromDate')}
              />
            </DateContainer>
          </Form>
          <Form label="To" clearable={checkParams('toDate')} type="toDate">
            <DateContainer>
              <DateControl
                required={true}
                name="fromDate"
                placeholder={'From'}
                value={variables?.toDate}
                onChange={e => handleDate(e, 'toDate')}
              />
            </DateContainer>
          </Form>
        </ScrollWrapper>
      );
    };
    return (
      <Wrapper.Sidebar>
        <PaddingTop>
          <SideBarFilter />
        </PaddingTop>
      </Wrapper.Sidebar>
    );
  }
}

export default SideBar;
