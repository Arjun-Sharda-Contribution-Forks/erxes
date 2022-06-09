import { Tabs, TabTitle } from '@erxes/ui/src';
import { Button, ModalTrigger } from '@erxes/ui/src/components';
import { Wrapper } from '@erxes/ui/src/layout';
import { MainStyleTitle as Title } from '@erxes/ui/src/styles/eindex';
import { IRouterProps } from '@erxes/ui/src/types';
import moment from 'moment';
import React from 'react';
import { LotteryCampaignDetailQueryResponse } from '../../../configs/lotteryCampaign/types';
import { Container, Description, TriggerTabs } from '../../../styles';
import AwardContent from '../containers/AwardContent';
import { lotteriesCampaignCustomerList } from '../types';
import Sidebar from './Sidebar';

interface IProps extends IRouterProps {
  loading: boolean;
  queryParams: any;
  lotteryCampaignDetailQuery: LotteryCampaignDetailQueryResponse;
  loadVoucherCampaingDetail: (variables: string) => any;
  voucherDetail: any;
  lotteriesCampaignCustomerList: lotteriesCampaignCustomerList;
  doLotteries: (variables: object) => any;
  multipledoLottery: (variables: object) => any;
  winners: any;
  winnerCount: number;
}
type State = {
  searchValue?: string;
  currentTab?: any;
  currentAwardId?: string;
  currentAwardCount?: number;
  isOpenNextChar?: boolean;
  multiple?: number;
};
class VouchersAward extends React.Component<IProps, State> {
  constructor(props) {
    super(props);
    this.state = {
      currentTab: '',
      currentAwardId: '',
      currentAwardCount: 0,
      isOpenNextChar: false,
      multiple: 0
    };
  }
  onClick(currentTab: any) {
    this.setState({
      currentTab,
      multiple: 0
    });
  }

  render() {
    const {
      loading,
      queryParams,
      lotteryCampaignDetailQuery
      // winners,
    } = this.props;
    const { currentTab } = this.state;
    const lotteryCampaign = lotteryCampaignDetailQuery.lotteryCampaignDetail;

    const actionBarLeft = <Title>{'Lottery Award'} </Title>;

    const parseDate = (value: any) => {
      return moment(value).format('MM/D/YYYY');
    };

    const detailBtn = (
      <Button btnStyle="success" size="small" icon="plus-circle">
        Detail
      </Button>
    );

    const RowDiv = ({ head, value, isdate }) => (
      <div>
        <strong>{head}:</strong>
        {isdate ? parseDate(value) : value}
      </div>
    );
    const LotteryDetail = () => {
      return (
        <Container>
          <p>
            <strong>Title:</strong>
            {lotteryCampaign?.title}
          </p>
          <RowDiv
            head="Buy Score"
            isdate={false}
            value={lotteryCampaign?.buyScore}
          />
          <RowDiv
            head="Start Date"
            isdate={true}
            value={lotteryCampaign?.startDate}
          />

          <RowDiv
            head="End Date"
            isdate={true}
            value={lotteryCampaign?.endDate}
          />
          <RowDiv
            head="Finish Date of Use"
            isdate={true}
            value={lotteryCampaign?.finishDateOfUse}
          />
          <RowDiv
            head="Description"
            isdate={false}
            value={
              <Description
                dangerouslySetInnerHTML={{
                  __html: lotteryCampaign?.description
                }}
              />
            }
          />
        </Container>
      );
    };
    const actionBarRight = () => {
      return (
        <ModalTrigger
          title="Lottery Detail"
          trigger={detailBtn}
          autoOpenKey="showVoucherModal"
          content={LotteryDetail}
          backDrop="static"
        />
      );
    };

    const updatedProps = {
      queryParams: { ...this.props.queryParams, awardId: currentTab._id },
      nextChar: '',
      currentTab,
      lotteryCampaign
    };

    const content = (
      <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
        <TriggerTabs>
          <Tabs full={true}>
            {lotteryCampaign?.awards.map(p => (
              <TabTitle
                className={currentTab.name === p.name ? 'active' : ''}
                onClick={this.onClick.bind(this, p)}
                key={p._id}
              >
                {p.name}
              </TabTitle>
            ))}
          </Tabs>
        </TriggerTabs>
        {currentTab && (
          <>
            <AwardContent {...updatedProps} />
          </>
        )}
      </div>
    );
    const actionBar = (
      <Wrapper.ActionBar left={actionBarLeft} right={actionBarRight()} />
    );
    return (
      <Wrapper
        actionBar={actionBar}
        leftSidebar={
          <Sidebar
            loadingMainQuery={loading}
            queryParams={queryParams}
            history={history}
            isAward={false}
          />
        }
        content={content}
      />
    );
  }
}
export default VouchersAward;
