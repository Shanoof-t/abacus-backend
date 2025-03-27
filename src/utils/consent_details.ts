const createConsentData = (mobileNumber: string) => {
  const consentData = JSON.stringify({
    consentDuration: {
      unit: "MONTH",
      value: "24",
    },
    purpose: {
      code: "101",
      text: "To get transaction history for calculation",
      refUri: "https://api.rebit.org.in/aa/purpose/101.xml",
      category: {
        type: "Wealth management service",
      },
    },
    vua: `${mobileNumber}@onemoney`,
    dataRange: {
      from: "2022-12-01T00:00:00Z",
      to: "2023-08-12T00:00:00Z",
    },
    consentMode: "STORE",
    consentTypes: ["TRANSACTIONS"],
    context: [],
    redirectUrl: "http://localhost:3000/settings",
  });
  return consentData;
};

export default createConsentData;
