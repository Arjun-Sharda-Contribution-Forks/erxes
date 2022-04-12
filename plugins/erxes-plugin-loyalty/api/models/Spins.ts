import { changeScoreOwner, commonSchema } from './CompaignUtils';
import { randomBetween } from './utils';
import { SPIN_STATUS } from './Constants';

export const spinSchema = {
  ...commonSchema,
  status: { type: String, enum: SPIN_STATUS.ALL, default: 'new' },

  voucherCompaignId: { type: String, label: 'Source Voucher Compaign', optional: true },

  // won
  awardId: { type: String, label: 'Won award' },
  voucherId: { type: String, label: 'Won Voucher', optional: true }
};

export class Spin {
  public static async getSpin(models, _id: string) {
    const spin = await models.Spins.findOne({ _id }).lean();

    if (!spin) {
      throw new Error('not found spin rule')
    }

    return spin;
  }

  public static async getSpins(models, { ownerType, ownerId, statuses }: { ownerType: string, ownerId: string, statuses: string[] }) {
    return await models.Spins.find({ ownerType, ownerId, status: { $in: statuses || [] } }).lean()
  }

  public static async createSpin(models, { compaignId, ownerType, ownerId, voucherCompaignId = '', userId = '' }) {
    if (!ownerId || !ownerType) {
      throw new Error('Not create spin, owner is undefined');
    }

    const spinCompaign = await models.SpinCompaigns.getSpinCompaign(models, compaignId);

    const now = new Date();

    if (spinCompaign.startDate > now || spinCompaign.endDate < now) {
      throw new Error('Not create spin, expired');
    }

    return await models.Spins.create({ compaignId, ownerType, ownerId, createdAt: new Date(), status: SPIN_STATUS.NEW, voucherCompaignId, userId })
  }

  public static async updateSpin(models, _id, { ownerType, ownerId, status, userId = '' }) {
    if (!ownerId || !ownerType) {
      throw new Error('Not create spin, owner is undefined');
    }

    const spin = await models.Spins.findOne({ _id }).lean();
    const compaignId = spin.compaignId;

    await models.SpinCompaigns.getSpinCompaign(models, compaignId);

    const now = new Date();

    return await models.Spins.updateOne({ _id, }, {
      $set: {
        compaignId, ownerType, ownerId, modifiedAt: now, status, userId
      }
    })
  }

  public static async buySpin(models, { compaignId, ownerType, ownerId, count = 1 }) {
    if (!ownerId || !ownerType) {
      throw new Error('can not buy spin, owner is undefined');
    }

    const spinCompaign = await models.SpinCompaigns.getSpinCompaign(models, compaignId);

    if (!spinCompaign.buyScore) {
      throw new Error('can not buy this spin')
    }

    await changeScoreOwner(models, { ownerType, ownerId, changeScore: -1 * spinCompaign.buyScore * count });

    return models.Spins.createSpin(models, { compaignId, ownerType, ownerId });
  }

  public static async removeSpins(models, _ids: string[]) {
    return models.Spins.deleteMany({ _id: { $in: _ids } })
  }

  public static async doSpin(models, { spinId }) {
    const spin = await models.Spins.getSpin(models, spinId);
    const { ownerType, ownerId } = spin;
    const spinCompaign = await models.SpinCompaigns.getSpinCompaign(models, spin.compaignId);

    const now = new Date();

    if (spinCompaign.startDate > now || spinCompaign.endDate < now) {
      throw new Error('This spin is expired');
    }

    const awards = spinCompaign.awards;

    const intervals = [];
    let intervalBegin = 0;
    for (const award of awards) {
      const min = intervalBegin;
      const max = intervalBegin + award.probability;
      intervals.push({
        awardId: award._id,
        min, max
      })
      intervalBegin = intervalBegin + award.probability;
    }

    const random = randomBetween(0, 100);

    const interval = intervals.find(i => (i.min <= random && random < i.max));

    if (!interval) {
      await models.Spins.updateOne({ _id: spinId }, { status: SPIN_STATUS.LOSS, usedAt: new Date() });
      return models.Spins.getSpin(models, spinId);
    }

    const award = awards.find(a => a._id === interval.awardId);
    const voucher = await models.Vouchers.createVoucher(models, { compaignId: award.voucherCompaignId, ownerType, ownerId });
    await models.Spins.updateOne({ _id: spinId }, { status: SPIN_STATUS.WON, voucherId: voucher._id, awardId: award._id, usedAt: new Date() });

    return models.Spins.getSpin(models, spinId);
  }
}