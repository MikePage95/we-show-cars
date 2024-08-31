const parsePrice = (priceStr: string): number => {
  return parseFloat(priceStr.replace(/[^0-9.]/g, ''));
};

export { parsePrice };
