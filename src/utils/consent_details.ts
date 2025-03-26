const createConsentData = (mobileNumber: string) => {
  // const dateNow = new Date();
  // const expiry = new Date(new Date().getTime() + 600000);
  // const consentData = JSON.stringify({
  //   // consentStart: dateNow.toISOString(),
  //   // consentExpiry: expiry.toISOString(),
  //   // customer: {
  //   //   id: mobileNumber + "@onemoney",
  //   // },
  //   dataRange: {
  //     from: "2020-04-01T00:00:00Z",
  //     to: "2023-01-01T00:00:00Z",
  //   },
  //   vua: mobileNumber + "@onemoney",
  //   // dataRange: {
  //   //   startDate: "2021-04-01T00:00:00Z",
  //   //   endDate: "2021-04-01T00:00:00Z",
  //   // },
  //   consentMode: "STORE",
  //   consentTypes: ["TRANSACTIONS", "PROFILE", "SUMMARY"],
  //   fetchType: "PERIODIC",
  //   frequency: {
  //     value: 30,
  //     unit: "MONTH",
  //   },
  //   dataFilter: [
  //     {
  //       type: "TRANSACTIONAMOUNT",
  //       value: "5000",
  //       operator: ">=",
  //     },
  //   ],
  //   dataLife: {
  //     value: 1,
  //     unit: "MONTH",
  //   },
  //   // dataConsumer: {
  //   //   id: "setu-fiu-id",
  //   // },
  //   purpose: {
  //     category: {
  //       type: "TRANSACTIONS",
  //     },
  //     code: "101",
  //     text: "Loan underwriting",
  //     refUri: "https://api.rebit.org.in/aa/purpose/101.xml",
  //   },
  //   fiTypes: ["DEPOSIT"],

  //   redirectUrl: "http://localhost:3000/settings",
  // });
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
    redirectUrl: "http://localhost:3000/settings"
  });
  return consentData;
};

export default createConsentData;
