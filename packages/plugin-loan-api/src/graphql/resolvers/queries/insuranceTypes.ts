import { paginate } from 'erxes-api-utils';

const generateFilter = async (params, commonQuerySelector) => {
  const filter: any = commonQuerySelector;

  if (params.searchValue) {
    filter.searchText = { $in: [new RegExp(`.*${params.searchValue}.*`, 'i')] };
  }

  if (params.ids) {
    filter._id = { $in: params.ids };
  }

  return filter;
};

export const sortBuilder = (params) => {
  const sortField = params.sortField;
  const sortDirection = params.sortDirection || 0;

  if (sortField) {
    return { [sortField]: sortDirection };
  }

  return {};
};

const insuranceTypeQueries = {
  /**
   * InsuranceTypes list
   */

  insuranceTypes: async (
    _root,
    params,
    { commonQuerySelector, models, checkPermission, user }
  ) => {
    await checkPermission('showInsuranceTypes', user);
    return paginate(
      models.InsuranceTypes.find(
        await generateFilter(params, commonQuerySelector)
      ),
      {
        page: params.page,
        perPage: params.perPage,
      }
    );
  },

  /**
   * InsuranceTypes for only main list
   */

  insuranceTypesMain: async (
    _root,
    params,
    { commonQuerySelector, models, checkPermission, user }
  ) => {
    await checkPermission('showInsuranceTypes', user);
    const filter = await generateFilter(params, commonQuerySelector);

    return {
      list: paginate(
        models.InsuranceTypes.find(filter).sort(sortBuilder(params)),
        {
          page: params.page,
          perPage: params.perPage,
        }
      ),
      totalCount: models.InsuranceTypes.find(filter).count(),
    };
  },

  /**
   * Get one insuranceType
   */

  insuranceTypeDetail: async (
    _root,
    { _id },
    { models, checkPermission, user }
  ) => {
    await checkPermission('showInsuranceTypes', user);
    return models.InsuranceTypes.getInsuredType(models, { _id });
  },
};

export default insuranceTypeQueries;
