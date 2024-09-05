export const getCurrentTokenId = () => {
  const STARTED_AT = +(process.env.NEXT_PUBLIC_STARTED_AT as string);
  const EPOCH_DURATION = 86400; // 1 Day in seconds
  const secondsSinceStart = Math.floor(Date.now() / 1_000) - STARTED_AT;
  const currentTokenId = Math.ceil(secondsSinceStart / EPOCH_DURATION);

  return currentTokenId.toString();
};
