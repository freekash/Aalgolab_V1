// simulation/backtest helpers
module.exports = {
  runBacktest(params) {
    const {
      candles = [],
      feeRate = 0.001,
      slippagePct = 0.0005,
      initialEquity = 1000
    } = params;

    if (!Array.isArray(candles)) {
      throw new Error('candles must be an array');
    }

    const pnlCurve = [initialEquity];
    let equity = initialEquity;
    let wins = 0, losses = 0;
    let peak = equity, maxDrawdown = 0;

    for (let i = 1; i < candles.length; i++) {
      const candle = candles[i];
      const slippage = candle.open * slippagePct * (Math.random() * 2 - 1);
      const entryPrice = candle.open + slippage;
      const entryFee = entryPrice * feeRate;
      const exitFee = candle.close * feeRate;

      // Simplified: long entry at open, exit at close; fees applied on both legs
      const pnl = (candle.close - entryPrice) - entryFee - exitFee;
      equity += pnl;
      if (pnl > 0) wins++;
      else if (pnl < 0) losses++;

      peak = Math.max(peak, equity);
      maxDrawdown = Math.max(maxDrawdown, peak > 0 ? (peak - equity) / peak : 0);
      pnlCurve.push(equity);
    }

    return {
      pnlCurve,
      stats: {
        finalEquity: equity,
        totalReturn: ((equity - initialEquity) / initialEquity) * 100,
        wins,
        losses,
        maxDrawdown
      }
    };
  }
};
