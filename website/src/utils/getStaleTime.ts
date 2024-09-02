export const getStaleTime = () => {
  const TWENTY_SECONDS = 1000 * 20;
  const TEN_MINUTES = 1000 * 60 * 10;
  const STARTED_AT = +(process.env.NEXT_PUBLIC_STARTED_AT as string);

  const currentTime = Date.now();
  const timeDifference = Math.abs(STARTED_AT * 1000 - currentTime);

  if (timeDifference <= TEN_MINUTES) {
    return TWENTY_SECONDS;
  } else {
    return TEN_MINUTES;
  }
};
